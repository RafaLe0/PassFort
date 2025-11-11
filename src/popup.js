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

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  const charsetSize = variety === 1 ? 26 : variety === 2 ? 52 : variety === 3 ? 62 : 94;

  const bits = Math.round(length * Math.log2(charsetSize));

  // Score global de 0 à 5
  let score;
  let label;

  if (bits < 40) {
    score = 1;
    label = "Très faible";
  } else if (bits < 60) {
    score = 2;
    label = "Faible";
  } else if (bits < 80) {
    score = 3;
    label = "Moyen";
  } else if (bits < 100) {
    score = 4;
    label = "Fort";
  } else {
    score = 5;
    label = "Très fort";
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
	const { label, score, bits } = evaluateStrength(pwd);
	const pwnCount = await checkPwned(pwd);

	if (pwnCount > 0) {
  		result.textContent = `⚠️ This password appears ${pwnCount} times in known breaches!`;
  		result.style.color = "#d9534f";
	} else {
  		let emoji;
  		let color;

  		switch (label) {
    			case "Très faible":
		     		emoji = "❌";
      				color = "#d9534f";
      			break;
    			case "Faible":
      				emoji = "🔴";
      				color = "#e74c3c";
      			break;
    			case "Moyen":
      				emoji = "🟠";
      				color = "#e67e22";
      			break;
    			case "Fort":
      				emoji = "🟢";
      				color = "#28a745";
      			break;
    			case "Très fort":
      				emoji = "💪";
      				color = "#00ff99";
      			break;
    			default:
      				emoji = "❓";
      				color = "#999";
  		}

  		result.textContent = `${emoji} ${label} (${score}/5) — ${bits} bits of entropy — Not found in HIBP database`;
  		result.style.color = color;
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



document.getElementById("toggleVisibilityBtn").addEventListener("click", () => {
  const input = document.getElementById("passwordInput");
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
});



document.getElementById("copyBtn").addEventListener("click", async () => {
  const input = document.getElementById("passwordInput");
  if (!input.value) return;

  try {
    await navigator.clipboard.writeText(input.value);
    const result = document.getElementById("result");
    result.textContent = "Password copied to clipboard";
    result.style.color = "#28a745";
  } catch (err) {
    console.error("Clipboard error:", err);
    const result = document.getElementById("result");
    result.textContent = "Unable to copy password";
    result.style.color = "#d9534f";
  }
});

