# Sistem Manajemen Reimbursement 🏢

Aplikasi Manajemen Reimbursement adalah platform lintas perangkat (Web & Mobile) yang dirancang untuk mendigitalkan, mempercepat, dan melacak seluruh alur pengajuan dana karyawan perusahaan. 

Proyek ini diinisiasi dan mulai dikembangkan pada masa Praktik Kerja Lapangan (PKL) di **PT Metanouva Informatika** dan saat ini masih dalam tahap pengembangan aktif (*On Progress*).

## 💻 Teknologi yang Digunakan

Sistem ini dibangun menggunakan arsitektur modern yang memisahkan antara layanan *backend* (API) dan antarmuka *client-side*:

*   **Backend & API:** Laravel
*   **Web Dashboard:** React
*   **Mobile App:** Flutter

## 👥 Hak Akses Pengguna (Multi-Role)

Sistem ini mengakomodasi hierarki birokrasi perusahaan melalui 4 tingkatan hak akses pengguna, dengan alur kerja sebagai berikut:

1.  **User (Karyawan):** 
    Pengguna akhir yang dapat membuat draf pengajuan *reimburse*, mengunggah bukti transaksi (struk/nota), dan melacak status persetujuan pengajuannya secara *real-time*.
2.  **Manager:** 
    Bertugas untuk meninjau detail pengajuan dari anggotanya. Memiliki wewenang untuk memberikan persetujuan tahap pertama (*approve*) atau menolak (*reject*) klaim tersebut.
3.  **Finance:** 
    Pihak keuangan yang bertugas memverifikasi dokumen secara administratif dan memproses pencairan dana (*disbursement*) untuk pengajuan yang telah disetujui oleh Manager.
4.  **Admin:** 
    Super-user yang memiliki kendali penuh atas konfigurasi sistem. Bertugas mengelola *master data* (data karyawan, struktur manajerial, batas saldo, dan kategori *reimburse*).

---
*Catatan: Aplikasi ini masih dalam tahap pengembangan (development phase). Fitur dan alur kerja dapat mengalami penyesuaian.*
