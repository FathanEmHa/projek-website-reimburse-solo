import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash, FilePen, Send } from "lucide-react";
import { LoadingBouncy } from "@/components/ui/Loading";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import AmountInput from "@/components/ui/AmountInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { showError, showSuccess } from "@/utils/notify";
import ConfirmDialog from "@/components/ui/AlertDialog";

export default function FormPengajuan({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    {
      category_id: "",
      expense_date: "",
      description: "",
      amount: "",
      payment_method: "transfer",
      location: "",
      receipt: null,
    },
  ]);
  const isEdit = mode === "edit";

  // Dummy kategori (bisa nanti fetch dari API)
  const categories = [
    { id: 1, label: "Transportasi" },
    { id: 2, label: "Makan & Minum" },
    { id: 3, label: "Akomodasi" },
    { id: 4, label: "Lain-lain" },
  ];

  // Ambil data draft saat edit
  useEffect(() => {
    if (isEdit && id) {
      fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            setNotes(data.data.notes || "");
            setItems(
              data.data.items?.length
                ? data.data.items.map((i) => ({
                    category_id: i.category_id || "",
                    expense_date: i.expense_date || "",
                    description: i.description || "",
                    amount: i.amount || "",
                    payment_method: i.payment_method || "transfer",
                    location: i.location || "",
                    receipt: null,
                  }))
                : [
                    {
                      category_id: "",
                      expense_date: "",
                      description: "",
                      amount: "",
                      payment_method: "transfer",
                      location: "",
                      receipt: null,
                    },
                  ]
            );
          }
        })
        .catch(() => alert("Gagal memuat draft"));
    }
  }, [id, isEdit]);

  // Fungsi bantu item
  const addItem = () => {
    setItems([
      ...items,
      {
        category_id: "",
        expense_date: "",
        description: "",
        amount: "",
        payment_method: "transfer",
        location: "",
        receipt: null,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Build FormData (karena ada file upload)
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("notes", notes);

    items.forEach((item, index) => {
      formData.append(`items[${index}][category_id]`, item.category_id);
      formData.append(`items[${index}][expense_date]`, item.expense_date);
      formData.append(`items[${index}][description]`, item.description);
      formData.append(`items[${index}][amount]`, item.amount);
      formData.append(`items[${index}][payment_method]`, item.payment_method);
      formData.append(`items[${index}][location]`, item.location);
      if (item.receipt) {
        formData.append(`items[${index}][receipt]`, item.receipt);
      }
    });

    return formData;
  };

  // Submit/draft handler
  const handleSubmit = async (type = "submit") => {
    if (!notes.trim()) {
      showError("Catatan tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    const endpoint =
      type === "draft"
        ? isEdit
          ? `http://localhost:8000/api/reimburse/draft/${id}`
          : `http://localhost:8000/api/reimburse/draft`
        : `http://localhost:8000/api/reimburse`;

    const method = type === "draft" && isEdit ? "PUT" : "POST";
    const formData = buildFormData();

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showSuccess(type === "draft" ? "Draft berhasil disimpan 📝" : "Pengajuan berhasil dikirim 🚀");
        navigate(type === "draft" ? "/dashboard/employee/myDrafts" : "/dashboard/employee/myRequest");
      } else {
        console.error(data);
        showError(data.message || "Terjadi kesalahan!");
      }
    } catch (err) {
      return <AlertDialogTrigger />;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingBouncy text="Pengajuan sedang dikirim..." fullscreen />
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold tracking-wide">
            {isEdit ? "Edit Draft Reimburse" : "Form Pengajuan Reimburse"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-white/90">
          {/* Catatan */}
          <div>
            <label className="block mb-2 font-semibold text-white/80">Catatan Umum</label>
            <Textarea
              value={notes}
              className="w-full border border-white/10 rounded-xl p-3 bg-gradient-to-br from-[#0F264A]/60 to-[#06162F]/40 backdrop-blur-md text-white placeholder-white/50 focus:ring-2 focus:ring-[#38BDF8]/40 transition"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan catatan umum pengajuan..."
            />
          </div>

          {/* Items */}
          <div className="space-y-3">
            <label className="block font-semibold text-white/80">Detail Pengeluaran</label>

            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-xl p-4 bg-gradient-to-br from-[#0F264A]/60 via-[#0A1E3A]/40 to-[#06162F]/20 border border-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] space-y-3 transition hover:border-[#38BDF8]/30"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Kategori */}
                  <div>
                    <label className="text-sm font-medium text-white/70">Kategori</label>
                    <Select
                      value={String(item.category_id)}
                      onValueChange={(val) => updateItem(index, "category_id", val)}
                    >
                      <SelectTrigger className="w-full !border !border-white/10 !rounded-lg !p-2 !bg-white/10 !text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition font-manrope">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F264A]/90 border border-white/10 text-white/90 backdrop-blur-md">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)} className="hover:bg-white/10">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Tanggal */}
                  <div>
                    <label className="text-sm font-medium text-white/70">Tanggal</label>
                    <Input
                      tambah item
                      type="date"
                      value={item.expense_date}
                      className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
                      onChange={(e) =>
                        updateItem(index, "expense_date", e.target.value)
                      }
                      max={today}
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-sm font-medium text-white/70">Deskripsi</label>
                  <Input
                    placeholder="Deskripsi pengeluaran..."
                    value={item.description}
                    className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>

                {/* Jumlah & Metode */}
                <div className="grid grid-cols-2 gap-4">
                  <AmountInput item={item} index={index} updateItem={updateItem} />
                  <div>
                    <label className="text-sm font-medium text-white/70">Metode Pembayaran</label>
                    <Select
                      value={String(item.payment_method)}
                      onValueChange={(e) => updateItem(index, "payment_method", e.target.value)}
                    >
                      <SelectTrigger className="w-full !border !border-white/10 !rounded-lg !p-2 !bg-white/10 !text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition font-manrope">
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0F264A]/90 border border-white/10 text-white/90 backdrop-blur-md">
                          <SelectItem value="transfer" className="hover:bg-white/10">
                            Transfer
                          </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Lokasi */}
                <div>
                  <label className="text-sm font-medium text-white/70">Lokasi</label>
                  <Input
                    placeholder="Contoh: Jakarta Selatan"
                    value={item.location}
                    className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
                    onChange={(e) =>
                      updateItem(index, "location", e.target.value)
                    }
                  />
                </div>

                {/* Bukti Upload */}
                <div>
                  <label className="text-sm font-medium text-white/70">Bukti (Upload)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      updateItem(index, "receipt", e.target.files[0])
                    }
                    className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
                  />
                </div>

                {/* Tombol hapus */}
                {items.length > 1 && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#3A0D1E]/60 to-[#1E0A1A]/60 border border-red-500/20 text-red-300 hover:from-[#571A2D]/70 hover:to-[#320E20]/70 transition-all"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash size={16} /> Hapus Item
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="secondary"
              className="flex items-center gap-2 text-white bg-gradient-to-r from-[#102A54]/60 via-[#0A1E3A]/40 to-[#05152A]/30 border border-white/10 hover:border-[#38BDF8]/30 transition"
              onClick={addItem}
            >
              <Plus size={16} /> Tambah Item
            </Button>
          </div>


          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-5 text-white">
            <ConfirmDialog
            trigger={<Button
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2 border border-white/30 hover:bg-white/10 transition"
            >
              <FilePen size={18} />
              <span>Simpan Sebagai Draft</span>
            </Button>}
            title="Kirim Draft"
            description="Simpan ke draft?"
            onConfirm={() => handleSubmit("draft")}
            />

            <ConfirmDialog
            trigger={<Button
              variant="success"
              disabled={isLoading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition"
            >
              <Send size={18} />
              <span>Kirim pengajuan</span>
            </Button>}
            title="Kirim Pengajuant"
            description="Yakin ingin mengirim pengajuan ini?"
            onConfirm={() => handleSubmit("submit")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
