#!/bin/bash
# Skrip ini akan melakukan sinkronisasi dan push semua perubahan ke repositori Git Anda.

echo ">>> Menyiapkan konfigurasi git..."
git config --global user.email "sazwarriyadhs@users.noreply.github.com"
git config --global user.name "sazwarriyadhs"

echo ">>> Menambahkan semua perubahan ke staging..."
git add .

echo ">>> Melakukan commit pada perubahan..."
git commit -m "feat: Integrasi fitur lengkap dan peningkatan UI

Commit ini mencakup:
- Rebranding lengkap menjadi 'Serenity Hotel, Resort, and Restaurant'.
- Implementasi halaman Analitik Restoran.
- Implementasi halaman Manajemen Pembayaran.
- Peningkatan pada Layanan Bantuan AI untuk struktur dan keandalan yang lebih baik.
- Penggantian semua gambar placeholder dengan gambar lokal.
- Pembaruan alamat hotel dan data mock.
- Perbaikan bug terkait dependensi dan error komponen."

echo ">>> Mendorong perubahan ke repositori GitHub..."
git push https://sazwarriyadhs@github.com/sazwarriyadhs/pelangiserenityhotel.git HEAD:main

echo ">>> Sinkronisasi selesai."
