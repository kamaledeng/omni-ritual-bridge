const NETWORKS = {
  base: {
    label: "Base Sepolia",
    short: "Base",
    token: "ETH",
    coin: "E",
    chainId: 84532,
    hexChainId: "0x14a34",
    eid: 40245,
    rpcUrls: ["https://sepolia.base.org"],
    explorerUrls: ["https://sepolia.basescan.org"],
  },
  ritual: {
    label: "Ritual Testnet",
    short: "Ritual",
    token: "RITUAL",
    coin: "R",
    chainId: 1979,
    hexChainId: "0x7bb",
    eid: null,
    rpcUrls: ["https://rpc.ritualfoundation.org"],
    explorerUrls: ["https://explorer.ritualfoundation.org"],
  },
  sepolia: {
    label: "Ethereum Sepolia",
    short: "Sepolia",
    token: "ETH",
    coin: "E",
    chainId: 11155111,
    hexChainId: "0xaa36a7",
    eid: 40161,
    rpcUrls: ["https://sepolia.drpc.org"],
    explorerUrls: ["https://sepolia.etherscan.io"],
  },
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
const routeStatus = document.querySelector("#routeStatus");
const routeDetail = document.querySelector("#routeDetail");
const feeLabel = document.querySelector("#feeLabel");
const routeDetails = document.querySelector(".route-details");
const sellBalance = document.querySelector("#sellBalance");
const buyBalance = document.querySelector("#buyBalance");
const fromChainLabel = document.querySelector("#fromChainLabel");
const toChainLabel = document.querySelector("#toChainLabel");
const sellToken = document.querySelector("#sellToken");
const buyToken = document.querySelector("#buyToken");
const swapButton = document.querySelector("#swapChains");
const maxButton = document.querySelector("#maxAmount");
const txCard = document.querySelector("#tx-card");
const buyTab = document.querySelector("#buyTab");
const settingsButton = document.querySelector("#settingsButton");
const networkModal = document.querySelector("#networkModal");
const modalTitle = document.querySelector("#modalTitle");
const closeModal = document.querySelector("#closeModal");
const networkOptions = [...document.querySelectorAll(".network-option")];
const trendButtons = [...document.querySelectorAll("[data-route]")];

let account = "";
let fromKey = "base";
let toKey = "ritual";
let selectingSide = "from";

const ROUTES = {
  "base:sepolia": {
    available: true,
    label: "LayerZero OFT test route",
    fee: "~0.002 ETH",
  },
  "sepolia:base": {
    available: true,
    label: "LayerZero OFT test route",
    fee: "~0.002 ETH",
  },
  "base:ritual": {
    available: false,
    label: "Ritual testnet route coming soon",
    fee: "Pending",
  },
  "ritual:base": {
    available: false,
    label: "Ritual testnet route coming soon",
    fee: "Pending",
  },
  "sepolia:ritual": {
    available: false,
    label: "Ritual testnet route coming soon",
    fee: "Pending",
  },
  "ritual:sepolia": {
    available: false,
    label: "Ritual testnet route coming soon",
    fee: "Pending",
  },
};

function shortAddress(value) {
  if (!value || value.length < 12) return value || "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatUnits(hexWei) {
  const value = BigInt(hexWei || "0x0");
  const whole = value / 10n ** 18n;
  const fraction = value % 10n ** 18n;
  const fractionText = fraction.toString().padStart(18, "0").slice(0, 4);
  return `${whole.toString()}.${fractionText}`.replace(/\.?0+$/, "");
}

async function rpcBalance(network, address) {
  const response = await fetch(network.rpcUrls[0], {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  });
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "RPC balance error");
  return formatUnits(payload.result);
}

