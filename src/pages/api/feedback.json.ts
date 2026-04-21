export const GET = async () => {
  try {
    const baseUrl = "https://nueljunt-backend-skripsi-nuel.hf.space"; 

    /**
     * PERBAIKAN:
     * Menggunakan 'fakultas_id' sesuai nama field asli di database kamu.
     */

    // 1. Ambil 3 Feedback Terbaru
    // Perhatikan: fakultas.kode_fakultas diganti jadi fakultas_id.kode_fakultas
    const fieldsList = "id,komentar,tanggal_kirim,kategori_user,fakultas_id.kode_fakultas,analisis_detail.*";
    const urlList = `${baseUrl}/items/feedback?sort=-tanggal_kirim&limit=3&fields=${fieldsList}`;
    
    // 2. Ambil Data Statistik (Tanpa Limit)
    // Perhatikan: fakultas.kode_fakultas diganti jadi fakultas_id.kode_fakultas
    const urlAll = `${baseUrl}/items/feedback?limit=-1&fields=id,fakultas_id.kode_fakultas,analisis_detail.sentimen`;

    const [resList, resAll] = await Promise.all([
      fetch(urlList),
      fetch(urlAll)
    ]);

    const dataList = await resList.json();
    const dataAll = await resAll.json();
    
    const feedbacksRaw = dataList.data || [];
    const allFeedbacks = dataAll.data || [];

    // --- FORMAT DATA FEEDBACK LIST ---
const feedbacks = feedbacksRaw.map((item: any) => {
        return {
            id: item.id,
            komentar: item.komentar,
            tanggal_kirim: item.tanggal_kirim,
            kategori_user: item.kategori_user,
            kode_fakultas: item.fakultas_id?.kode_fakultas?.toUpperCase() || "UMUM",
            
            // PERUBAHAN DISINI: Kirim seluruh array analisis, jangan cuma satu
            analisis: item.analisis_detail || [] 
        };
    });

    // --- HITUNG STATISTIK FAKULTAS ---
    const stats: any = {};

    allFeedbacks.forEach((item: any) => {
      // PERBAIKAN: Ambil dari fakultas_id
      const kodeFak = item.fakultas_id?.kode_fakultas?.toUpperCase() || "UMUM";

      if (!stats[kodeFak]) {
        stats[kodeFak] = { 
            count: 0,
            ai_positif: 0, 
            ai_negatif: 0, 
            ai_netral: 0,
            total_aspek: 0
        };
      }

      stats[kodeFak].count++;

      const details = item.analisis_detail || [];
      details.forEach((a: any) => {
          stats[kodeFak].total_aspek++;
          if (a.sentimen === 'positif') stats[kodeFak].ai_positif++;
          else if (a.sentimen === 'negatif') stats[kodeFak].ai_negatif++;
          else if (a.sentimen === 'netral') stats[kodeFak].ai_netral++;
      });
    });

    return new Response(
      JSON.stringify({
        feedbacks: feedbacks,
        stats: { faculties: stats }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Gagal mengambil data dari backend" }), { status: 500 });
  }
};