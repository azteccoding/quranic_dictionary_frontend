export const ES2AR_API_URI =
  "https://quranicarabicspanishdictionary.netlify.app/.netlify/functions/spanish?word=";
export const AR2ES_API_URI =
  "https://quranicarabicspanishdictionary.netlify.app/.netlify/functions/arabic?word=";

export const ES2AR_API_URI_LOCAL =
  "http://localhost:9999/.netlify/functions/spanish?word=";
export const AR2ES_API_URI_LOCAL =
  "http://localhost:9999/.netlify/functions/arabic?word=";

// Alta de palabras (lambda aún por crear — ver create-word.js pendiente)
export const CREATE_WORD_API_URI =
  "https://quranicarabicspanishdictionary.netlify.app/.netlify/functions/create_word";
export const CREATE_WORD_API_URI_LOCAL =
  "http://localhost:9999/.netlify/functions/create_word";

// Hadith collections

export const hadithCollectionCode = {
  b: { name: "Sahih al-Bukhari", shortName: "bukhari" },
  t: { name: "Jami` at-Tirmidhi", shortName: "tirmidhi" },
  m: { name: "Sahih Muslim", shortName: "muslim" },
  d: { name: "Sunan Abi Dawud", shortName: "abudawud" },
  n: { name: "Sunan an-Nasa'i", shortName: "nasai" },
  k: { name: "Mishkat al-Masabih", shortName: "mishkat" },
  g: { name: "Bulugh al-Maram", shortName: "bulugh" },
  j: { name: "Sunan Ibn Majah", shortName: "ibnmajah" },
};

// Page titles
export const ARAB_2_SPANISH_TITLE = "Árabe coránico-Español";
export const SPANISH_2_ARAB_TITLE = "Español-Árabe coránico";

// Notes
export const SIGNATURE = "Investigación y programación por Khalid Jorge Montes";
