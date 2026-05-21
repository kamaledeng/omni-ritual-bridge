# Ritual Intent Bridge

Omni Ritual Bridge adalah bridge testnet antar chain dengan LayerZero OFT, plus Ritual Chain sebagai lapisan verifikasi AI/on-chain policy.

Versi awal ini cocok untuk demo bridge antar testnet:

- User membuat bridge intent: chain asal, chain tujuan, token, amount, penerima, dan instruksi natural language.
- Intent disimpan on-chain di Ritual testnet.
- Verifier/agent menetapkan verdict: `APPROVED`, `REVIEW`, atau `REJECTED`.
- Token bridge sungguhan berjalan via LayerZero OFT di chain yang sudah support, misalnya Base Sepolia dan Ethereum Sepolia.
- Jika LayerZero endpoint Ritual sudah tersedia, Ritual bisa diaktifkan sebagai receiver/sender langsung.

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
  OmniRitualOFT.sol              Token bridge sungguhan memakai LayerZero OFT.
  RitualIntentRegistry.sol      Registry utama intent + verdict.
  RitualLayerZeroGateway.sol    Template OApp bridge gateway.
  RitualRiskOracle.sol          Template integrasi HTTP precompile Ritual.
frontend/
  index.html                    Demo UI statis.
  styles.css
  app.js
docs/
  ARCHITECTURE.md               Flow sistem dan rencana deploy.
  REAL_BRIDGE.md                Rencana bridge sungguhan antar chain.
```

## MVP Demo Flow

1. Deploy `OmniRitualOFT.sol` ke dua chain LayerZero-supported, misalnya Base Sepolia dan Ethereum Sepolia.
2. Wire peer OFT dengan LayerZero tooling.
3. Deploy `RitualIntentRegistry.sol` ke Ritual testnet.
4. Buka UI Vercel.
5. User membuat intent dan menjalankan bridge.
6. Ritual menyimpan audit trail intent/verdict.

## Chain Bridge Awal yang Disarankan

- Base Sepolia: LayerZero EID `40245`
- Ethereum Sepolia: LayerZero EID `40161`

Ritual testnet tetap dipakai sebagai verification layer sampai ada Endpoint V2 LayerZero resmi di Ritual.

## Deploy UI ke Vercel

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

## Deploy Bridge Contracts

Gunakan LayerZero scaffold:

```bash
npx create-lz-oapp@latest
```

Pilih `OFT example`, lalu copy:

- `contracts/OmniRitualOFT.sol`
- `layerzero.config.example.ts`
- `hardhat.config.example.ts`
- `.env.example`

Command utama setelah dependencies siap:

```bash
npx hardhat lz:deploy
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

## Demo UI Lokal

1. Jalankan build:

```bash
npm run build
```

2. Buka `frontend/index.html`.
3. Connect wallet ke Ritual testnet.
4. Buat intent bridge dari UI.
5. Jalankan agent/verifier untuk memberi verdict di contract.
6. Tampilkan status intent sebagai "Ritual verified".

## Langkah Lanjut

1. Deploy OFT di Base Sepolia dan Ethereum Sepolia.
2. Tambahkan agent kecil yang memanggil API risk scoring lalu submit verdict ke `finalizeIntent`.
3. Hubungkan UI ke OFT `quoteSend` dan `send`.
4. Saat Ritual punya Endpoint V2 LayerZero, aktifkan `RitualLayerZeroGateway` sebagai bridge receiver.
