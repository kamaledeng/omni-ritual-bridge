const CHAINS = {
  baseSepolia: {
    name: "Base Sepolia",
    chainId: 84532,
    eid: 40245,
    feeSymbol: "ETH",
  },
  sepolia: {
    name: "Ethereum Sepolia",
    chainId: 11155111,
    eid: 40161,
    feeSymbol: "ETH",
  },
  optimismSepolia: {
    name: "Optimism Sepolia",
    chainId: 11155420,
    eid: 40232,
    feeSymbol: "ETH",
  },
};

const form = document.querySelector("#bridge-form");
const connectButton = document.querySelector("#connect");
const fromSelect = document.querySelector("#fromChain");
const toSelect = document.querySelector("#toChain");
const swapButton = document.querySelector("#swapChains");
const maxButton = document.querySelector("#maxAmount");
const amountInput = document.querySelector("#amount");
const tokenSelect = document.querySelector("#token");
const recipientInput = document.querySelector("#recipient");
const routeLabel = document.querySelector("#routeLabel");
const feeLabel = document.querySelector("#feeLabel");
const receiveLabel = document.querySelector("#receiveLabel");
const txCard = document.querySelector("#tx-card");
const verdictLabel = document.querySelector("#verdict-label");
const verdictCopy = document.querySelector("#verdict-copy");
const steps = [...document.querySelectorAll(".step")];

let account = "";

function shortAddress(value) {
  if (!value || value.length < 12) return value || "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function getRoute() {
  const from = CHAINS[fromSelect.value];
  const to = CHAINS[toSelect.value];
  const token = tokenSelect.value;
  const amount = Number(amountInput.value || 0);
  return { from, to, token, amount };
}

function updateQuote() {
  const { from, to, token, amount } = getRoute();
  const sameChain = from.chainId === to.chainId;
  const estimatedFee = sameChain ? "Invalid route" : `~0.002 ${from.feeSymbol}`;
  const receiveAmount = amount > 0 && !sameChain ? `${amount.toLocaleString()} ${token}` : `0 ${token}`;

  routeLabel.textContent = `${from.name} -> ${to.name}`;
  feeLabel.textContent = estimatedFee;
  receiveLabel.textContent = receiveAmount;
}

async function connect() {
  if (!window.ethereum) {
    connectButton.textContent = "No wallet";
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0] || "";
  connectButton.textContent = account ? shortAddress(account) : "Connect Wallet";

  if (!recipientInput.value && account) {
    recipientInput.value = account;
  }
}

async function digestBridgeRequest(request) {
  const payload = JSON.stringify(request);
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `0x${[...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function validateBridge(request) {
  if (request.from.chainId === request.to.chainId) {
    return { label: "INVALID", copy: "Choose two different chains.", active: 1 };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(request.recipient)) {
    return { label: "INVALID", copy: "Enter a valid recipient address.", active: 1 };
  }

  if (request.amount <= 0) {
    return { label: "INVALID", copy: "Enter an amount greater than zero.", active: 1 };
  }

  return {
    label: "READY",
    copy: "Route looks valid. In production this button calls OFT quoteSend/send after wallet approval.",
    active: 3,
  };
}

function renderBridgeRequest(request, requestHash, result) {
  verdictLabel.textContent = result.label;
  verdictCopy.textContent = result.copy;
  steps.forEach((step, index) => step.classList.toggle("active", index < result.active));

  txCard.innerHTML = `
    <dl>
      <dt>Request</dt><dd>${requestHash}</dd>
      <dt>From</dt><dd>${request.from.name} / EID ${request.from.eid}</dd>
      <dt>To</dt><dd>${request.to.name} / EID ${request.to.eid}</dd>
      <dt>Token</dt><dd>${request.token}</dd>
      <dt>Amount</dt><dd>${request.amount} ${request.token}</dd>
      <dt>Recipient</dt><dd>${request.recipient}</dd>
      <dt>Ritual</dt><dd>Intent log prepared for chain 1979</dd>
    </dl>
  `;
}

connectButton.addEventListener("click", connect);

swapButton.addEventListener("click", () => {
  const from = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = from;
  updateQuote();
});

maxButton.addEventListener("click", () => {
  amountInput.value = "100";
  updateQuote();
});

[fromSelect, toSelect, amountInput, tokenSelect].forEach((element) => {
  element.addEventListener("input", updateQuote);
  element.addEventListener("change", updateQuote);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const route = getRoute();
  const request = {
    ...route,
    recipient: recipientInput.value.trim(),
    requester: account || "not connected",
    createdAt: new Date().toISOString(),
  };

  const requestHash = await digestBridgeRequest(request);
  const result = validateBridge(request);
  renderBridgeRequest(request, requestHash, result);
});

updateQuote();