async function updateBalances() {
  const from = NETWORKS[fromKey];
  const to = NETWORKS[toKey];

  if (!account) {
    sellBalance.textContent = `Connect wallet to read ${from.label} balance.`;
    buyBalance.textContent = `Connect wallet to read ${to.label} balance.`;
    return;
  }

  sellBalance.textContent = `Loading ${from.short} balance...`;
  buyBalance.textContent = `Loading ${to.short} balance...`;

  const [fromResult, toResult] = await Promise.allSettled([
    rpcBalance(from, account),
    rpcBalance(to, account),
  ]);

  sellBalance.textContent =
    fromResult.status === "fulfilled"
      ? `Balance on ${from.label}: ${fromResult.value} ${from.token}`
      : `Could not read ${from.label} balance.`;

  buyBalance.textContent =
    toResult.status === "fulfilled"
      ? `Balance on ${to.label}: ${toResult.value} ${to.token}`
      : `Could not read ${to.label} balance.`;
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
  const route = ROUTES[`${fromKey}:${toKey}`] || {
    available: false,
    label: "Route not configured",
    fee: "Unavailable",
  };
  const rate = fromKey === "base" && toKey === "ritual" ? 1000 : 0.001;
  const receive = amount > 0 && route.available ? amount * rate : 0;

  receiveInput.value = receive ? receive.toFixed(receive >= 1 ? 4 : 6) : "0";
  sellUsd.textContent = money(amount * 3000);
  buyUsd.textContent = money(receive * 0.003);
  routeLabel.textContent = `${from.label} -> ${to.label}`;
  routeStatus.textContent = route.available ? "Available" : "Coming soon";
  routeStatus.className = route.available ? "available" : "soon";
  routeDetail.textContent = route.label;
  feeLabel.textContent = route.fee;
  sellBalance.textContent = account ? sellBalance.textContent : `Connect wallet to read ${from.label} balance.`;
  buyBalance.textContent = account ? buyBalance.textContent : `Connect wallet to read ${to.label} balance.`;

  fromChainLabel.textContent = from.short;
  toChainLabel.textContent = to.short;
  setTokenButton(sellToken, from, fromKey === "ritual" ? "ritual" : "eth");
  setTokenButton(buyToken, to, toKey === "ritual" ? "ritual" : "eth");
  bridgeButton.textContent = account ? (route.available ? `Bridge from ${from.short}` : "Coming Soon") : "Connect Wallet";
  bridgeButton.disabled = Boolean(account && !route.available);
  updateBalances();
}

function walletChainParams(network) {
  return {
    chainId: network.hexChainId,
    chainName: network.label,
    nativeCurrency: {
      name: network.token,
      symbol: network.token,
      decimals: 18,
    },
    rpcUrls: network.rpcUrls,
    blockExplorerUrls: network.explorerUrls,
  };
}

async function switchToNetwork(key) {
  if (!window.ethereum) return;
  const network = NETWORKS[key];

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.hexChainId }],
    });
  } catch (error) {
    if (error && error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [walletChainParams(network)],
      });
      return;
    }
    throw error;
  }
}

async function connect() {
  if (!window.ethereum) {
    connectButton.textContent = "No wallet";
    bridgeButton.textContent = "No Wallet Found";
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0] || "";
  await switchToNetwork(fromKey);

  const label = shortAddress(account);

  connectButton.textContent = label || "Connect";
  sellWallet.textContent = label || "Select wallet";
  buyWallet.textContent = label || "Select wallet";
  updateQuote();
}

function openNetworkModal(side) {
  selectingSide = side;
  modalTitle.textContent = side === "from" ? "Select sell network" : "Select buy network";
  networkModal.classList.add("open");
  networkModal.setAttribute("aria-hidden", "false");
}

function closeNetworkModal() {
  networkModal.classList.remove("open");
  networkModal.setAttribute("aria-hidden", "true");
}

function chooseNetwork(key) {
  if (selectingSide === "from") {
    fromKey = key;
    if (fromKey === toKey) {
      toKey = key === "ritual" ? "base" : "ritual";
    }
  } else {
    toKey = key;
    if (fromKey === toKey) {
      fromKey = key === "ritual" ? "base" : "ritual";
    }
  }

  updateQuote();
  closeNetworkModal();
  if (account) switchToNetwork(fromKey);
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
  if (account) switchToNetwork(fromKey);
});

sellToken.addEventListener("click", () => openNetworkModal("from"));
buyToken.addEventListener("click", () => openNetworkModal("to"));
sellWallet.addEventListener("click", connect);
buyWallet.addEventListener("click", connect);
closeModal.addEventListener("click", closeNetworkModal);
networkModal.addEventListener("click", (event) => {
  if (event.target === networkModal) closeNetworkModal();
});
networkOptions.forEach((button) => {
  button.addEventListener("click", () => chooseNetwork(button.dataset.network));
});
trendButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const [from, to] = button.dataset.route.split(":");
    fromKey = from;
    toKey = to;
    updateQuote();
    if (account) switchToNetwork(fromKey);
  });
});
buyTab.addEventListener("click", () => {
  fromKey = "base";
  toKey = "ritual";
  amountInput.value = amountInput.value === "0" ? "0.01" : amountInput.value;
  updateQuote();
});
settingsButton.addEventListener("click", () => {
  routeDetails.classList.toggle("collapsed");
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

  await switchToNetwork(fromKey);

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
  const route = ROUTES[`${fromKey}:${toKey}`];

  if (!route || !route.available) {
    txCard.innerHTML = `
      <dl>
        <dt>Status</dt><dd>Coming soon</dd>
        <dt>Route</dt><dd>${request.from} -> ${request.to}</dd>
        <dt>Reason</dt><dd>This route needs bridge contracts, liquidity, or a relayer before it can execute.</dd>
        <dt>Wallet</dt><dd>${shortAddress(account)}</dd>
        <dt>Request</dt><dd>${requestHash}</dd>
      </dl>
    `;
    return;
  }

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
