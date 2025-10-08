import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  // 🔹 Coba fetch dari endpoint draft dulu, kalau gagal → fallback ke request
  const fetchRequest = async () => {
    try {
      // Coba fetch detail draft
      let res = await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRequest(data);
        setIsDraft(true);
        return;
      }

      // Jika bukan draft, coba ke request
      res = await fetch(`http://localhost:8000/api/reimburse/request/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setRequest(data);
      setIsDraft(false);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  // Hapus 1 item
  const handleDeleteItem = async (itemId) => {
    try {
      await fetch(`http://localhost:8000/api/reimburse/item/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      await fetchRequest();
    } catch (err) {
      console.error("Gagal hapus item:", err);
    }
  };

  // Hapus semua item
  const handleDeleteAll = async () => {
    try {
      await fetch(`http://localhost:8000/api/reimburse/request/${id}/items`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      await fetchRequest();
    } catch (err) {
      console.error("Gagal hapus semua item:", err);
    }
  };

  // Cancel request
  const handleCancelRequest = async () => {
    try {
      await fetch(`http://localhost:8000/api/reimburse/request/${id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      await fetchRequest();
    } catch (err) {
      console.error("Gagal cancel request:", err);
    }
  };

  // Kirim draft → jadi request
  const handleSubmitDraft = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/reimburse/${id}/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengirim draft");
      alert("Draft berhasil dikirim 🚀");
      navigate("/dashboard/employee/myRequest");
    } catch (err) {
      console.error(err);
    }
  };

  // Hapus draft
  const handleDeleteDraft = async () => {
    try {
      await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      alert("Draft dihapus");
      navigate("/dashboard/employee/myRequest");
    } catch (err) {
      console.error("Gagal hapus draft:", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!request) return <p className="p-6">Loading...</p>;

  // Map status → badge warna
  const renderStatusItem = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "approved_manager":
        return <Badge variant="success">Approved</Badge>;
      case "rejected_manager":
        return <Badge variant="destructive">Rejected</Badge>;
      case "partially_approved":
        return <Badge variant="warning">Partially Approved</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "closed":
        return <Badge variant="default">Closed</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const status = request.data?.status || "unknown";
  const isRequestLocked = ["approved_manager", "rejected_manager", "partially_approved", "canceled", "paid"].includes(status);

  return (
    <div className="p-6 space-y-4 text-black">
      <h1 className="text-xl font-bold mb-4">
        {isDraft ? "Detail Draft" : "Detail Request"}
      </h1>

      {/* Info Utama */}
      <div className="space-y-1">
        <p><b>Kode:</b> {request.data.request_code}</p>
        <p><b>User:</b> {request.data.user?.name}</p>
        <p><b>Tanggal:</b> {request.data.date_submitted || "-"}</p>
        <p><b>Status:</b> {renderStatus(status)}</p>
        <p><b>Total:</b> Rp {Number(request.data.total_amount).toLocaleString("id-ID")}</p>
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
              {!isDraft && <TableHead>Finance Status</TableHead>}
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
                  <TableCell>Rp {Number(item.amount).toLocaleString("id-ID")}</TableCell>
                  <TableCell>{item.payment_method}</TableCell>
                  <TableCell>{renderStatusItem(item.status)}</TableCell>
                  {!isDraft && (<TableCell>{renderStatusItem(item.finance_status)}</TableCell>)}
                  <TableCell>{item.invoice_number}</TableCell>
                  <TableCell>
                    {!isRequestLocked && (
                      <ConfirmDialog
                        trigger={<Button variant="destructive">Hapus</Button>}
                        title="Hapus Item"
                        description="Apakah Anda yakin ingin menghapus item ini?"
                        onConfirm={() => handleDeleteItem(item.id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Tidak ada item pengeluaran
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-2">
        <Link to={isDraft ? "/dashboard/employee/myDrafts" : "/dashboard/employee/myRequest"}>
          <Button variant="outline">Kembali</Button>
        </Link>
        
        {isDraft ? (
          <>
            <Link to={`/dashboard/employee/form/${id}`}>
              <Button variant="default">Edit Draft</Button>
            </Link>
            <ConfirmDialog
              trigger={<Button variant="success">Kirim Draft</Button>}  
              title="Kirim Draft"
              description="Kirim draft ini untuk diajukan sebagai reimburse resmi?"
              onConfirm={handleSubmitDraft}
            />
            <ConfirmDialog
              trigger={<Button variant="destructive">Hapus Draft</Button>}
              title="Hapus Draft"
              description="Yakin ingin menghapus draft ini?"
              onConfirm={handleDeleteDraft}
            />
          </>
        ) : (
          !isRequestLocked && (
            <>
              <ConfirmDialog
                trigger={<Button variant="destructive">Hapus Semua</Button>}
                title="Hapus Semua Item"
                description="Apakah Anda yakin ingin menghapus semua item?"
                onConfirm={handleDeleteAll}
              />
              {status !== "canceled" && (
                <ConfirmDialog
                  trigger={<Button variant="warning">Cancel Request</Button>}
                  title="Batalkan Request"
                  description="Apakah Anda yakin ingin membatalkan request ini?"
                  onConfirm={handleCancelRequest}
                />
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}
