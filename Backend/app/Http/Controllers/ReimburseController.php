<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReimburseRequest;
use App\Models\ReimburseItem;
use Illuminate\Support\Facades\Auth;

class ReimburseController extends Controller
{
    // 1. Simpan langsung status submitted
    public function storeRequest(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.category_id' => 'required|exists:categories,id',
            'items.*.expense_date' => 'required|date',
            'items.*.description' => 'required|string|max:255',
            'items.*.amount' => 'required|numeric|min:0',
            'items.*.payment_method' => 'required|in:cash,transfer,e-wallet',
            'items.*.location' => 'nullable|string|max:255',
            'items.*.receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);


        $req = ReimburseRequest::create([
            'user_id' => Auth::id(),
            'request_code' => null, // Akan di-generate otomatis di model
            'date_submitted' => now(),
            'status' => 'submitted',
            'total_amount' => collect($request->items)->sum('amount'),
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $index => $item) {
            $path = null;

            if ($request->hasFile("items.$index.receipt")) {
                $path = $request->file("items.$index.receipt")->store("receipts", "public");
            }

            $req->items()->create([
                'request_id' => $req->id,
                'category_id' => $item['category_id'],
                'expense_date' => $item['expense_date'],
                'description' => $item['description'],
                'amount' => $item['amount'],
                'currency' => 'IDR',
                'payment_method' => $item['payment_method'],
                'location' => $item['location'] ?? null,
                'receipt_path' => $path,
                'status' => 'pending',
                'invoice_number' => null, // Akan di-generate otomatis di model
            ]);
        }

        return response()->json([
            'message' => 'Reimbursement submitted',
            'data' => $req->load('items'),
        ], 201);
    }

    // 2. Ambil request milik user login
    public function myRequests()
    {
        $requests = ReimburseRequest::where('user_id', Auth::id())
            ->with('user')
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'message' => 'My requests',
            'data' => $requests,
        ]);
    }

    // 2a. Ambil detail request milik user login
    public function showRequest($id)
    {
        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', '!=', 'draft')
            ->with('user', 'items')
            ->firstOrFail();

        return response()->json([
            'message' => 'Request_detail',
            'data' => $req,
        ]);
    }

    public function updateRequest(Request $request, $id)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.category_id' => 'required|exists:categories,id',
            'items.*.expense_date' => 'required|date',
            'items.*.description' => 'required|string|max:255',
            'items.*.amount' => 'required|numeric|min:0',
            'items.*.payment_method' => 'required|in:cash,transfer,e-wallet',
            'items.*.location' => 'nullable|string|max:255',
            'items.*.receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'submitted')
            ->firstOrFail();

        $req->update([
            'total_amount' => collect($request->items)->sum(function ($item) {
                return (int) ($item['amount'] * 100); // Konversi ke cents jika pakai currency
            }),
            'notes' => $request->notes,
        ]);

        ReimburseItem::where('request_id', $req->id)->delete();
        
        foreach ($request->items as $item) {
            ReimburseItem::create([
                'request_id' => $req->id,
                'category_id' => $item['category_id'],
                'expense_date' => $item['expense_date'],
                'description' => $item['description'],
                'amount' => $item['amount'],
                'payment_method' => $item['payment_method'],
                'currency' => 'IDR',
                'status' => 'pending',
                'location' => $item['location'] ?? null,
                'receipt_path' => $item['receipt_path'] ?? null,
                'invoice_number' => null,
            ]);
        }

        return response()->json([
            'message' => 'Submitted update',
            'data' => $req->load('items'),
        ]);
    }

    public function canceledRequest($id)
    {
        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', "!=", 'closed')
            ->firstOrFail();

        $req->update([
            'status' => 'canceled',
        ]);
        
        return response()->json([
            'message' => 'request canceled'
        ]);
    }

    public function deleteRequest($id)
    {
        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'canceled')
            ->firstOrFail();

        $req->delete();

        return response()->json([
            'message' => 'Request deleted'
        ]);
    }

    public function deleteItem($id)
    {
        try {
            $item = ReimburseItem::with('request')->find($id);

            if (!$item) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item tidak ditemukan',
                ], 404);
            }

            // Cek apakah user berhak
            if ($item->request->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses untuk item ini',
                ], 403);
            }

            $request = $item->request;

            // Cek apakah request bisa diubah
            if (in_array($request->status, ['approved_manager', 'rejected_manager', 'closed', 'canceled'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request sudah dikunci, item tidak bisa dihapus',
                ], 403);
            }

            // Hapus item
            $item->delete();

            // Update total_amount di parent request
            $total = $request->items()->sum('amount');
            $request->update(['total_amount' => $total]);

            return response()->json([
                'success' => true,
                'message' => 'Item berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    // 3. Simpan sebagai draft
    public function saveDraft(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.category_id' => 'required|exists:categories,id',
            'items.*.expense_date' => 'required|date',
            'items.*.description' => 'required|string|max:255',
            'items.*.amount' => 'required|numeric|min:0',
            'items.*.payment_method' => 'required|in:cash,transfer,e-wallet',
            'items.*.location' => 'nullable|string|max:255',
            'items.*.receipt_path' => 'nullable|string',
        ]);

        $req = ReimburseRequest::create([
            'user_id' => Auth::id(),
            'request_code' => null, // Akan di-generate otomatis di model
            'date_submitted' => null,
            'status' => 'draft',
            'total_amount' => collect($request->items)->sum(function ($item) {
                return (int) ($item['amount'] * 100); // Konversi ke cents jika pakai currency
            }),
            'notes' => $request->notes,
        ]);

        if ($request->items) {
            foreach ($request->items as $item) {
                ReimburseItem::create([
                    'request_id' => $req->id,
                    'category_id' => $item['category_id'],
                    'expense_date' => $item['expense_date'],
                    'description' => $item['description'],
                    'amount' => $item['amount'],
                    'payment_method' => $item['payment_method'],
                    'currency' => 'IDR',
                    'status' => 'draft',
                    'location' => $item['location'] ?? null,
                    'receipt_path' => $item['receipt_path'] ?? null,
                    'invoice_number' => null, // Akan di-generate otomatis di model
                ]);
            }
        }

        return response()->json([
            'message' => 'Draft saved',
            'data' => $req->load('items'),
        ], 201);
    }

    public function myDrafts()
    {
        $drafts = ReimburseRequest::where('user_id', Auth::id())
            ->with('user')
            ->where('status', 'draft')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'message' => 'My drafts',
            'data' => $drafts,
        ]);
    }

    public function showDraft($id)
    {
        $drafts = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->with('items', 'user')
            ->firstOrFail();

        return response()->json([
            'message' => 'Draft detail',
            'data' => $drafts,
        ]);
    }

    public function updateDraft(Request $request, $id)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.category_id' => 'required|exists:categories,id',
            'items.*.expense_date' => 'required|date',
            'items.*.description' => 'required|string|max:255',
            'items.*.amount' => 'required|numeric|min:0',
            'items.*.payment_method' => 'required|in:cash,transfer,e-wallet',
            'items.*.location' => 'nullable|string|max:255',
            'items.*.receipt_path' => 'nullable|string',
        ]);

        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->firstOrFail();

        $req->update([
            'total_amount' => collect($request->items)->sum(function ($item) {
                return (int) ($item['amount'] * 100); // Konversi ke cents jika pakai currency
            }),
            'notes' => $request->notes,
        ]);

        // Hapus item lama
        ReimburseItem::where('request_id', $req->id)->delete();
        // Simpan item baru
        foreach ($request->items as $item) {
            ReimburseItem::create([
                'request_id' => $req->id,
                'category_id' => $item['category_id'],
                'expense_date' => $item['expense_date'],
                'description' => $item['description'],
                'amount' => $item['amount'],
                'payment_method' => $item['payment_method'],
                'currency' => 'IDR',
                'status' => 'draft',
                'location' => $item['location'] ?? null,
                'receipt_path' => $item['receipt_path'] ?? null,
                'invoice_number' => null,
            ]);
        }

        return response()->json([
            'message' => 'Draft updated',
            'data' => $req->load('items'),
        ]);
    }

    // 4. Submit draft → ubah ke submitted
    public function submitDraft($id)
    {
        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->firstOrFail();

        $req->update([
            'status' => 'submitted',
            'date_submitted' => now(),
        ]);

        ReimburseItem::where('request_id', $req->id)
            ->where('status', 'draft')
            ->update([
                'status' => 'pending',
            ]);

        return response()->json([
            'message' => 'Draft submitted',
            'data' => $req->load('items'),
        ]);
    }

    public function deleteDraft($id)
    {
        $req = ReimburseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'draft')
            ->firstOrFail();

        $req->delete();

        return response()->json([
            'message' => 'Draft deleted'
        ]);
    }
}
