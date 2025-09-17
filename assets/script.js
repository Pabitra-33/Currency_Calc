// Elements from the DOM
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertBtn = document.getElementById("convert");
const result = document.getElementById("result");

let ratesData = {}; // To store fetched currency rates

// Fetch currency rates and populate dropdowns

async function loadCurrencies() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");// Using a free currency API
    const data = await res.json();
    ratesData = data.rates;

    // Populate dropdowns with currency codes
    Object.keys(ratesData).forEach(code => {
      fromCurrency.innerHTML += `<option value="${code}">${code}</option>`;
      toCurrency.innerHTML += `<option value="${code}">${code}</option>`;
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  } catch (error) {
    result.innerText = "⚠️ Error loading currency data!";// Error handling
  }
}

// Conversion logic on button click
convertBtn.addEventListener("click", () => {
  const amount = document.getElementById("amount").value;
  if (!amount || amount <= 0) {
    result.innerText = "⚠️ Please enter a valid amount."; // Input validation
    return;
  }

  // Get rates for selected currencies
  const fromRate = ratesData[fromCurrency.value];
  const toRate = ratesData[toCurrency.value];

  if (!fromRate || !toRate) {
    result.innerText = "⚠️ Invalid currency selection.";
    return;
  }

  // Perform conversion
  const converted = (amount / fromRate) * toRate;
  result.innerText = `${amount} ${fromCurrency.value} = ${converted.toFixed(2)} ${toCurrency.value}`;
});

// Load currencies on page load
loadCurrencies();