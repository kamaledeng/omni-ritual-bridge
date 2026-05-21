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

const form = document.querySelector("#intent-form");
const connectButton = document.querySelector("#connect");
const addChainButton = document.querySelector("#add-chain");
const card = document.querySelector("#intent-card");
const verdictLabel = document.querySelector("#verdict-label");
const steps = [...document.querySelectorAll(".step")];

let account = "";

function shortAddress(value) {
  if (!value || value.length < 12) return value || "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

async function connect() {
  if (!window.ethereum) {
    connectButton.textContent = "No wallet";
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0] || "";
  connectButton.textContent = account ? shortAddress(account) : "Connect";

  if (!document.querySelector("#recipient").value && account) {
    document.querySelector("#recipient").value = account;
  }
}

async function addRitualChain() {
  if (!window.ethereum) return;
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [RITUAL_CHAIN],
  });
}

async function digestIntent(intent) {
  const payload = JSON.stringify(intent);
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `0x${[...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function localVerdict(intent) {
  const amount = Number(intent.amount);
  const recipientOk = /^0x[a-fA-F0-9]{40}$/.test(intent.recipient);
  const tokenOk = /^0x[a-fA-F0-9]{40}$/.test(intent.token);

  if (!recipientOk || !tokenOk || amount <= 0) {
    return {
      label: "REJECTED",
      reason: "Malformed recipient, token, or amount.",
      active: 1,
    };
  }

  if (amount > 1000 || !intent.instruction.toLowerCase().includes("safe")) {
    return {
      label: "REVIEW",
      reason: "Intent needs manual review because the amount is large or safety instruction is missing.",
      active: 2,
    };
  }

  return {
    label: "APPROVED",
    reason: "Intent passes the local demo policy. Submit the same payload to Ritual for on-chain verification.",
    active: 3,
  };
}

function renderIntent(intent, hash, verdict) {
  verdictLabel.textContent = verdict.label;
  steps.forEach((step, index) => step.classList.toggle("active", index < verdict.active));
  card.innerHTML = `
    <dl>
      <dt>Intent hash</dt><dd>${hash}</dd>
      <dt>Requester</dt><dd>${account || "not connected"}</dd>
      <dt>Source</dt><dd>${intent.srcChain}</dd>
      <dt>Destination</dt><dd>${intent.dstChain}</dd>
      <dt>Token</dt><dd>${intent.token}</dd>
      <dt>Recipient</dt><dd>${intent.recipient}</dd>
      <dt>Amount</dt><dd>${intent.amount}</dd>
      <dt>Instruction</dt><dd>${intent.instruction}</dd>
      <dt>Reason</dt><dd>${verdict.reason}</dd>
    </dl>
  `;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const intent = {
    requester: account,
    srcChain: document.querySelector("#srcChain").value,
    dstChain: document.querySelector("#dstChain").value,
    token: document.querySelector("#token").value.trim(),
    recipient: document.querySelector("#recipient").value.trim(),
    amount: document.querySelector("#amount").value,
    instruction: document.querySelector("#instruction").value.trim(),
    createdAt: new Date().toISOString(),
  };

  const hash = await digestIntent(intent);
  const verdict = localVerdict(intent);
  renderIntent(intent, hash, verdict);
});

connectButton.addEventListener("click", connect);
addChainButton.addEventListener("click", addRitualChain);
