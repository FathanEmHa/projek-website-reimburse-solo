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

export default function DetailPageKaryawan() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  // Fetch detail request
  const fetchRequest = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/reimburse/request/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await res.json();
      setRequest(data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  // Hapus 1 item
  const handleDeleteItem = async (itemId) => {
    try {
      await fetch(
        `http://localhost:8000/api/reimburse/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      await fetchRequest();
    } catch (err) {
      console.error("Gagal hapus item:", err);
    }
  };

  // Hapus semua item
  const handleDeleteAll = async () => {
    try {
      await fetch(
        `http://localhost:8000/api/reimburse/request/${id}/items`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      await fetchRequest();
    } catch (err) {
      console.error("Gagal hapus semua item:", err);
    }
  };

  // Cancel request
  const handleCancelRequest = async () => {
    try {
      await fetch(
        `http://localhost:8000/api/reimburse/request/${id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      await fetchRequest();
    } catch (err) {
      console.error("Gagal cancel request:", err);
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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Request udah final → tombol di-lock
  const isRequestLocked =
    request.status === "approved_manager" ||
    request.status === "rejected_manager" ||
    request.status === "partially_approved" ||
    request.status === "canceled";

  return (
    <div className="p-6 space-y-4 text-black">
      <h1 className="text-xl font-bold mb-4">Detail Request</h1>

      {/* Info Utama */}
      <div className="space-y-1">
        <p><b>Kode:</b> {request.data.request_code}</p>
        <p><b>User:</b> {request.data.user?.name}</p>
        <p><b>Tanggal:</b> {request.data.date_submitted}</p>
        <p><b>Status:</b> {request.data.status}</p>
        <p>
          <b>Total:</b> Rp {Number(request.data.total_amount).toLocaleString("id-ID")}
        </p>
        <p><b>Catatan:</b> {request.data.notes}</p>
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
              <TableHead>Invoice</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.data.items?.length > 0 ? (
              request.data.items.map((item, index) => (
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
                  <TableCell>{item.invoice_number}</TableCell>
                  <TableCell>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="destructive"
                          disabled={isRequestLocked}
                        >
                          Hapus
                        </Button>
                      }
                      title="Hapus Item"
                      description="Apakah Anda yakin ingin menghapus item ini?"
                      onConfirm={() => handleDeleteItem(item.id)}
                    />
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
        <Link to="/dashboard/employee/myRequest">
          <Button variant="outline">Kembali</Button>
        </Link>

        {!isRequestLocked && (
          <>
            <ConfirmDialog
              trigger={<Button variant="destructive">Hapus Semua</Button>}
              title="Hapus Semua Item"
              description="Apakah Anda yakin ingin menghapus semua item?"
              onConfirm={handleDeleteAll}
            />
            {request.data.status !== "canceled" && (
            <ConfirmDialog
              trigger={
              <Button variant="warning">Cancel Request</Button>}
              title="Batalkan Request"
              description="Apakah Anda yakin ingin membatalkan request ini?"
              onConfirm={handleCancelRequest}
            />
            )}
          </>
        )}
      </div>
    </div>
  );
}
