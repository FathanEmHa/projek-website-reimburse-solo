<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReimburseItem;
use App\Models\ReimburseRequest;
use App\Models\ReimbursePayment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // 1. Lihat semua item yang bisa dibayar
    public function pendingRequests()
    {
        $requests = ReimburseRequest::where('status', '!=', 'draft' || "canceled") // hanya item approved manager
                    ->with('user')
                    ->get();

        return response()->json([
            'message' => 'Pending reimburse request for finance',
            'data' => $requests
        ]);
    }

    public function showRequest($id)
    {
        $req = ReimburseRequest::where('id', $id)
        ->with('user', 'items')
        ->find($id);

        if (!$req) {
            return response()->json([
                'message' => 'Request Not Found'
            ], 404);
        }

        return response()->json([
            'data' => $req,
        ]);
    }

    public function payItem(Request $request, $itemId)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'transaction_ref' => 'nullable|string',
        ]);

        $item = ReimburseItem::findOrFail($itemId);

        if ($item->status !== 'approved') {
            return response()->json(['message' => 'Item not approved by manager, cannot pay'], 400);
        }

        if ($item->finance_status === 'paid') {
            return response()->json(['message' => 'Item already paid'], 400);
        }

        DB::transaction(function () use ($item, $request) {
            // update item
            $item->update(['finance_status' => 'paid']);

            // insert payment
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
            'message' => 'Item paid',
            'data' => $item->load('payments'),
        ]);
    }

    // 3. Bayar semua item sekaligus (batch)
    public function payAll(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'transaction_ref' => 'nullable|string',
        ]);

        $items = ReimburseItem::where('status', 'approved')
                    ->where('finance_status', 'pending')
                    ->get();

        DB::transaction(function () use ($items, $request) {
            foreach ($items as $item) {
                $item->update(['finance_status' => 'paid']);

                ReimbursePayment::create([
                    'reimburse_item_id' => $item->id,
                    'amount'            => $item->amount,
                    'payment_method'    => $request->payment_method,
                    'transaction_ref'   => $request->transaction_ref,
                    'paid_by'           => auth('api')->id(),
                    'payment_date'      => now(),
                ]);
            }
        });

        return response()->json([
            'message' => 'All approved items have been paid',
            'data' => $items->load('payments'),
        ]);
    }
}