const languageToggle = document.querySelector(".language-toggle");
const translatableElements = document.querySelectorAll("[data-en][data-ur]");

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
}

languageToggle.addEventListener("click", () => {
  const nextLanguage = document.documentElement.lang === "en" ? "ur" : "en";
  setLanguage(nextLanguage);
});
