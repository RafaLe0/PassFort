async function sha1Hex(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function checkPwned(password) {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const url = `https://api.pwnedpasswords.com/range/${prefix}`;

  const res = await fetch(url, { headers: { "Add-Padding": "true" } });
  if (!res.ok) throw new Error("Erreur API Have I Been Pwned");

  const text = await res.text();
  for (const line of text.split("\n")) {
    const [hashSuffix, count] = line.trim().split(":");
    if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
      return parseInt(count, 10);
    }
  }
  return 0;
}

function evaluateStrength(password) {
  if (!password) return { label: "Vide", score: 0, bits: 0 };

  let score = 0;
  let bits = 0;

  const length = password.length;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  const charsetSize = variety === 1 ? 26 : variety === 2 ? 52 : variety === 3 ? 62 : 94;
  bits = Math.round(Math.log2(Math.pow(charsetSize, length)));

  let label;
  if (length >= 15 && bits >= 100) {
    label = "Très fort";
    score = 4;
  } else if (length >= 12 && bits >= 85) {
    label = "Fort";
    score = 3;
  } else if (length >= 9 && bits >= 65) {
    label = "Moyen";
    score = 2;
  } else {
    label = "Faible";
    score = 1;
  }

  return { label, score, bits };
}

function generatePassword(length = 16) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

  const all = lower + upper + digits + symbols;
  let result = "";

  result += lower[Math.floor(Math.random() * lower.length)];
  result += upper[Math.floor(Math.random() * upper.length)];
  result += digits[Math.floor(Math.random() * digits.length)];
  result += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = result.length; i < length; i++) {
    result += all[Math.floor(Math.random() * all.length)];
  }
  return result.split("").sort(() => Math.random() - 0.5).join("");
}



document.getElementById("checkBtn").addEventListener("click", async () => {
  const input = document.getElementById("passwordInput");
  const result = document.getElementById("result");
  const pwd = input.value.trim();

  if (!pwd) {
    result.textContent = "Type your password.";
    result.style.color = "#d9534f";
    return;
  }

  result.textContent = "Thinking...";
  result.style.color = "#444";

  try {
    const { label, score } = evaluateStrength(pwd);
    const pwnCount = await checkPwned(pwd);

    if (pwnCount > 0) {
      result.textContent = `This password has been seen ${pwnCount} times in data breaches !`;
      result.style.color = "#d9534f";
    } else {
      const emoji = label === "Strong" ? "✅" : label === "Mid" ? "🟠" : "❌";
      result.textContent = `${emoji} ${label} (${score}/6) — This password wasn't found in any of the Pwned Passwords loaded into Have I Been Pwned`;
      result.style.color = label === "Strong" ? "#28a745" : "#e67e22";
    }
  } catch (err) {
    console.error(err);
    result.textContent = "Error contacting API Have I Been Pwned.";
    result.style.color = "#d9534f";
  }
});

document.getElementById("generateBtn").addEventListener("click", () => {
  const input = document.getElementById("passwordInput");
  input.value = generatePassword(16);
  const result = document.getElementById("result");
  result.textContent = "New password generated — Cick on verify to test it";
  result.style.color = "#444";
});
