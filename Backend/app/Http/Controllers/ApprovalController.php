<?php

namespace App\Http\Controllers;

use App\Models\ReimburseItem;
use App\Models\ReimburseRequest;
use App\Models\ReimburseApproved;
use App\Models\ReimburseItemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    public function submittedRequests()
    {
        $pendingRequests = ReimburseRequest::where('status', '!=', 'draft')
            ->with('user')
            ->get();

        return response()->json([
            'data' => $pendingRequests,
        ]);
    }

    public function showRequest($id)
    {
        $request = ReimburseRequest::where('id', $id)
        ->with('user', 'items')
        ->find($id);

        if (!$request) {
            return response()->json([
                'message' => 'Request Not Found'
            ], 404);
        }

        return response()->json([
            'data' => $request,
        ]);

    }

    /**
     * Action at item level: approve/reject/pay per item.
     * Will always create an item log. Then it recalculates request status
     * and if request status changed, create one request-level approval log.
     */
    public function approveItem(Request $request, $itemId)
    {
        $request->validate([
            'action' => 'required|in:approved_item,rejected_item',
            'remarks' => 'nullable|string',
        ]);

        $item = ReimburseItem::findOrFail($itemId);

        DB::transaction(function () use ($item, $request) {
            // 1) create item log
            ReimburseItemLog::create([
                'reimburse_item_id'   => $item->id,
                'reimburse_request_id'=> $item->request_id,
                'acted_by'            => auth('api')->id(),
                'action'              => $request->action,
                'remarks'             => $request->remarks,
            ]);

            // 2) update item status
            $newItemStatus = match ($request->action) {
                'approved_item' => 'approved',
                'rejected_item' => 'rejected',
                default         => $item->status,
            };

            $item->update(['status' => $newItemStatus]);

            // 3) recalculate overall request status
            $allItems = $item->request->items()->get();

            if ($allItems->every(fn($i) => $i->status === 'approved')) {
                $computedRequestStatus = 'approved_manager';
            } elseif ($allItems->every(fn($i) => $i->status === 'rejected')) {
                $computedRequestStatus = 'rejected_manager';
            } 
            // ✅ semua item final (approved+paid atau rejected)
            elseif ($allItems->every(fn($i) => in_array($i->status, ['paid', 'rejected']))) {
                $computedRequestStatus = 'closed';
            } else {
                $computedRequestStatus = 'partially_approved';
            }

            // 4) update request + log once if changed
            $requestModel = $item->request->fresh();

            if ($requestModel->status !== $computedRequestStatus) {
                $requestModel->update(['status' => $computedRequestStatus]);

                ReimburseApproved::create([
                    'reimburse_request_id' => $requestModel->id,
                    'approved_by'          => auth('api')->id(),
                    'action'               => $computedRequestStatus,
                    'remarks'              => $request->remarks,
                    'approved_at'          => now(),
                ]);
            }
        });

        return response()->json([
            'message' => 'Item processed and logs saved',
            'data'    => $item->request->load('items', 'approvedLogs'),
        ]);
    }

    /**
     * Action at request level: manager/finance approves the whole request (one action).
     * This will set request->status and create one reimburse_approved entry.
     */
    public function approveAllItems(Request $request, $requestId)
    {
        $request->validate([
            'action'  => 'required|in:approved_manager,rejected_manager',
            'remarks' => 'nullable|string',
        ]);

        $req = ReimburseRequest::findOrFail($requestId);

        DB::transaction(function () use ($req, $request) {
            $newStatus = $request->action;

            // Update request status
            $req->update(['status' => $newStatus]);

            // Buat log request-level
            ReimburseApproved::create([
                'reimburse_request_id' => $req->id,
                'approved_by'          => auth('api')->id(),
                'action'               => $newStatus,
                'remarks'              => $request->remarks,
                'approved_at'          => now(),
            ]);

            // Mapping status request -> status item
            $itemStatus = match ($newStatus) {
                'approved_manager' => 'approved',
                'rejected_manager' => 'rejected',
                default            => null,
            };

            if ($itemStatus) {
                foreach ($req->items as $item) {
                    // 1) buat item log
                    ReimburseItemLog::create([
                        'reimburse_item_id'   => $item->id,
                        'reimburse_request_id'=> $req->id,
                        'acted_by'            => auth('api')->id(),
                        'action'              => $itemStatus === 'approved' ? 'approved_item' : 'rejected_item',
                        'remarks'             => $request->remarks,
                    ]);

                    // 2) update status item
                    $item->update(['status' => $itemStatus]);
                }
            }
        });

        return response()->json([
            'message' => 'Request + semua item berhasil diupdate',
            'data'    => $req->fresh()->load('approvedLogs', 'items'),
        ]);
    }
}
