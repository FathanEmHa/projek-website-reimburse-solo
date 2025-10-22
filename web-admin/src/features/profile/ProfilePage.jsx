import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import ProfilePhoto from "./components/ProfilePhoto";

export default function ProfilePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gradient-to-br from-[#0A1228] to-[#0C1A3A]
        border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Kiri: form */}
      <div className="flex-1 p-6 bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
        <ProfileHeader />
        <ProfileForm />
      </div>

      {/* Kanan: foto profil */}
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-[#0A1E3A]/60 via-[#091A2E]/40 to-[#06142A]/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl">
        <ProfilePhoto />
      </div>
    </div>
  );
}
