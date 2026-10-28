import { Language } from "../../types/index";

export function localizeStatus(language: Language, value: string) {
  if (language === "ID") return value;
  const labels: Record<string, string> = {
    Aktif: "Active",
    Diblokir: "Blocked",
    "Data dihapus": "Data deleted",
    Selesai: "Completed",
    Krisis: "Crisis",
    Kritis: "Critical",
    Tinggi: "High",
    Sedang: "Medium",
    "Tidak ada": "None",
    Draft: "Draft",
    Diarsipkan: "Archived",
    "Jatuh tempo": "Overdue",
    Dibatalkan: "Cancelled",
    Berhasil: "Successful",
    Menunggu: "Pending",
    Gagal: "Failed",
    Disetujui: "Approved",
    Ditolak: "Rejected",
    Arsip: "Archived",
    Terhubung: "Connected",
    "Belum dihubungkan": "Not connected",
    "Perlu otorisasi ulang": "Reauthorisation required",
  };
  return labels[value] ?? value;
}
