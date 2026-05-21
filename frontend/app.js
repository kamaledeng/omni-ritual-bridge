const NETWORKS = {
  base: {
    label: "Base Sepolia",
    short: "Base",
    token: "ETH",
    coin: "E",
    chainId: 84532,
    eid: 40245,
  },
  ritual: {
    label: "Ritual Testnet",
    short: "Ritual",
    token: "RITUAL",
    coin: "R",
    chainId: 1979,
    eid: null,
  },
  sepolia: {
    label: "Ethereum Sepolia",
    short: "Sepolia",
    token: "ETH",
    coin: "E",
    chainId: 11155111,
    eid: 40161,
  },
};

const RITUAL_CHAIN = {
  chainId: "0x7bb",
  chainName: "Ritual Testnet",
  nativeCurrency: {
    name: "RITUAL",
    symbol: "RITUAL",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"],
};

const connectButton = document.querySelector("#connect");
const bridgeButton = document.querySelector("#bridgeButton");
const form = document.querySelector("#bridge-form");
const amountInput = document.querySelector("#amount");
const receiveInput = document.querySelector("#receiveAmount");
const sellWallet = document.querySelector("#sellWallet");
const buyWallet = document.querySelector("#buyWallet");
const sellUsd = document.querySelector("#sellUsd");
const buyUsd = document.querySelector("#buyUsd");
const routeLabel = document.querySelector("#routeLabel");
const routeDetail = document.querySelector("#routeDetail");
const feeLabel = document.querySelector("#feeLabel");
const fromChainLabel = document.querySelector("#fromChainLabel");
const toChainLabel = document.querySelector("#toChainLabel");
const sellToken = document.querySelector("#sellToken");
const buyToken = document.querySelector("#buyToken");
const swapButton = document.querySelector("#swapChains");
const maxButton = document.querySelector("#maxAmount");
const txCard = document.querySelector("#tx-card");

let account = "";
let fromKey = "base";
let toKey = "ritual";

function shortAddress(value) {
  if (!value || value.length < 12) return value || "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function setTokenButton(button, network, variant) {
  const coin = button.querySelector(".coin");
  const symbol = button.querySelector("strong");
  const chain = button.querySelector("small");

  coin.textContent = network.coin;
  coin.className = `coin ${variant}`;
  symbol.textContent = network.token;
  chain.textContent = network.short;
}

function updateQuote() {
  const amount = Number(amountInput.value || 0);
  const from = NETWORKS[fromKey];
  const to = NETWORKS[toKey];
  const rate = fromKey === "base" && toKey === "ritual" ? 1000 : 0.001;
  const receive = amount > 0 ? amount * rate : 0;

  receiveInput.value = receive ? receive.toFixed(receive >= 1 ? 4 : 6) : "0";
  sellUsd.textContent = money(amount * 3000);
  buyUsd.textContent = money(receive * 0.003);
  routeLabel.textContent = `${from.label} -> ${to.label}`;
  routeDetail.textContent = toKey === "ritual" ? "LayerZero route + Ritual testnet settlement" : "LayerZero OFT route";
  feeLabel.textContent = fromKey === "ritual" ? "~0.01 RITUAL" : "~0.002 ETH";

  fromChainLabel.textContent = from.short;
  toChainLabel.textContent = to.short;
  setTokenButton(sellToken, from, fromKey === "ritual" ? "ritual" : "eth");
  setTokenButton(buyToken, to, toKey === "ritual" ? "ritual" : "eth");
}

async function connect() {
  if (!window.ethereum) {
    connectButton.textContent = "No wallet";
    bridgeButton.textContent = "No Wallet Found";
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0] || "";
  const label = shortAddress(account);

  connectButton.textContent = label || "Connect";
  bridgeButton.textContent = "Preview Bridge";
  sellWallet.textContent = label || "Select wallet";
  buyWallet.textContent = label || "Select wallet";

  if (toKey === "ritual" || fromKey === "ritual") {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [RITUAL_CHAIN],
    });
  }
}

async function digestRequest(payload) {
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return `0x${[...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

swapButton.addEventListener("click", () => {
  const nextFrom = toKey;
  toKey = fromKey;
  fromKey = nextFrom;
  updateQuote();
});

maxButton.addEventListener("click", () => {
  amountInput.value = "0.05";
  updateQuote();
});

amountInput.addEventListener("input", updateQuote);
connectButton.addEventListener("click", connect);
bridgeButton.addEventListener("click", () => {
  if (!account) connect();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!account) {
    await connect();
    return;
  }

  const request = {
    from: NETWORKS[fromKey].label,
    to: NETWORKS[toKey].label,
    sellToken: NETWORKS[fromKey].token,
    buyToken: NETWORKS[toKey].token,
    amount: amountInput.value,
    receive: receiveInput.value,
    wallet: account,
    ritualChainId: 1979,
  };
  const requestHash = await digestRequest(request);

  txCard.innerHTML = `
    <dl>
      <dt>Status</dt><dd>Preview ready</dd>
      <dt>Route</dt><dd>${request.from} -> ${request.to}</dd>
      <dt>Sell</dt><dd>${request.amount} ${request.sellToken}</dd>
      <dt>Buy</dt><dd>${request.receive} ${request.buyToken}</dd>
      <dt>Wallet</dt><dd>${shortAddress(account)}</dd>
      <dt>Ritual</dt><dd>Testnet chain ID 1979</dd>
      <dt>Request</dt><dd>${requestHash}</dd>
    </dl>
  `;
});

updateQuote();
