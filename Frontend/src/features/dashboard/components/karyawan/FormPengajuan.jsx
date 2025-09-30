import { useState } from "react";
import { getToken } from "@/utils/auth"
import { Button } from "@/components/ui/Button";

export default function FormPengajuan() {
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([
    {
      category_id: "",
      expense_date: "",
      description: "",
      amount: "",
      payment_method: "",
      location: "",
      receipt: null,
    },
  ]);

  // Dummy kategori (ini bisa nanti di-fetch dari API)
  const categories = [
    { id: 1, label: "Transportasi" },
    { id: 2, label: "Makan & Minum" },
    { id: 3, label: "Akomodasi" },
    { id: 4, label: "Lain-lain" },
  ];

  const addItem = () => {
    setItems([
      ...items,
      {
        category_id: "",
        expense_date: "",
        description: "",
        amount: "",
        payment_method: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("notes", notes);

    items.forEach((item, index) => {
      formData.append(`items[${index}][category_id]`, item.category_id);
      formData.append(`items[${index}][expense_date]`, item.expense_date);
      formData.append(`items[${index}][description]`, item.description);
      formData.append(`items[${index}][amount]`, item.amount);
      formData.append(`items[${index}][payment_method]`, item.payment_method);
      formData.append(`items[${index}][location]`, item.location);

      // kalau file upload
      if (item.receipt) {
        formData.append(`items[${index}][receipt]`, item.receipt);
      }
    });

    try {
      const res = await fetch("http://localhost:8000/api/reimburse", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Server error");
      }

      const data = await res.json();
      console.log("Respon backend:", data);

      setNotes("");
      setItems([{
        category_id: "",
        expense_date: "",
        description: "",
        amount: "",
        payment_method: "",
        location: "",
        receipt: null,
      }]);

    document.getElementById("receipt").value = null;

    alert("Pengajuan berhasil dikirim 🚀");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-bold text-black">Form Pengajuan</h1>

      {/* Notes */}
      <div>
        <label className="block font-medium">Catatan</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tuliskan catatan umum..."
          className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">Detail Pengeluaran</h2>

        {items.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg space-y-2 relative bg-gray-50"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Dropdown kategori */}
              <div>
                <label>Kategori</label>
                <select
                  value={item.category_id}
                  onChange={(e) =>
                    updateItem(index, "category_id", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                >
                  <option value="">-- pilih kategori --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Tanggal</label>
                <input
                  type="date"
                  value={item.expense_date}
                  onChange={(e) =>
                    updateItem(index, "expense_date", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                />
              </div>
            </div>

            <div>
              <label>Deskripsi</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                placeholder="Deskripsi..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Jumlah</label>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(index, "amount", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                  placeholder="Nominal"
                />
              </div>

              <div>
                <label>Metode Pembayaran</label>
                <select
                  value={item.payment_method}
                  onChange={(e) =>
                    updateItem(index, "payment_method", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                >
                  <option value="">-- pilih --</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label>Lokasi</label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => updateItem(index, "location", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
                placeholder="Lokasi..."
              />
            </div>

            <div>
              <label>Bukti (path / upload)</label>
              <input
                type="file"
                onChange={(e) =>
                  updateItem(index, "receipt", e.target.files[0])
                }
                className="w-full border border-gray-300 rounded-md p-2 text-black bg-white"
              />
            </div>

            {/* Tombol hapus */}
            {items.length > 1 && (
              <Button
                onClick={() => removeItem(index)}
                variant="destructive"
              >
                Hapus Item
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="default"
          onClick={addItem}
        >
          + Tambah Item
        </Button>
      </div>

      {/* Submit */}
      <Button
        variant="default"
      >
        Submit Pengajuan
      </Button>
    </form>
  );
}
