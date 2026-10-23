const languageToggle = document.querySelector(".language-toggle");
const translatableElements = document.querySelectorAll("[data-en][data-ur]");
const countrySelect = document.querySelector("#country-select");
const countryResult = document.querySelector("#country-result");
const countrySourceLink = document.querySelector("#country-source-link");

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
}

languageToggle.addEventListener("click", () => {
  const nextLanguage = document.documentElement.lang === "en" ? "ur" : "en";
  setLanguage(nextLanguage);
});

countrySelect.addEventListener("change", updateCountryReference);
updateCountryReference();
