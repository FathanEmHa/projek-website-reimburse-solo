function formatRupiah(value) {
  if (!value) return "";
  const number = parseInt(value, 10);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export {
  formatRupiah,
};