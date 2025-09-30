import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Eye } from "lucide-react";
import { getToken } from "@/utils/auth";
import { Link } from "react-router-dom";

export default function DaftarPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/manager/reimburse/requests", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const json = await res.json();
        setPengajuan(json.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };

    fetchData();
  }, []);

  // Map status ke badge warna
  const renderStatus = (status) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "approved_manager":
        return <Badge variant="success">Approved_Manager</Badge>;
      case "rejected_manager":
        return <Badge variant="destructive">Rejected_Manager</Badge>;
      case "partially_approved":
        return <Badge variant="secondary">Partially_Approved</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(pengajuan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = pengajuan.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 text-black">
      <h1 className="text-xl font-semibold mb-4 text-black">Daftar Pengajuan</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Karyawan</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>Rp {item.total_amount.toLocaleString()}</TableCell>
                <TableCell>{item.date_submitted}</TableCell>
                <TableCell>{renderStatus(item.status)}</TableCell>
                <TableCell className="flex gap-2">
                  <Link to={`/dashboard/manager/request/${item.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Tidak ada data pengajuan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
