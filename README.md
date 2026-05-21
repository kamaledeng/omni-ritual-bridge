# Ritual Intent Bridge

Ritual Intent Bridge adalah konsep bridge testnet yang memakai Ritual Chain sebagai lapisan verifikasi AI/on-chain policy, bukan hanya jalur perpindahan token biasa.

Versi awal ini cocok untuk demo Ritual testnet:

- User membuat bridge intent: chain asal, chain tujuan, token, amount, penerima, dan instruksi natural language.
- Intent disimpan on-chain di Ritual testnet.
- Verifier/agent menetapkan verdict: `APPROVED`, `REVIEW`, atau `REJECTED`.
- Jika LayerZero endpoint Ritual sudah tersedia, kontrak OApp bisa diaktifkan sebagai receiver/sender bridge sungguhan.
- Jika belum, LayerZero tetap bisa dipakai di chain yang sudah support, sementara Ritual menjadi AI verification/checkpoint layer.

## Kenapa Unik

Bridge biasa menjawab: "pindahkan token dari A ke B".

Ritual Intent Bridge menjawab: "apakah perpindahan ini aman, masuk akal, sesuai policy, dan route mana yang paling baik?"

Itu membuat Ritual dipakai sebagai otak bridge:

- risk scoring wallet,
- anti-sybil gate,
- intent validation,
- bridge passport,
- audit trail keputusan AI di chain Ritual.

## Network Ritual Testnet

- Chain ID: `1979`
- RPC: `https://rpc.ritualfoundation.org`
- Explorer: `https://explorer.ritualfoundation.org`
- Faucet: `https://faucet.ritualfoundation.org`
- Native token: `RITUAL`

## Struktur

```text
contracts/
  RitualIntentRegistry.sol      Registry utama intent + verdict.
  RitualLayerZeroGateway.sol    Template OApp bridge gateway.
  RitualRiskOracle.sol          Template integrasi HTTP precompile Ritual.
frontend/
  index.html                    Demo UI statis.
  styles.css
  app.js
docs/
  ARCHITECTURE.md               Flow sistem dan rencana deploy.
```

## MVP Demo Flow

1. Deploy `RitualIntentRegistry.sol` ke Ritual testnet.
2. Buka `frontend/index.html`.
3. Connect wallet ke Ritual testnet.
4. Buat intent bridge dari UI.
5. Jalankan agent/verifier untuk memberi verdict di contract.
6. Tampilkan status intent sebagai "Ritual verified".

## Deploy ke Vercel

Project ini sudah siap deploy dari GitHub ke Vercel.

Settings yang dipakai:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`

Vercel akan menyalin isi `frontend/` ke `dist/` lewat `scripts/build.js`.

Local check:

```bash
npm run build
```

## Langkah Lanjut

1. Tambahkan agent kecil yang memanggil API risk scoring lalu submit verdict ke `finalizeIntent`.
2. Deploy LayerZero OApp di chain yang sudah support.
3. Saat Ritual punya Endpoint V2 LayerZero, aktifkan `RitualLayerZeroGateway` sebagai bridge receiver.
4. Ubah verdict `APPROVED` menjadi trigger eksekusi bridge.
