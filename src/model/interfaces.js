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
  masdar_senses: [], // índices de "spanish" a los que aplica el masdar; [] = todas
  form: "I",
  irregular: false,
};

// Un plural con sus propiedades: si es diptote y a qué acepciones aplica
export const emptyPlural = {
  arabic: "",
  translit: "",
  diptote: false,
  senses: [], // índices de "spanish"; [] = aplica a todas
};

export const initialFormState = {
  mode: "sustantivo", // "sustantivo" | "verbo" — solo controla la UI
  spanish: [""],
  english: "",
  arabic_sg: "",
  translit_sg: "",
  plurals: [emptyPlural], // se convierte en arabic_pl / translit_pl / pl_diptote / pl_senses al guardar
  root: ["", "", ""],
  masculine: true,
  dipote: false,
  foreign: false,
  isCollectiveNoun: false,
  isCuadriliteral: false,
  indefNoun: "",
  definite_sg: "",
  definite_translit: "",
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
