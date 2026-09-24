export const emptyConjugation = {
  root: "",
  perfect3: "",
  perfect3_translit: "",
  perfect1: "",
  perfect1_translit: "",
  imperfect_vowel: "",
  masdar: "",
  masdar_translit: "",
  masdar_meaning: "",
  form: "I",
  irregular: false,
};

export const initialFormState = {
  mode: "sustantivo", // "sustantivo" | "verbo" — solo controla la UI
  spanish: [""],
  english: "",
  arabic_sg: "",
  arabic_pl: [""],
  translit_sg: "",
  translit_pl: [""],
  root: ["", "", ""],
  masculine: true,
  dipote: false,
  pl_diptote: false,
  foreign: false,
  synonim: [""],
  antonym: "",
  wordClass: "noun", // "noun" | "adjetive" | "adverb" | "preposition" — mutuamente excluyentes
  quranic_appear: { appearance: "", sentence: "", translation: "" },
  hadith_appear: {
    collection_code: "",
    collection_name: "",
    number: "",
    links: [""],
    sentence: "",
    translation: "",
  },
  phrase: { arabic: "", meaning: "", translit: "", link: "", reference: "" },
  isTechnicalTerm: false,
  term: { meaning: "", reference: "", link: "" },
  additionals: [],
  conjugation: emptyConjugation,
  participle: {
    active: { arabic: "", translit: "" },
    pasive: { arabic: "", translit: "" },
  },
};
