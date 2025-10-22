import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { renderStatus, renderStatusItem } from "@/components/render/RenderStatus";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  const fetchRequest = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/reimburse/request/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data request");
      const data = await res.json();
      setRequest(data);
    } catch (err) {
      console.error("Gagal ambil detail request:", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!request) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4 text-black">
      <h1 className="text-xl font-bold mb-4">Detail Reimburse</h1>

      <div className="space-y-1">
        <p><b>Kode:</b> {request.data.request_code}</p>
        <p><b>User:</b> {request.data.user?.name}</p>
        <p><b>Status:</b> {renderStatus(request.data.status)}</p>
        <p><b>Total:</b> Rp {Number(request.data.total_amount).toLocaleString("id-ID")}</p>
        <p><b>Catatan:</b> {request.data.notes || "-"}</p>
        <p><b>Tanggal Diajukan:</b> {request.data.created_at?.split("T")[0]}</p>
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
        <Link to="/dashboard/employee/myRequest">
          <Button variant="outline">Kembali ke Daftar Request</Button>
        </Link>
      </div>
    </div>
  );
}
