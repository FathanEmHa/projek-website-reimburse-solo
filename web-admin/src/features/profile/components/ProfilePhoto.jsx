import { useState } from "react";

export default function ProfilePhoto() {
  const [photo, setPhoto] = useState("/default-avatar.png");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center bg-white/5 bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
      <img
        src={photo}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover mb-4"
      />
      <label className="cursor-pointer text-blue-600">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
        />
        Ganti Foto
      </label>
    </div>
  );
}
