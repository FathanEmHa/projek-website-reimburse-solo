import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingBouncyArc } from "@/components/ui/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Eye, Pencil, XCircle, Trash } from "lucide-react";
import { formatRupiah } from "@/utils/format";

export default function DraftSaya() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // fetch semua request
  const fetchDraft = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/reimburse/drafts", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setRequests(data.data);
      setTimeout (() => {
        setIsLoading(false);
      }, 1600);
    } catch (err) {
      console.error("Gagal ambil request:", err);
    }
  };

  useEffect(() => {
    fetchDraft();
    return () => clearTimeout();
  }, []);

  // map status → badge
  const renderStatus = (status) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "approved_manager":
        return <Badge variant="success">Approved_Manager</Badge>;
      case "rejected_manager":
        return <Badge variant="destructive">Rejected_Manager</Badge>;
      case "partially_approved":
        return <Badge variant="secondary">Partially_Approved</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "closed":
        return <Badge variant="default">Closed</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  // hapus request
  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus request ini?")) return;
    try {
      await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchRequests();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  // cancel request
//   const handleCancel = async (id) => {
//     if (!confirm("Yakin mau cancel request ini?")) return;
//     try {
//       await fetch(
//         `http://localhost:8000/api/reimburse/request/${id}/cancel`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       fetchRequests();
//     } catch (err) {
//       console.error("Gagal cancel:", err);
//     }
//   };

  // --- Pagination logic ---
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = requests.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <LoadingBouncyArc fullscreen text="Memuat draft..." />;
  }

  return (
    <div className="w-full p-2 bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
      <h1 className="text-xl font-bold mb-4">Draft Saya</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Catatan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.request_code}</TableCell>
                <TableCell>{req.user?.full_name}</TableCell>
                <TableCell>{renderStatus(req.status)}</TableCell>
                <TableCell>{formatRupiah(req.total_amount) || "-"}</TableCell>
                <TableCell>{req.notes}</TableCell>
                <TableCell className="flex gap-2">
                  {/* Detail */}
                  <Link to={`/dashboard/employee/myDraft/${req.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Update
                  {req.status !== "canceled" && (
                  <Link to={`/dashboard/employee/myRequest/${req.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  )} */}

                  {/* Cancel
                  {req.status !== "canceled" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(req.id)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  )} */}

                  {/* Delete */}
                  {req.status === "canceled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(req.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada request
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
