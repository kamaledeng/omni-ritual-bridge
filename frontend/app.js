const NETWORKS = {
  ethereum: {
    label: "Ethereum",
    short: "Ethereum",
    token: "ETH",
    coin: "E",
    logo: "eth",
    chainId: 1,
    hexChainId: "0x1",
    eid: 30101,
    rpcUrls: ["https://ethereum-rpc.publicnode.com"],
    explorerUrls: ["https://etherscan.io"],
  },
  base: {
    label: "Base Sepolia",
    short: "Base",
    token: "ETH",
    coin: "E",
    logo: "base",
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
    logo: "ritual",
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
    logo: "eth",
    chainId: 11155111,
    hexChainId: "0xaa36a7",
    eid: 40161,
    rpcUrls: ["https://sepolia.drpc.org"],
    explorerUrls: ["https://sepolia.etherscan.io"],
  },
  optimism: {
    label: "Optimism",
    short: "Optimism",
    token: "ETH",
    coin: "O",
    logo: "op",
    chainId: 10,
    hexChainId: "0xa",
    eid: 30111,
    rpcUrls: ["https://mainnet.optimism.io"],
    explorerUrls: ["https://optimistic.etherscan.io"],
  },
  arbitrum: {
    label: "Arbitrum",
    short: "Arbitrum",
    token: "ETH",
    coin: "A",
    logo: "arb",
    chainId: 42161,
    hexChainId: "0xa4b1",
    eid: 30110,
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    explorerUrls: ["https://arbiscan.io"],
  },
  polygon: {
    label: "Polygon",
    short: "Polygon",
    token: "POL",
    coin: "P",
    logo: "polygon",
    chainId: 137,
    hexChainId: "0x89",
    eid: 30109,
    rpcUrls: ["https://polygon-bor-rpc.publicnode.com"],
    explorerUrls: ["https://polygonscan.com"],
  },
  bnb: {
    label: "BNB Chain",
    short: "BNB",
    token: "BNB",
    coin: "B",
    logo: "bnb",
    chainId: 56,
    hexChainId: "0x38",
    eid: 30102,
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    explorerUrls: ["https://bscscan.com"],
  },
  solana: {
    label: "Solana",
    short: "Solana",
    token: "SOL",
    coin: "S",
    logo: "sol",
    chainId: null,
    hexChainId: null,
    eid: null,
    rpcUrls: [],
    explorerUrls: ["https://solscan.io"],
    nonEvm: true,
  },
};

const connectButton = document.querySelector("#connect");
const bridgeButton = document.querySelector("#bridgeButton");
const themeToggle = document.querySelector("#themeToggle");
const globalSearch = document.querySelector("#globalSearch");
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
const txCard = document.querySelector("#tx-card");
const buyTab = document.querySelector("#buyTab");
const swapTab = document.querySelector("#swapTab");
const settingsButton = document.querySelector("#settingsButton");
const tokenModal = document.querySelector("#tokenModal");
const modalTitle = document.querySelector("#modalTitle");
const closeModal = document.querySelector("#closeModal");
const chainSearch = document.querySelector("#chainSearch");
const tokenSearch = document.querySelector("#tokenSearch");
const starredChains = document.querySelector("#starredChains");
const allChains = document.querySelector("#allChains");
const tokenList = document.querySelector("#tokenList");
const walletModal = document.querySelector("#walletModal");
const closeWalletModal = document.querySelector("#closeWalletModal");
const walletList = document.querySelector("#walletList");
const navSwap = document.querySelector("#navSwap");
const navRoutes = document.querySelector("#navRoutes");
const routesModal = document.querySelector("#routesModal");
const closeRoutesModal = document.querySelector("#closeRoutesModal");
const routeList = document.querySelector("#routeList");
const buyModeToken = document.querySelector("#buyModeToken");
const buyRecipient = document.querySelector("#buyRecipient");
const recipientMenu = document.querySelector("#recipientMenu");
const recipientConnect = document.querySelector("#recipientConnect");
const recipientPaste = document.querySelector("#recipientPaste");
const recipientInput = document.querySelector("#recipientInput");
const buyUsdAmount = document.querySelector("#buyUsdAmount");
const buyCryptoQuote = document.querySelector("#buyCryptoQuote");
const trendButtons = [...document.querySelectorAll("[data-route]")];
const quickAmountButtons = [...document.querySelectorAll("[data-percent]")];
const buyPresetButtons = [...document.querySelectorAll("[data-buy-usd]")];
const allChainsButton = document.querySelector('[data-chain="all"]');

