import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getToken } from "@/utils/auth";
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

export default function DetailPageFinance() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  // Input state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [transactionRef, setTransactionRef] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch detail request
  const fetchRequest = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/finance/reimburse/showRequest/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      setRequest(data.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    }
  };

  // Kirim action ke API (bayar semua item approved)
  const handlePay = async () => {
    try {
      await fetch(`http://localhost:8000/api/finance/reimburse/${id}/payall`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          transaction_ref: transactionRef,
          remarks: remarks,
        }),
      });
      await fetchRequest();
      setShowPaymentForm(false); // hide form setelah submit
    } catch (err) {
      console.error("Gagal bayar:", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!request) return <p className="p-6">Loading...</p>;

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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isRequestLocked =
    request.status === "closed" || request.status === "canceled";

  return (
    <div className="p-6 space-y-4 text-black">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Detail Request</h1>

        {!isRequestLocked && (
          <Button
            variant="default"
            onClick={() => setShowPaymentForm(!showPaymentForm)}
          >
            {showPaymentForm ? "Tutup Form" : "Bayar"}
          </Button>
        )}
      </div>

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

      {/* Form Pembayaran */}
      {showPaymentForm && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h2 className="font-semibold">Form Pembayaran</h2>

          <div>
            <label className="block text-sm font-medium">Metode Pembayaran</label>
            <input
              type="text"
              value={paymentMethod}
              readOnly
              className="border px-2 py-1 rounded w-full bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Transaction Ref</label>
            <input
              type="text"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Masukkan bukti transfer"
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Catatan tambahan"
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          <Button
            variant="default"
            disabled={isRequestLocked || !transactionRef}
            onClick={handlePay}
          >
            Bayar Sekarang
          </Button>
        </div>
      )}

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
        <Link to="/dashboard/finance/request">
          <Button variant="outline" className="text-white">
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
}
