import { useState } from "react";
import { formatRupiah } from "@/utils/format";

export default function AmountInput({ item, index, updateItem }) {
  const [displayValue, setDisplayValue] = useState(
    item.amount ? formatRupiah(item.amount) : ""
  );

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setDisplayValue(formatRupiah(rawValue));
    updateItem(index, "amount", rawValue);
  };

  return (
    <div>
      <label className="text-sm font-medium text-white/70">Jumlah (Rp)</label>
      <input
        type="text"
        placeholder="Rp0"
        value={displayValue}
        onChange={handleChange}
        className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
      />
    </div>
  );
}