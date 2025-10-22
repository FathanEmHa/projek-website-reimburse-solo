import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { getToken } from "@/utils/auth";
import { Plus, Send } from "lucide-react";
import { showSuccess, showError } from "@/utils/notify";

export default function ProfileForm() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setUser(data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Memuat data...</p>
      </div>
    );
  }

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Karena kita menggunakan method spoofing
    formData.append("full_name", user.full_name);
    formData.append("email", user.email);
    formData.append("phone_number", user.phone_number);
    formData.append("address", user.address);
    formData.append("bank_name", user.bank_name);
    formData.append("account_number", user.account_number);

    if (user.profile_picture instanceof File) {
      formData.append("profile_picture", user.profile_picture);
    }

    return formData;
  };

  const handleSave = async () => {
    const formData = buildFormData();

    try {
      const res = await fetch("http://localhost:8000/api/users/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if(res.ok) {
        showSuccess("Profil berhasil diperbarui");
        fetchUsers();
      } else {
        showError(data.message || "Gagal memperbarui profil")
      }
    } catch (err) {
      console.error(err);
      showError("Terjadi kesalahan saat menyimpan profil");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Konfirmasi password tidak sesuai")
    }

    try {
      const res = await fetch("http://localhost:8000/api/users/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(data.message);
        resetForm();
      } else {
        showError(data.message || "Gagal mengubah password");
      }
    } catch (err) {
      showError("Terjadi kesalahan koneksi");
    }
  };

  return (
    <div className=" bg-white/5 bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl dark:bg-gray-900 p-8 space-y-10">
      {/* --- SECTION 1: PROFILE INFO --- */}
      <section>
        <h2 className="text-xl font-semibold text-white dark:text-gray-100 mb-6 border-b pb-2">
          Informasi Karyawan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <Label>Full Name</Label>
            <Input 
            value={user.full_name || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input 
            type="email" 
            value={user.email || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly 
            />
          </div>

          {/* Department */}
          <div>
            <Label>Department</Label>
            <Input 
            value={user.department?.name || "-"} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly 
            />
          </div>

          {/* Position */}
          <div>
            <Label>Position</Label>
            <Input 
            value={user.position || "-"} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly 
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone Number</Label>
            <Input 
            value={user.phone_number || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Isi nomor aktif" 
            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
            />
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input 
            value={user.address || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Alamat tempat tinggal" 
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>

          {/* Bank */}
          <div>
            <Label>Bank Name</Label>
            <Input 
            value={user.bank_name || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Nama bank" 
            onChange={(e) => setUser({ ...user, bank_name: e.target.value })}
            />
          </div>

          {/* Account */}
          <div>
            <Label>Account Number</Label>
            <Input 
            value={user.account_number || ""} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Nomor rekening" 
            onChange={(e) => setUser({ ...user, account_number: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <Input 
            value={user.role || "-"} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly 
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Input 
            value={user.is_active ? "Active" : "Inactive"} 
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            readOnly 
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="secondary"
            className="flex items-center gap-2 text-white bg-gradient-to-r from-[#102A54]/60 via-[#0A1E3A]/40 to-[#05152A]/30 border border-white/10 hover:border-[#38BDF8]/30 transition"
            onClick={handleSave}
          >
            <Send size={16} /> Simpan Perubahan
          </Button>
        </div>
      </section>

      {/* --- SECTION 2: PASSWORD --- */}
      <section>
        <h2 className="text-xl font-semibold text-white dark:text-gray-100 mb-6 border-b pb-2">
          Ubah Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Password Lama</Label>
            <Input 
            type="password" 
            value={oldPassword}
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Masukkan password lama" 
            onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <Label>Password Baru</Label>
            <Input 
            type="password"
            value={newPassword}
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Masukkan password baru" 
            onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label>Konfirmasi Password Baru</Label>
            <Input 
            type="password"
            value={confirmPassword}
            className="w-full border border-white/10 rounded-lg p-2 bg-white/10 text-white/90 placeholder-white/60 backdrop-blur-sm focus:ring-2 focus:ring-[#38BDF8]/40 transition"
            placeholder="Ulangi password baru" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="secondary"
            className="flex items-center gap-2 text-white bg-gradient-to-r from-[#102A54]/60 via-[#0A1E3A]/40 to-[#05152A]/30 border border-white/10 hover:border-[#38BDF8]/30 transition"
            onClick={handleChangePassword}
          >
            <Plus size={16} /> Tambah Item
          </Button>
        </div>
      </section>
    </div>
  );
}
