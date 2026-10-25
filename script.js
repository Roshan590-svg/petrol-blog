const languageToggle = document.querySelector(".language-toggle");
const translatableElements = document.querySelectorAll("[data-en][data-ur]");
const countrySelect = document.querySelector("#country-select");
const countryResult = document.querySelector("#country-result");
const countrySourceLink = document.querySelector("#country-source-link");
const faqHelperForm = document.querySelector("#faq-helper-form");
const faqQuestion = document.querySelector("#faq-question");
const faqHelperResponse = document.querySelector("#faq-helper-response");
let lastFaqResponse = null;

const countries = [
  "Algeria", "Andorra", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Benin", "Bolivia",
  "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Burkina Faso", "Burma (Myanmar)",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chile", "China",
  "Colombia", "Costa Rica", "Croatia", "Curacao", "Cyprus", "Czech Republic", "Denmark",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Fiji", "Finland",
  "France", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guyana",
  "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel",
  "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kenya", "Kuwait", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar",
  "Malawi", "Malaysia", "Malta", "Mauritius", "Mayotte", "Mexico", "Moldova", "Montenegro",
  "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Lucia",
  "Saudi Arabia", "Serbia", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Suriname", "Sweden", "Switzerland", "Taiwan",
  "Tanzania", "Thailand", "Tunisia", "Turkey", "Ukraine", "United Arab Emirates",
  "United Kingdom", "Uruguay", "USA", "Vietnam", "Wallis and Futuna Islands", "Zambia", "Zimbabwe",
];

const unavailableCountryPages = new Set(["Burma (Myanmar)"]);
const providerCoverageUrl = "https://www.globalpetrolprices.com/data_download.php";
const faqAnswers = [
  {
    keywords: /\b(save|saving|mileage|efficien|bach|fuel use|consumption|tyre|tire|pressure|drive|driving|average|idling|safar|petrol bach|fuel bach)\b/i,
    english: "Accelerate gently, avoid unnecessary idling, keep tyres at the pressure in your owner's manual, and follow routine servicing. Results vary with your vehicle, route, traffic, and weather.",
    romanUrdu: "Narmi se speed barhayein, bila-zaroorat engine chalta na chhorein, tyres ka pressure owner's manual ke mutabiq rakhein, aur routine servicing karwate rahein. Natija gaari, route, traffic aur mausam par depend karta hai.",
  },
  {
    keywords: /\b(octane|grade|which|right|safe|suitable|choose|type|kaunsa|kaunsi|munasib|mehfooz|gaari|car|manual|fuel type)\b/i,
    english: "Use the fuel type and minimum octane rating specified in your owner's manual or on the fuel-door label. If unclear, ask your vehicle maker or an authorized service centre.",
    romanUrdu: "Owner's manual ya fuel-door label par di gayi fuel type aur kam az kam octane rating istemal karein. Agar hidayat wazeh na ho to vehicle maker ya authorized service centre se poochein.",
  },
  {
    keywords: /\b(pump|refuel|refuelling|refueling|spill|safety|station|bharwa|aag|nozzle|petrol pump)\b/i,
    english: "At the pump, switch off the engine, follow station signs, keep flames and smoking away, and stop when the nozzle clicks off. Tell station staff about any spill.",
    romanUrdu: "Pump par engine band karein, station ke signs par amal karein, aag aur smoking ko door rakhein, aur nozzle rukne par fuel bharna band karein. Fuel girne par station staff ko batayein.",
  },
  {
    keywords: /\b(price|prices|rate|rates|qeemat|qeematein|petrol|fuel|notification)\b/i,
    english: "This site does not publish live rates. For an announced price change, check the official government or regulator notice, confirm the fuel product and effective date/time, and avoid undated or unverified lists. Prices can include global oil, exchange rates, taxes, and local policy.",
    romanUrdu: "Yeh site live rates publish nahi karti. Qeemat mein tabdeeli ke liye official government ya regulator notice check karein, fuel product aur nafiz hone ki tareekh/waqt confirm karein, aur be-tareekh ya ghair-tasdeeq-shuda list se bachein. Qeemat par global oil, exchange rates, taxes aur maqami policy ka asar ho sakta hai.",
  },
];

