import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { formatRupiah } from "@/utils/format";
import { renderStatus } from "@/components/render/RenderStatus";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/reimburse/request", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Gagal fetch data");

        const data = await res.json();
        setRequests(data.data || []); // sesuaikan struktur respons lo
        // Hitung statistik
        const approved = data.data.filter((r) => r.status === "approved_manager").length;
        const rejected = data.data.filter((r) => r.status === "rejected_manager").length;
        const submitted = data.data.filter((r) => r.status === "submitted").length;
        setStats({
          totalRequests: data.data.length,
          approved,
          rejected,
          submitted,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="bg-body-gradient dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-8">
        Dashboard Home
      </h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 💙 Total Pengajuan */}
        <div className="animate-[float_4s_ease-in-out_infinite] p-4 bg-gradient-to-br from-blue-500/40 via-blue-400/20 to-blue-300/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <p className="text-white dark:text-white-100">Total Pengajuan</p>
          <p className="text-2xl font-bold text-white dark:text-blue-500">
            {stats.totalRequests}
          </p>
        </div>

        {/* 💚 Diterima */}
        <div className="animate-[float_4s_ease-in-out_infinite] p-4 bg-gradient-to-br from-green-500/40 via-green-400/20 to-green-300/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] [animation-delay:0.5s]">
          <p className="text-white dark:text-white-100">Diterima</p>
          <p className="text-2xl font-bold text-green-100">
            {stats.approved}
          </p>
        </div>

        {/* ❤️ Ditolak */}
        <div className="animate-[float_4s_ease-in-out_infinite] p-4 bg-gradient-to-br from-red-500/40 via-red-400/20 to-red-300/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] [animation-delay:1s]">
          <p className="text-white dark:text-white-100">Ditolak</p>
          <p className="text-2xl font-bold text-red-100">
            {stats.rejected}
          </p>
        </div>

        {/* 💛 Menunggu */}
        <div className="animate-[float_4s_ease-in-out_infinite] p-4 bg-gradient-to-br from-yellow-500/40 via-yellow-400/20 to-yellow-300/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] [animation-delay:1.5s]">
          <p className="text-white dark:text-white-100">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-100">
            {stats.submitted}
          </p>
        </div>
      </div>

      <div
        className="mt-8 bg-gradient-to-br from-[#0A1228] to-[#0C1A3A]
        border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90">
            Daftar Pengajuan
          </h2>
          <p className="text-sm text-white/50">October 2025</p>
        </div>

        <div
          className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40"
        >
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Kode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Total Pengeluaran</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {requests.slice(0, 20).map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.request_code || "-"}</TableCell>
                  <TableCell>{renderStatus(req.status)}</TableCell>
                  <TableCell>{req.notes || "-"}</TableCell>
                  <TableCell>{formatRupiah(req.total_amount)}</TableCell>
                  <TableCell className="text-right text-white/70">
                    {new Date(req.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
