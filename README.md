# Kuliner Nusantara

Katalog kuliner statis berbasis HTML, CSS, dan JavaScript. Fitur: pencarian, filter kategori/daerah, detail menu, keranjang LocalStorage, checkout WhatsApp, metode QRIS/transfer/COD, serta tampilan responsif.

## Jalankan lokal

Buka `index.html` di browser atau jalankan server statis dari folder proyek:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Konfigurasi sebelum publikasi

Edit objek `CONFIG` di bagian atas `app.js`: nomor WhatsApp penjual, nama penjual, QRIS, rekening, area layanan, jam buka, dan Instagram. Tambahkan QRIS asli penjual ke `assets/qris-penjual.png`. Jangan memakai data contoh saat menerima pesanan sungguhan.

Foto katalog saat ini dimuat dari sumber eksternal. Lihat `assets/IMAGE-CREDITS.md` untuk daftar referensi; cek kembali izin dan lisensi gambar sebelum penggunaan komersial. Foto asli dari penjual lebih disarankan.

## Deploy ke Vercel

1. Upload folder ini ke repository GitHub.
2. Di Vercel pilih **Add New → Project**, lalu import repository.
3. Untuk situs statis, biarkan Framework Preset pada **Other** dan Build Command kosong.
4. Deploy. `vercel.json` mengatur security headers dan CSP untuk domain gambar katalog.

## Catatan teknis

Checkout membuka WhatsApp dengan ringkasan pesanan. Pembayaran QRIS/transfer dan verifikasi bukti masih dilakukan manual; tidak ada payment gateway atau dashboard backend. Status pesanan disimpan di browser pengguna.
