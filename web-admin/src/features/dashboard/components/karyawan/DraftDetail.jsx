import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { renderStatus, renderStatusItem } from "@/components/render/RenderStatus";
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

export default function DraftDetail() {
  const { id } = useParams();
  const [draft, setDraft] = useState(null);
  const navigate = useNavigate();

  const fetchDraft = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil draft");
      const data = await res.json();
      setDraft(data);
    } catch (err) {
      console.error("Gagal ambil detail draft:", err);
    }
  };

  const handleSubmitDraft = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/reimburse/${id}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Gagal mengirim draft");
      alert("Draft berhasil dikirim 🚀");
      navigate("/dashboard/employee/myRequest");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDraft = async () => {
    try {
      await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert("Draft dihapus");
      navigate("/dashboard/employee/myDrafts");
    } catch (err) {
      console.error("Gagal hapus draft:", err);
    }
  };

  useEffect(() => {
    fetchDraft();
  }, [id]);

  if (!draft) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4 text-black">
      <h1 className="text-xl font-bold mb-4">Detail Draft</h1>

      <div className="space-y-1">
        <p><b>Kode:</b> {draft.data.request_code}</p>
        <p><b>User:</b> {draft.data.user?.name}</p>
        <p><b>Status:</b> {renderStatus(draft.data.status)}</p>
        <p><b>Total:</b> Rp {Number(draft.data.total_amount).toLocaleString("id-ID")}</p>
        <p><b>Catatan:</b> {draft.data.notes}</p>
      </div>

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {draft.data.items?.length > 0 ? (
              draft.data.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.expense_date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>Rp {Number(item.amount).toLocaleString("id-ID")}</TableCell>
                  <TableCell>{item.payment_method}</TableCell>
                  <TableCell>{renderStatusItem(item.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada item pengeluaran
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/dashboard/employee/myDrafts">
          <Button variant="outline">Kembali</Button>
        </Link>

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
      </div>
    </div>
  );
}
