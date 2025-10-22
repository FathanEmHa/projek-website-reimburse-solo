import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/AlertDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export default function DetailPageManager() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  // Fetch detail request
  const fetchRequest = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/manager/reimburse/requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await res.json();
      setRequest(data.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  // Tambahin fungsi khusus buat approve-all / reject-all request
  const handleRequestAction = async (action) => {
    try {
      await fetch(
        `http://localhost:8000/api/manager/reimburse/requests/${id}/approve-all`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, remarks: "" }),
        }
      );
      await fetchRequest();
    } catch (err) {
      console.error(`Gagal ${action}:`, err);
    }
  };

  // Kirim action ke API
  const handleAction = async (itemId, action) => {
    try {
      await fetch(
        `http://localhost:8000/api/manager/reimburse/items/${itemId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            remarks: "",
          }),
        }
      );
      await fetchRequest();
    } catch (err) {
      console.error(`Gagal ${action}:`, err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!request) return <p className="p-6">Loading...</p>;

  // Map status item → badge warna
  const renderStatusItem = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>
      case "paid":
        return <Badge variant="success">Paid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Biar rapih: lock kalau request udah final
  const isRequestLocked =
    request.status === "approved_manager" ||
    request.status === "rejected_manager";

  return (
    <div className="p-6 space-y-4 text-black">
      <h1 className="text-xl font-bold mb-4">Detail Request</h1>

      {/* Info Utama */}
      <div className="space-y-1">
        <p><b>Kode:</b> {request.request_code}</p>
        <p><b>User:</b> {request.user?.name}</p>
        <p><b>Tanggal:</b> {request.date_submitted}</p>
        <p><b>Status:</b> {request.status}</p>
        <p>
          <b>Total:</b> Rp {Number(request.total_amount).toLocaleString("id-ID")}
        </p>
        <p><b>Catatan:</b> {request.notes}</p>
      </div>

      {/* Detail Items */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Rincian Pengeluaran</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finance Status</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.items.length > 0 ? (
              request.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.expense_date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    Rp {Number(item.amount).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{item.payment_method}</TableCell>
                  <TableCell>{renderStatusItem(item.status)}</TableCell>
                  <TableCell>{renderStatusItem(item.finance_status)}</TableCell>
                  <TableCell>{item.invoice_number}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Approve button */}
                      <Button
                        variant="default"
                        disabled={isRequestLocked || item.status === "approved"}
                        onClick={() => handleAction(item.id, "approved_item")}
                      >
                        Approve
                      </Button>

                      {/* Reject button */}
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="destructive"
                            disabled={isRequestLocked || item.status === "rejected"}
                          >
                            Reject
                          </Button>
                        }
                        title="Tolak Item"
                        description="Apakah Anda yakin ingin menolak item ini? Tindakan ini tidak bisa dibatalkan."
                        onConfirm={() => handleAction(item.id, "rejected_item")}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Tidak ada item pengeluaran
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-2">
        <Link to="/dashboard/manager/request">
          <Button variant="outline">Kembali</Button>
        </Link>

        {/* Approve-All & Reject-All muncul kalau masih submitted */}
        {request.status === "submitted" && (
          <>
            <Button
              variant="default"
              onClick={() => handleRequestAction("approved_manager")}
            >
              Approve Semua
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleRequestAction("rejected_manager")}
            >
              Reject Semua
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