let account = "";
let solanaAccount = "";
let fromKey = "base";
let toKey = "ritual";
let selectingSide = "from";
let selectedChainFilter = "all";
let selectedProvider = null;
let selectedWalletType = "evm";
let recipientAddress = "";
let recipientMode = "same";
const announcedProviders = [];
let mode = "swap";
let sourceBalance = 0;

const TOKENS = [
  { symbol: "ETH", name: "Ether", chain: "ethereum", address: "0x0000...0000", volume: "High", logo: "eth" },
  { symbol: "ETH", name: "Ether", chain: "base", address: "0x0000...0000", volume: "High", logo: "eth" },
  { symbol: "RITUAL", name: "Ritual Testnet", chain: "ritual", address: "native", volume: "Testnet", logo: "ritual" },
  { symbol: "ORIT", name: "Omni Ritual", chain: "ritual", address: "coming soon", volume: "Coming soon", logo: "orit" },
  { symbol: "USDC", name: "USD Coin", chain: "ethereum", address: "0xa0...eb48", volume: "High", logo: "usdc" },
  { symbol: "USDC", name: "USD Coin", chain: "base", address: "0x83...2913", volume: "High", logo: "usdc" },
  { symbol: "ETH", name: "Ether", chain: "sepolia", address: "0x0000...0000", volume: "Testnet", logo: "eth" },
  { symbol: "ETH", name: "Ether", chain: "optimism", address: "0x0000...0000", volume: "High", logo: "eth" },
  { symbol: "ETH", name: "Ether", chain: "arbitrum", address: "0x0000...0000", volume: "High", logo: "eth" },
  { symbol: "POL", name: "Polygon", chain: "polygon", address: "native", volume: "High", logo: "polygon" },
  { symbol: "BNB", name: "BNB", chain: "bnb", address: "native", volume: "High", logo: "bnb" },
  { symbol: "SOL", name: "Solana", chain: "solana", address: "native", volume: "Display only", logo: "sol" },
];

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

function activeAddress() {
  return selectedWalletType === "solana" ? solanaAccount : account;
}

function activeRecipient() {
  return recipientAddress || activeAddress();
}

function recipientLabel() {
  if (recipientMode === "same" && activeAddress()) return "Same wallet";
  if (recipientAddress) return shortAddress(recipientAddress);
  return "Select recipient";
}

function updateRecipientLabels() {
  const label = recipientLabel();
  buyWallet.textContent = label;
  buyRecipient.textContent = label;
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
  if (network.nonEvm || !network.rpcUrls.length) return "0";
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
  const walletAddress = activeAddress();

  if (!walletAddress) {
    sellBalance.textContent = `Connect wallet to read ${from.label} balance.`;
    buyBalance.textContent = `Connect wallet to read ${to.label} balance.`;
    return;
  }

  sellBalance.textContent = `Loading ${from.short} balance...`;
  buyBalance.textContent = `Loading ${to.short} balance...`;

  const [fromResult, toResult] = await Promise.allSettled([
    rpcBalance(from, walletAddress),
    rpcBalance(to, walletAddress),
  ]);

  if (fromResult.status === "fulfilled") {
    sourceBalance = Number(fromResult.value);
    sellBalance.textContent = `Balance on ${from.label}: ${fromResult.value} ${from.token}`;
  } else {
    sourceBalance = 0;
    sellBalance.textContent = `Could not read ${from.label} balance.`;
  }

  buyBalance.textContent =
    toResult.status === "fulfilled"
      ? `Balance on ${to.label}: ${toResult.value} ${to.token}`
      : `Could not read ${to.label} balance.`;
}

