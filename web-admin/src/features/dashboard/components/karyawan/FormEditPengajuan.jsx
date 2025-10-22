import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash } from "lucide-react";

export default function FormEditPengajuan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 1, label: "Transportasi" },
    { id: 2, label: "Makan & Minum" },
    { id: 3, label: "Akomodasi" },
    { id: 4, label: "Lain-lain" },
  ];

  // Fetch draft dari API
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.data) {
          const draft = data.data;
          setNotes(draft.notes || "");
          setItems(
            draft.items?.length
              ? draft.items.map((i) => ({
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
        } else {
          alert("Gagal memuat draft!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id]);

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

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Karena kita menggunakan method spoofing
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

  const handleSubmit = async () => {
    setLoading(true);
    const formData = buildFormData();
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8000/api/reimburse/draft/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Draft berhasil diperbarui ✅");
        navigate("/dashboard/employee/myDrafts");
      } else {
        alert(data.message || "Gagal memperbarui draft!");
        console.log(data.errors);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Memuat data...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>Edit Draft Reimburse</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Catatan */}
          <div>
            <label className="block mb-1 font-semibold">Catatan Umum</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan catatan umum pengajuan..."
            />
          </div>

          {/* Items */}
          <div className="space-y-3">
            <label className="block font-semibold">Detail Pengeluaran</label>

            {items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 space-y-3 relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Kategori */}
                  <div>
                    <label className="text-sm font-medium">Kategori</label>
                    <select
                      value={item.category_id}
                      onChange={(e) =>
                        updateItem(index, "category_id", e.target.value)
                      }
                      className="w-full border rounded-md p-2 bg-white text-gray-900"
                    >
                      <option value="">-- pilih kategori --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label className="text-sm font-medium">Tanggal</label>
                    <Input
                      type="date"
                      value={item.expense_date}
                      onChange={(e) =>
                        updateItem(index, "expense_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <Input
                    placeholder="Deskripsi pengeluaran..."
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>

                {/* Jumlah & Metode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jumlah (Rp)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(index, "amount", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Metode Pembayaran
                    </label>
                    <select
                      value={item.payment_method}
                      onChange={(e) =>
                        updateItem(index, "payment_method", e.target.value)
                      }
                      className="w-full border rounded-md p-2 bg-white text-gray-900"
                    >
                      <option value="transfer">Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </div>

                {/* Lokasi */}
                <div>
                  <label className="text-sm font-medium">Lokasi</label>
                  <Input
                    placeholder="Contoh: Jakarta Selatan"
                    value={item.location}
                    onChange={(e) =>
                      updateItem(index, "location", e.target.value)
                    }
                  />
                </div>

                {/* Bukti Upload */}
                <div>
                  <label className="text-sm font-medium">Bukti (Upload)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      updateItem(index, "receipt", e.target.files[0])
                    }
                    className="w-full border border-gray-300 rounded-md p-2 bg-white"
                  />
                </div>

                {/* Tombol hapus */}
                {items.length > 1 && (
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash size={16} className="mr-2" /> Hapus
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Button variant="secondary" className="text-white" onClick={addItem}>
              <Plus size={16} className="mr-2 text-white" /> Tambah Item
            </Button>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end gap-3 pt-5">
            <Button
              variant="success"
              className="text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
