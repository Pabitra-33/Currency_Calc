// Elements from the DOM
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertBtn = document.getElementById("convert");
const result = document.getElementById("result");
const amountInput = document.getElementById("amount");

let ratesData = {}; // To store fetched currency rates

// Spinner element
const spinner = document.createElement("div");
spinner.innerText = "⏳ Loading exchange rates...";
spinner.style.display = "none";
spinner.style.textAlign = "center";
spinner.style.color = "#0077ff";
document.querySelector(".converter").appendChild(spinner);

// Load currencies from API
async function loadCurrencies() {
  try {
    spinner.style.display = "block"; // Show spinner
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");// Using USD as base
    if (!res.ok) throw new Error("Failed to fetch exchange rates.");
    const data = await res.json();
    ratesData = data.rates;

    // Populate dropdowns with currency codes
    Object.keys(ratesData).forEach(code => {
      fromCurrency.innerHTML += `<option value="${code}">${code}</option>`;
      toCurrency.innerHTML += `<option value="${code}">${code}</option>`;
    });

    // Load last used values from localStorage if available
    const savedFrom = localStorage.getItem("fromCurrency") || "USD";
    const savedTo = localStorage.getItem("toCurrency") || "INR";
    const savedAmount = localStorage.getItem("amount") || "";

    fromCurrency.value = savedFrom;
    toCurrency.value = savedTo;
    amountInput.value = savedAmount;

  } catch (error) {
    result.innerText = `⚠️ ${error.message}`;
  } finally {
    spinner.style.display = "none"; // Hide spinner
  }
}

// Convert function
convertBtn.addEventListener("click", () => {
  const amount = amountInput.value;

  if (!amount || amount <= 0) {
    result.innerText = "⚠️ Please enter a valid amount.";
    return;
  }

  const fromRate = ratesData[fromCurrency.value];
  const toRate = ratesData[toCurrency.value];

  if (!fromRate || !toRate) {
    result.innerText = "⚠️ Invalid currency selection.";
    return;
  }

  const converted = (amount / fromRate) * toRate;
  result.innerText = `${amount} ${fromCurrency.value} = ${converted.toFixed(2)} ${toCurrency.value}`;

  // Save preferences in localStorage
  localStorage.setItem("fromCurrency", fromCurrency.value);
  localStorage.setItem("toCurrency", toCurrency.value);
  localStorage.setItem("amount", amount);
});

// Load currencies on page load
loadCurrencies();