function tokenLogo(symbol, fallback) {
  const key = symbol.toLowerCase();
  return {
    eth: { text: "ETH", className: "eth" },
    ritual: { text: "", className: "ritual ritual-logo" },
    orit: { text: "OR", className: "orit" },
    usdc: { text: "$", className: "usdc" },
    pol: { text: "POL", className: "polygon" },
    bnb: { text: "BNB", className: "bnb" },
    sol: { text: "SOL", className: "sol" },
  }[key] || { text: fallback.coin, className: fallback.logo || "eth" };
}

function chainLogo(network) {
  if (network.logo === "ritual") {
    return {
      text: "",
      className: "ritual ritual-logo",
    };
  }

  return {
    text: network.coin,
    className: network.logo || "eth",
  };
}

function setCoin(element, logo) {
  element.textContent = logo.text;
  element.className = `coin ${logo.className}`;
}

function setTokenButton(button, network) {
  const coin = button.querySelector(".coin");
  const symbol = button.querySelector("strong");
  const chain = button.querySelector("small");
  const logo = tokenLogo(network.token, network);

  setCoin(coin, logo);
  symbol.textContent = network.token;
  chain.textContent = network.short;
}

function providerName(provider) {
  if (provider?.info?.name) return provider.info.name;
  if (provider?.isMetaMask) return "MetaMask";
  if (provider?.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider?.isRabby) return "Rabby";
  if (provider?.isTrust) return "Trust Wallet";
  return "Injected Wallet";
}

function evmProviders() {
  const list = [];
  list.push(...announcedProviders.map((entry) => entry.provider));
  if (window.ethereum?.providers) list.push(...window.ethereum.providers);
  if (window.ethereum) list.push(window.ethereum);
  const named = [...new Map(list.map((provider) => [providerName(provider), provider])).entries()];
  const hasSpecificWallet = named.some(([name]) => name !== "Injected Wallet");
  return named
    .filter(([name]) => !(hasSpecificWallet && name === "Injected Wallet"))
    .map(([, provider]) => provider);
}

function solanaProviders() {
  const list = [];
  if (window.phantom?.solana) list.push({ name: "Phantom", provider: window.phantom.solana });
  if (window.solana && !list.some((entry) => entry.provider === window.solana)) {
    list.push({ name: window.solana.isPhantom ? "Phantom" : "Solana Wallet", provider: window.solana });
  }
  return list;
}

function renderWallets() {
  const detected = evmProviders();
  const solanaDetected = solanaProviders();
  walletList.innerHTML = "";

  if (!detected.length && !solanaDetected.length) {
    walletList.innerHTML = `<p class="balance-note">No wallet found. Install MetaMask/Rabby for EVM or Phantom for Solana.</p>`;
    return;
  }

  detected.forEach((provider) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wallet-option";
    button.innerHTML = `
      <span class="coin ritual">W</span>
      <span><strong>${providerName(provider)}</strong><small>Connect EVM wallet</small></span>
    `;
    button.addEventListener("click", async () => {
      button.querySelector("small").textContent = "Opening wallet...";
      try {
        await connectEvm(provider);
      } catch (error) {
        button.querySelector("small").textContent = error?.code === 4001 ? "Connection rejected" : "Could not connect";
      }
    });
    walletList.appendChild(button);
  });

  solanaDetected.forEach(({ name, provider }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wallet-option";
    button.innerHTML = `
      <span class="coin sol">SOL</span>
      <span><strong>${name}</strong><small>Connect Solana wallet</small></span>
    `;
    button.addEventListener("click", async () => {
      button.querySelector("small").textContent = "Opening Phantom...";
      try {
        await connectSolana(provider);
      } catch {
        button.querySelector("small").textContent = "Could not connect";
      }
    });
    walletList.appendChild(button);
  });
}

function openWalletModal() {
  renderWallets();
  walletModal.classList.add("open");
  walletModal.setAttribute("aria-hidden", "false");
}

function closeWalletPicker() {
  walletModal.classList.remove("open");
  walletModal.setAttribute("aria-hidden", "true");
}

