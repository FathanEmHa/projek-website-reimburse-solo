<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReimburseItem;
use App\Models\ReimburseRequest;
use App\Models\ReimbursePayment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // 1. Lihat semua request yg bisa diproses finance
    public function pendingRequests()
    {
        $requests = ReimburseRequest::whereNotIn('status', ['draft', 'canceled', 'submitted'])
                    ->with('user')
                    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Pending reimburse requests for finance',
            'data'    => $requests,
        ]);
    }

    // 2. Detail 1 request (beserta item & user)
    public function showRequest($id)
    {
        $req = ReimburseRequest::with('user', 'items')->find($id);

        if (!$req) {
            return response()->json([
                'success' => false,
                'message' => 'Request not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $req,
        ]);
    }

    // 3. Bayar per item
    public function payItem(Request $request, $itemId)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'transaction_ref' => 'nullable|string',
        ]);

        $item = ReimburseItem::findOrFail($itemId);

        if ($item->status !== 'approved') {
            return response()->json(['success' => false, 'message' => 'Item not approved by manager, cannot pay'], 400);
        }

        if ($item->finance_status === 'paid') {
            return response()->json(['success' => false, 'message' => 'Item already paid'], 400);
        }

        DB::transaction(function () use ($item, $request) {
            $item->update(['finance_status' => 'paid']);

            ReimbursePayment::create([
                'reimburse_item_id' => $item->id,
                'amount'            => $item->amount,
                'payment_method'    => $request->payment_method,
                'transaction_ref'   => $request->transaction_ref,
                'paid_by'           => auth('api')->id(),
                'payment_date'      => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Item paid',
            'data'    => $item->load('payments'),
        ]);
    }

    // 4. Bayar semua item approved sekaligus
    public function payAll(Request $request, $requestId)
    {
        $request->validate([
            'payment_method'   => 'required|string|in:transfer',
            'transaction_ref'  => 'required|string',
            'remarks'          => 'nullable|string',
        ]);

        $req = ReimburseRequest::with('items')->find($requestId);

        if (!$req) {
            return response()->json([
                'success' => false,
                'message' => 'Request not found',
            ], 404);
        }

        // Ambil semua item yang approved + masih pending finance
        $items = $req->items()
            ->where('status', 'approved')
            ->where('finance_status', 'pending')
            ->get();

        if ($items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No approved items to pay',
            ], 400);
        }

        DB::transaction(function () use ($items, $request, $req) {
            // Update semua item jadi paid
            $req->items()
                ->where('status', 'approved')
                ->update(['finance_status' => 'paid']);

            // Update item jadi rejected
            $req->items()
                ->where('status', 'rejected')
                ->update(['finance_status' => 'rejected']);

            // Buat 1 record pembayaran untuk keseluruhan request
            ReimbursePayment::create([
                'reimburse_request_id' => $req->id,
                'amount'            => $req->total_amount, // total dari request
                'payment_method'    => $request->payment_method,
                'transaction_ref'   => $request->transaction_ref,
                'remarks'           => $request->remarks,
                'paid_by'           => auth('api')->id(),
                'payment_date'      => now(),
            ]);

            // Setelah semua item paid → update request jadi closed
            $req->update(['status' => 'closed']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Request has been fully paid and closed',
            'data'    => ReimburseRequest::with(['items', 'payments'])->find($req->id),
        ]);
    }
}