function isCurrentPriceQuestion(message) {
  const asksForCurrentRate = /\b(today|current|latest|right now|aaj|abhi|naya|nayi|kitna|kitnay|kitni|kitne|what is|what's|how much|kya hai|kya rate)\b/i.test(message);
  const asksAboutFuelPrice = /\b(petrol|fuel|price|rate|qeemat)\b/i.test(message);
  const asksDirectlyForFuelPrice = /^\s*(?:(?:what(?:'s| is)|how much is|aaj|abhi|kitna|kitnay|kitni|kitne|kya hai)\s*)?(?:the\s+)?(?:petrol|fuel)\b.{0,35}\b(?:price|rate|qeemat)\s*\??\s*$/i.test(message);
  return asksAboutFuelPrice && (asksForCurrentRate || asksDirectlyForFuelPrice);
}

function showFAQResponse(english, romanUrdu) {
  lastFaqResponse = { english, romanUrdu };
  faqHelperResponse.textContent = document.documentElement.lang === "en" ? english : romanUrdu;
}

faqHelperForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = faqQuestion.value.trim();
  if (!question) return;

  if (isCurrentPriceQuestion(question)) {
    showFAQResponse(
      "We can't verify live petrol prices here. Check the latest official government notice and its effective date; if you can't verify one, don't rely on a guessed rate.",
      "Hum yahan live petrol rates verify nahi kar sakte. Naya official government notice aur us ki nafaz ki tareekh check karein; tasdeeq na ho to andazay par bharosa na karein.",
    );
    return;
  }

  const answer = faqAnswers.find((entry) => entry.keywords.test(question));
  showFAQResponse(
    answer?.english || "I couldn't match that to the quick guides. Browse the bilingual FAQs below for verified guidance; I don't have live price data.",
    answer?.romanUrdu || "Is sawal ka jawab quick guides mein nahi mila. Tasdeeq-shuda mashware ke liye neeche bilingual FAQs dekhein; mere paas live price data nahi.",
  );
});

countries.forEach((country) => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  countrySelect.append(option);
});

function updateCountryReference() {
  const country = countrySelect.value;
  const language = document.documentElement.lang === "en" ? "en" : "ur";

  if (!country) {
    countryResult.textContent = countryResult.getAttribute(`data-${language}`);
    countrySourceLink.href = providerCoverageUrl;
    countrySourceLink.setAttribute("aria-disabled", "true");
    countrySourceLink.tabIndex = -1;
    countrySourceLink.hidden = true;
    return;
  }

  countrySourceLink.hidden = false;

  if (unavailableCountryPages.has(country)) {
    countryResult.textContent = language === "en"
      ? "This location appears in the provider's download list, but we could not verify a public country-specific page."
      : "Yeh jagah provider ki download list mein hai, lekin iska public country-specific page verify nahi ho saka.";
    countrySourceLink.href = providerCoverageUrl;
    countrySourceLink.setAttribute("aria-disabled", "false");
    countrySourceLink.tabIndex = 0;
    countrySourceLink.textContent = language === "en"
      ? "Check provider's coverage list ↗"
      : "Provider ki coverage list dekhein ↗";
    return;
  }

  const countrySlug = country.replace(/\s+/g, "-");
  countryResult.textContent = language === "en"
    ? `Open ${country}'s public source page for its local-currency rate and last-updated date.`
    : `${country} ki local-currency rate aur aakhri update ki tareekh ke liye public source page kholein.`;
  countrySourceLink.href = `https://www.globalpetrolprices.com/${encodeURIComponent(countrySlug)}/gasoline_prices/`;
  countrySourceLink.setAttribute("aria-disabled", "false");
  countrySourceLink.tabIndex = 0;
  countrySourceLink.textContent = countrySourceLink.getAttribute(`data-${language}`);
}

function setLanguage(language) {
  const attribute = `data-${language}`;

  translatableElements.forEach((element) => {
    element.textContent = element.getAttribute(attribute);
  });

  document.querySelectorAll("[data-en-placeholder][data-ur-placeholder]").forEach((element) => {
    element.placeholder = element.getAttribute(`data-${language}-placeholder`);
  });

  document.querySelectorAll("[data-en-label][data-ur-label]").forEach((element) => {
    element.setAttribute("aria-label", element.getAttribute(`data-${language}-label`));
  });

  document.documentElement.lang = language === "ur" ? "ur-Latn" : "en";
  languageToggle.setAttribute("aria-pressed", String(language === "ur"));
  languageToggle.setAttribute(
    "aria-label",
    language === "en" ? "Switch to Roman Urdu" : "Switch to English",
  );
  updateCountryReference();
  if (lastFaqResponse) {
    faqHelperResponse.textContent = language === "en" ? lastFaqResponse.english : lastFaqResponse.romanUrdu;
  }
}

languageToggle.addEventListener("click", () => {
  const nextLanguage = document.documentElement.lang === "en" ? "ur" : "en";
  setLanguage(nextLanguage);
});

countrySelect.addEventListener("change", updateCountryReference);
updateCountryReference();