function renderChainButtons() {
  const query = chainSearch.value.trim().toLowerCase();
  const entries = Object.entries(NETWORKS).filter(([, network]) => network.label.toLowerCase().includes(query));
  const starred = entries.filter(([key]) => ["ritual", "base", "ethereum", "sepolia"].includes(key));
  const rest = entries.filter(([key]) => !["ritual", "base", "ethereum", "sepolia"].includes(key));

  function makeButton(key, network) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chain-option ${selectedChainFilter === key ? "active" : ""}`;
    button.dataset.chain = key;
    const logo = chainLogo(network);
    button.innerHTML = `<span class="coin ${logo.className}">${logo.text}</span><span>${network.label}</span>`;
    button.addEventListener("click", () => {
      selectedChainFilter = key;
      renderTokenModal();
    });
    return button;
  }

  starredChains.innerHTML = "";
  allChains.innerHTML = "";
  starred.forEach(([key, network]) => starredChains.appendChild(makeButton(key, network)));
  rest.forEach(([key, network]) => allChains.appendChild(makeButton(key, network)));
}

function renderTokenModal() {
  renderChainButtons();
  const tokenQuery = tokenSearch.value.trim().toLowerCase();
  const tokens = TOKENS.filter((token) => {
    const chainMatch = selectedChainFilter === "all" || token.chain === selectedChainFilter;
    const tokenMatch = [token.symbol, token.name, token.address, NETWORKS[token.chain].label]
      .join(" ")
      .toLowerCase()
      .includes(tokenQuery);
    return chainMatch && tokenMatch;
  });

  document.querySelectorAll(".chain-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.chain === selectedChainFilter);
  });

  tokenList.innerHTML = "";
  tokens.forEach((token) => {
    const network = NETWORKS[token.chain];
    const logo = tokenLogo(token.logo || token.symbol, network);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "token-option";
    button.innerHTML = `
      <span class="coin ${logo.className}">${logo.text}</span>
      <span><strong>${token.symbol}</strong><small>${network.label} ${token.address}</small></span>
      <span class="route-chip">${token.volume}</span>
    `;
    button.addEventListener("click", () => chooseToken(token));
    tokenList.appendChild(button);
  });
}

function renderRoutes() {
  const pairs = Object.entries(ROUTES);
  routeList.innerHTML = "";

  pairs.forEach(([pair, route]) => {
    const [from, to] = pair.split(":");
    const item = document.createElement("button");
    item.type = "button";
    item.className = "route-item";
    item.innerHTML = `
      <span>
        <strong>${NETWORKS[from].label} -> ${NETWORKS[to].label}</strong>
        <small>${route.label}</small>
      </span>
      <span class="route-chip">${route.available ? "Available" : "Coming soon"}</span>
    `;
    item.addEventListener("click", () => {
      fromKey = from;
      toKey = to;
      amountInput.value = "0";
      updateQuote();
      closeRoutesPicker();
      if (activeAddress() && !NETWORKS[fromKey].nonEvm) switchToNetwork(fromKey);
    });
    routeList.appendChild(item);
  });
}

function openRoutesPicker() {
  renderRoutes();
  routesModal.classList.add("open");
  routesModal.setAttribute("aria-hidden", "false");
}

function closeRoutesPicker() {
  routesModal.classList.remove("open");
  routesModal.setAttribute("aria-hidden", "true");
}

function chooseToken(token) {
  if (selectingSide === "from") {
    fromKey = token.chain;
    if (fromKey === toKey) toKey = fromKey === "ritual" ? "base" : "ritual";
  } else {
    toKey = token.chain;
    if (fromKey === toKey) fromKey = toKey === "ritual" ? "base" : "ritual";
  }

  updateQuote();
  closeTokenModal();
  if (account && !NETWORKS[fromKey].nonEvm) switchToNetwork(fromKey);
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
  setTokenButton(sellToken, from);
  setTokenButton(buyToken, to);
  setTokenButton(buyModeToken, to);
  updateRecipientLabels();
  bridgeButton.textContent = activeAddress() ? (route.available ? `Bridge from ${from.short}` : "Coming Soon") : "Connect Wallet";
  bridgeButton.disabled = Boolean(activeAddress() && !route.available);
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
  const wallet = selectedProvider || window.ethereum;
  if (!wallet) return;
  const network = NETWORKS[key];
  if (network.nonEvm || !network.hexChainId) return;

  try {
    await wallet.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.hexChainId }],
    });
  } catch (error) {
    if (error && error.code === 4902) {
      await wallet.request({
        method: "wallet_addEthereumChain",
        params: [walletChainParams(network)],
      });
      return;
    }
    throw error;
  }
}

async function connectEvm(provider = selectedProvider || window.ethereum) {
  if (!provider) {
    connectButton.textContent = "No wallet";
    bridgeButton.textContent = "No Wallet Found";
    openWalletModal();
    return;
  }

  selectedProvider = provider;
  selectedWalletType = "evm";
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  account = accounts[0] || "";
  await switchToNetwork(fromKey);

  const label = shortAddress(account);

  connectButton.textContent = label || "Connect";
  sellWallet.textContent = label || "Select wallet";
  updateRecipientLabels();
  closeWalletPicker();
  updateQuote();
}

async function connectSolana(provider = window.phantom?.solana || window.solana) {
  if (!provider) {
    openWalletModal();
    return;
  }

  const response = await provider.connect();
  solanaAccount = response.publicKey.toString();
  selectedProvider = provider;
  selectedWalletType = "solana";

  const label = shortAddress(solanaAccount);
  connectButton.textContent = label || "Connect";
  sellWallet.textContent = label || "Select wallet";
  updateRecipientLabels();
  closeWalletPicker();

  if (fromKey !== "solana" && toKey !== "solana") {
    fromKey = "solana";
    toKey = "ritual";
  }

  updateQuote();
}

function openTokenModal(side) {
  selectingSide = side;
  selectedChainFilter = "all";
  modalTitle.textContent = side === "from" ? "Select Sell Token" : "Select Buy Token";
  tokenModal.classList.add("open");
  tokenModal.setAttribute("aria-hidden", "false");
  renderTokenModal();
}

function closeTokenModal() {
  tokenModal.classList.remove("open");
  tokenModal.setAttribute("aria-hidden", "true");
}

function openRecipientMenu(anchor) {
  const rect = anchor.getBoundingClientRect();
  recipientMenu.style.left = `${Math.max(12, rect.right - 210)}px`;
  recipientMenu.style.top = `${rect.bottom + 8}px`;
  recipientMenu.classList.add("open");
  recipientMenu.setAttribute("aria-hidden", "false");
}

function closeRecipientMenu() {
  recipientMenu.classList.remove("open", "paste-mode");
  recipientMenu.setAttribute("aria-hidden", "true");
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
  amountInput.value = "0";
  updateQuote();
  if (activeAddress() && !NETWORKS[fromKey].nonEvm) switchToNetwork(fromKey);
});

sellToken.addEventListener("click", () => openTokenModal("from"));
buyToken.addEventListener("click", () => openTokenModal("to"));
buyModeToken.addEventListener("click", () => openTokenModal("to"));
sellWallet.addEventListener("click", openWalletModal);
buyWallet.addEventListener("click", (event) => openRecipientMenu(event.currentTarget));
buyRecipient.addEventListener("click", (event) => openRecipientMenu(event.currentTarget));
recipientConnect.addEventListener("click", () => {
  recipientMode = "custom";
  closeRecipientMenu();
  openWalletModal();
});
recipientPaste.addEventListener("click", () => {
  recipientMenu.classList.add("paste-mode");
  recipientInput.focus();
});
recipientInput.addEventListener("change", () => {
  recipientAddress = recipientInput.value.trim();
  recipientMode = "custom";
  updateRecipientLabels();
  closeRecipientMenu();
});
document.addEventListener("click", (event) => {
  if (
    recipientMenu.classList.contains("open") &&
    !recipientMenu.contains(event.target) &&
    event.target !== buyWallet &&
    event.target !== buyRecipient
  ) {
    closeRecipientMenu();
  }
});
closeModal.addEventListener("click", closeTokenModal);
closeWalletModal.addEventListener("click", closeWalletPicker);
globalSearch.addEventListener("click", () => openTokenModal("to"));
navSwap.addEventListener("click", (event) => {
  event.preventDefault();
  swapTab.click();
});
navRoutes.addEventListener("click", (event) => {
  event.preventDefault();
  openRoutesPicker();
});
closeRoutesModal.addEventListener("click", closeRoutesPicker);
routesModal.addEventListener("click", (event) => {
  if (event.target === routesModal) closeRoutesPicker();
});
allChainsButton.addEventListener("click", () => {
  selectedChainFilter = "all";
  renderTokenModal();
});
tokenModal.addEventListener("click", (event) => {
  if (event.target === tokenModal) closeTokenModal();
});
walletModal.addEventListener("click", (event) => {
  if (event.target === walletModal) closeWalletPicker();
});
chainSearch.addEventListener("input", renderTokenModal);
tokenSearch.addEventListener("input", renderTokenModal);
trendButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const [from, to] = button.dataset.route.split(":");
    fromKey = from;
    toKey = to;
    amountInput.value = "0";
    updateQuote();
    if (activeAddress() && !NETWORKS[fromKey].nonEvm) switchToNetwork(fromKey);
  });
});
swapTab.addEventListener("click", () => {
  mode = "swap";
  document.body.classList.remove("buy-mode");
  swapTab.classList.add("active");
  buyTab.classList.remove("active");
  amountInput.value = "0";
  updateQuote();
});
buyTab.addEventListener("click", () => {
  mode = "buy";
  document.body.classList.add("buy-mode");
  buyTab.classList.add("active");
  swapTab.classList.remove("active");
  fromKey = "base";
  toKey = "ritual";
  amountInput.value = "0";
  updateQuote();
});
buyPresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    buyUsdAmount.value = button.dataset.buyUsd;
    buyCryptoQuote.textContent = `${(Number(button.dataset.buyUsd) / 2132).toFixed(5)} ETH`;
  });
});
settingsButton.addEventListener("click", () => {
  routeDetails.classList.toggle("collapsed");
});

quickAmountButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const percent = Number(button.dataset.percent);
    const base = sourceBalance > 0 ? sourceBalance : 0;
    amountInput.value = base > 0 ? ((base * percent) / 100).toFixed(6).replace(/\.?0+$/, "") : "0";
    updateQuote();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
});

document.addEventListener("keydown", (event) => {
  const tag = event.target?.tagName?.toLowerCase();
  if (event.key === "/" && !["input", "textarea"].includes(tag)) {
    event.preventDefault();
    openTokenModal("to");
  }
});

window.addEventListener("eip6963:announceProvider", (event) => {
  if (!announcedProviders.some((entry) => entry.info.uuid === event.detail.info.uuid)) {
    announcedProviders.push(event.detail);
  }
});
window.dispatchEvent(new Event("eip6963:requestProvider"));

amountInput.addEventListener("input", updateQuote);
connectButton.addEventListener("click", openWalletModal);
bridgeButton.addEventListener("click", () => {
  if (!activeAddress()) openWalletModal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!activeAddress()) {
    openWalletModal();
    return;
  }

  if (!NETWORKS[fromKey].nonEvm) await switchToNetwork(fromKey);

  const request = {
    from: NETWORKS[fromKey].label,
    to: NETWORKS[toKey].label,
    sellToken: NETWORKS[fromKey].token,
    buyToken: NETWORKS[toKey].token,
    amount: amountInput.value,
    receive: receiveInput.value,
    wallet: activeAddress(),
    recipient: activeRecipient(),
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
        <dt>Wallet</dt><dd>${shortAddress(activeAddress())}</dd>
        <dt>Recipient</dt><dd>${shortAddress(activeRecipient())}</dd>
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
      <dt>Wallet</dt><dd>${shortAddress(activeAddress())}</dd>
      <dt>Recipient</dt><dd>${shortAddress(activeRecipient())}</dd>
      <dt>Ritual</dt><dd>Testnet chain ID 1979</dd>
      <dt>Request</dt><dd>${requestHash}</dd>
    </dl>
  `;
});

updateQuote();
