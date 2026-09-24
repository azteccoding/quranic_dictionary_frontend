import { useState } from "react";
import { createWord } from "../services/requests";

const emptyConjugation = {
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

const initialFormState = {
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
  additionals: [],
  conjugation: emptyConjugation,
  participle: {
    active: { arabic: "", translit: "" },
    pasive: { arabic: "", translit: "" },
  },
};

const DynamicStringList = ({ label, items, onChange, placeholder, dir }) => {
  const updateItem = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };
  const addItem = () => onChange([...items, ""]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="form-row">
      <label>{label}</label>
      {items.map((item, index) => (
        <div className="dynamic-list-item" key={index}>
          <input
            type="text"
            className="form-control"
            dir={dir}
            placeholder={placeholder}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
          />
          <button
            type="button"
            className="btn-remove"
            title="Eliminar"
            onClick={() => removeItem(index)}
          >
            &times;
          </button>
        </div>
      ))}
      <button type="button" className="btn-add-item" onClick={addItem}>
        + Agregar
      </button>
    </div>
  );
};

const AdditionalsList = ({ items, onChange }) => {
  const updateField = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };
  const addItem = () =>
    onChange([...items, { arabic: "", meaning: "", translit: "" }]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="form-row">
      <label>Significados adicionales</label>
      {items.map((item, index) => (
        <div className="additional-entry" key={index}>
          <input
            type="text"
            className="form-control"
            dir="rtl"
            placeholder="Árabe"
            value={item.arabic}
            onChange={(e) => updateField(index, "arabic", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Transliteración"
            value={item.translit}
            onChange={(e) => updateField(index, "translit", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Significado"
            value={item.meaning}
            onChange={(e) => updateField(index, "meaning", e.target.value)}
          />
          <button
            type="button"
            className="btn-remove btn-remove-text"
            onClick={() => removeItem(index)}
          >
            &times; Quitar
          </button>
        </div>
      ))}
      <button type="button" className="btn-add-item" onClick={addItem}>
        + Agregar significado adicional
      </button>
    </div>
  );
};

const AddWord = () => {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setNestedField = (section, field, value) =>
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

  const setParticipleField = (voice, field, value) =>
    setForm((prev) => ({
      ...prev,
      participle: {
        ...prev.participle,
        [voice]: { ...prev.participle[voice], [field]: value },
      },
    }));

  const handleModeChange = (mode) => {
    setForm((prev) => ({ ...prev, mode }));
  };

  // Construye el documento completo con el mismo "esqueleto" siempre —
  // ningún campo queda undefined u omitido: booleans en false, strings en
  // "", arrays en []. Así, si la lambda o algún query en Mongo asume que el
  // campo existe (ej. wordData.hadith_appear.sentence), nunca truena por un
  // valor faltante. Los únicos campos que se omiten del todo son
  // "conjugation" y "participle" cuando NO es verbo, porque en tus propios
  // documentos de sustantivos esas llaves ni existen.
  function buildPayload() {
    const clean = (arr) => arr.map((s) => s.trim()).filter(Boolean);
    const str = (value) => (value || "").trim();

    const payload = {
      spanish: clean(form.spanish),
      english: str(form.english),
      arabic_sg: str(form.arabic_sg),
      arabic_pl: form.mode === "sustantivo" ? clean(form.arabic_pl) : [],
      translit_sg: str(form.translit_sg),
      translit_pl: form.mode === "sustantivo" ? clean(form.translit_pl) : [],
      root: clean(form.root),
      dipote: form.mode === "sustantivo" && !!form.dipote,
      foreign: !!form.foreign,
      pl_diptote: form.mode === "sustantivo" && !!form.pl_diptote,
      synonim: clean(form.synonim),
      antonym: str(form.antonym),
      noun: form.mode === "sustantivo" && form.wordClass === "noun",
      adjetive: form.mode === "sustantivo" && form.wordClass === "adjetive",
      adverb: form.mode === "sustantivo" && form.wordClass === "adverb",
      preposition:
        form.mode === "sustantivo" && form.wordClass === "preposition",
      verb: form.mode === "verbo",
      masculine: !!form.masculine,
      quranic_appear: {
        appearance: str(form.quranic_appear.appearance),
        sentence: str(form.quranic_appear.sentence),
        translation: str(form.quranic_appear.translation),
      },
      hadith_appear: {
        collection_code: str(form.hadith_appear.collection_code),
        collection_name: str(form.hadith_appear.collection_name),
        number: str(form.hadith_appear.number),
        links: clean(form.hadith_appear.links),
        sentence: str(form.hadith_appear.sentence),
        translation: str(form.hadith_appear.translation),
      },
      phrase: {
        arabic: str(form.phrase.arabic),
        meaning: str(form.phrase.meaning),
        translit: str(form.phrase.translit),
        link: str(form.phrase.link),
        reference: str(form.phrase.reference),
      },
      additionals: form.additionals
        .filter((item) => str(item.arabic))
        .map((item) => ({
          arabic: str(item.arabic),
          meaning: str(item.meaning),
          translit: str(item.translit),
        })),
    };

    if (form.mode === "verbo") {
      payload.conjugation = {
        root: str(form.conjugation.root),
        perfect3: str(form.conjugation.perfect3),
        perfect3_translit: str(form.conjugation.perfect3_translit),
        perfect1: str(form.conjugation.perfect1),
        perfect1_translit: str(form.conjugation.perfect1_translit),
        imperfect_vowel: str(form.conjugation.imperfect_vowel),
        masdar: str(form.conjugation.masdar),
        masdar_translit: str(form.conjugation.masdar_translit),
        masdar_meaning: str(form.conjugation.masdar_meaning),
        form: str(form.conjugation.form) || "I",
        irregular: !!form.conjugation.irregular,
      };

      payload.participle = {
        active: {
          arabic: str(form.participle.active.arabic),
          translit: str(form.participle.active.translit),
        },
        pasive: {
          arabic: str(form.participle.pasive.arabic),
          translit: str(form.participle.pasive.translit),
        },
      };
    }

    return payload;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.arabic_sg.trim() || !form.spanish.some((s) => s.trim())) {
      setStatus({
        state: "error",
        message:
          "Al menos la palabra en árabe y una traducción al español son obligatorias.",
      });
      return;
    }

    setStatus({ state: "loading", message: "" });

    const payload = buildPayload();
    const { hasExternalError, errorMessage } = await createWord(payload);

    if (hasExternalError) {
      console.log("========ERROR CREATING WORD========");
      console.log(errorMessage);
      console.log("====================================");
      setStatus({
        state: "error",
        message: "No se pudo guardar la palabra. Intenta de nuevo.",
      });
      return;
    }

    setStatus({ state: "success", message: "Palabra guardada correctamente." });
    setForm(initialFormState);
  }

  return (
    <div className="add-word-page">
      <h1>Agregar palabra</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <p className="form-section-title">Categoría gramatical</p>

          <div
            className="btn-group btn-group-toggle language-toggle grammar-mode-toggle"
            data-toggle="buttons"
          >
            <label
              className={`btn btn-secondary ${form.mode === "sustantivo" && "active"}`}
            >
              <input
                type="radio"
                name="grammar-mode"
                checked={form.mode === "sustantivo"}
                onChange={() => handleModeChange("sustantivo")}
              />{" "}
              Sustantivo / Adjetivo
            </label>
            <label
              className={`btn btn-secondary ${form.mode === "verbo" && "active"}`}
            >
              <input
                type="radio"
                name="grammar-mode"
                checked={form.mode === "verbo"}
                onChange={() => handleModeChange("verbo")}
              />{" "}
              Verbo
            </label>
          </div>

          {form.mode === "sustantivo" && (
            <>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="word-class"
                  checked={form.wordClass === "noun"}
                  onChange={() => setField("wordClass", "noun")}
                />
                Sustantivo
              </label>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="word-class"
                  checked={form.wordClass === "adjetive"}
                  onChange={() => setField("wordClass", "adjetive")}
                />
                Adjetivo
              </label>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="word-class"
                  checked={form.wordClass === "adverb"}
                  onChange={() => setField("wordClass", "adverb")}
                />
                Adverbio
              </label>
              <label className="checkbox-row">
                <input
                  type="radio"
                  name="word-class"
                  checked={form.wordClass === "preposition"}
                  onChange={() => setField("wordClass", "preposition")}
                />
                Preposición
              </label>

              <div
                className="btn-group btn-group-toggle language-toggle"
                data-toggle="buttons"
                style={{ marginTop: "1rem" }}
              >
                <label
                  className={`btn btn-secondary ${form.masculine && "active"}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={form.masculine}
                    onChange={() => setField("masculine", true)}
                  />{" "}
                  Masculino
                </label>
                <label
                  className={`btn btn-secondary ${!form.masculine && "active"}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    checked={!form.masculine}
                    onChange={() => setField("masculine", false)}
                  />{" "}
                  Femenino
                </label>
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <p className="form-section-title">Palabra</p>

          <div className="form-row">
            <label htmlFor="arabic_sg">Árabe (singular)</label>
            <input
              id="arabic_sg"
              type="text"
              dir="rtl"
              className="form-control"
              value={form.arabic_sg}
              onChange={(e) => setField("arabic_sg", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="translit_sg">Transliteración (singular)</label>
            <input
              id="translit_sg"
              type="text"
              className="form-control"
              value={form.translit_sg}
              onChange={(e) => setField("translit_sg", e.target.value)}
            />
          </div>

          {form.mode === "sustantivo" && (
            <>
              <DynamicStringList
                label="Árabe (plural)"
                items={form.arabic_pl}
                onChange={(items) => setField("arabic_pl", items)}
                dir="rtl"
                placeholder="كُتُب"
              />

              <DynamicStringList
                label="Transliteración (plural)"
                items={form.translit_pl}
                onChange={(items) => setField("translit_pl", items)}
                placeholder="kutub"
              />
            </>
          )}

          <DynamicStringList
            label="Traducciones al español"
            items={form.spanish}
            onChange={(items) => setField("spanish", items)}
            placeholder="libro"
          />

          <div className="form-row">
            <label htmlFor="english">Inglés</label>
            <input
              id="english"
              type="text"
              className="form-control"
              value={form.english}
              onChange={(e) => setField("english", e.target.value)}
            />
          </div>

          <DynamicStringList
            label="Raíz (letras)"
            items={form.root}
            onChange={(items) => setField("root", items)}
            dir="rtl"
            placeholder="ك"
          />

          <DynamicStringList
            label="Sinónimos"
            items={form.synonim}
            onChange={(items) => setField("synonim", items)}
            dir="rtl"
            placeholder="مصحف"
          />

          <div className="form-row">
            <label htmlFor="antonym">Antónimo</label>
            <input
              id="antonym"
              type="text"
              dir="rtl"
              className="form-control"
              value={form.antonym}
              onChange={(e) => setField("antonym", e.target.value)}
            />
          </div>

          {form.mode === "sustantivo" && (
            <>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.dipote}
                  onChange={(e) => setField("dipote", e.target.checked)}
                />
                Dipote
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.pl_diptote}
                  onChange={(e) => setField("pl_diptote", e.target.checked)}
                />
                Plural diptote
              </label>
            </>
          )}
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.foreign}
              onChange={(e) => setField("foreign", e.target.checked)}
            />
            Extranjerismo
          </label>
        </div>

        {form.mode === "verbo" && (
          <div className="form-section">
            <p className="form-section-title">Conjugación</p>

            <div className="form-row">
              <label htmlFor="conj_root">Raíz</label>
              <input
                id="conj_root"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.conjugation.root}
                onChange={(e) =>
                  setNestedField("conjugation", "root", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="perfect3">Perfectivo (3ra persona)</label>
              <input
                id="perfect3"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.conjugation.perfect3}
                onChange={(e) =>
                  setNestedField("conjugation", "perfect3", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="perfect3_translit">
                Transliteración perfectivo
              </label>
              <input
                id="perfect3_translit"
                type="text"
                className="form-control"
                value={form.conjugation.perfect3_translit}
                onChange={(e) =>
                  setNestedField(
                    "conjugation",
                    "perfect3_translit",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="perfect1">
                Perfectivo (1ra sing., si es irregular)
              </label>
              <input
                id="perfect1"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.conjugation.perfect1}
                onChange={(e) =>
                  setNestedField("conjugation", "perfect1", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="perfect1_translit">
                Transliteración perfectivo 1ra sing.
              </label>
              <input
                id="perfect1_translit"
                type="text"
                className="form-control"
                value={form.conjugation.perfect1_translit}
                onChange={(e) =>
                  setNestedField(
                    "conjugation",
                    "perfect1_translit",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="imperfect_vowel">Vocal de imperfectivo</label>
              <input
                id="imperfect_vowel"
                type="text"
                className="form-control"
                value={form.conjugation.imperfect_vowel}
                onChange={(e) =>
                  setNestedField(
                    "conjugation",
                    "imperfect_vowel",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="masdar">Sustantivo verbal (masdar)</label>
              <input
                id="masdar"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.conjugation.masdar}
                onChange={(e) =>
                  setNestedField("conjugation", "masdar", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="masdar_translit">
                Transliteración del masdar
              </label>
              <input
                id="masdar_translit"
                type="text"
                className="form-control"
                value={form.conjugation.masdar_translit}
                onChange={(e) =>
                  setNestedField(
                    "conjugation",
                    "masdar_translit",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="masdar_meaning">Significado del masdar</label>
              <input
                id="masdar_meaning"
                type="text"
                className="form-control"
                value={form.conjugation.masdar_meaning}
                onChange={(e) =>
                  setNestedField(
                    "conjugation",
                    "masdar_meaning",
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="conj_form">Forma (I, II, III…)</label>
              <input
                id="conj_form"
                type="text"
                className="form-control"
                value={form.conjugation.form}
                onChange={(e) =>
                  setNestedField("conjugation", "form", e.target.value)
                }
              />
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.conjugation.irregular}
                onChange={(e) =>
                  setNestedField("conjugation", "irregular", e.target.checked)
                }
              />
              Verbo irregular
            </label>

            <p className="form-section-title" style={{ marginTop: "1.5rem" }}>
              Participios
            </p>

            <div className="form-row">
              <label htmlFor="participle_active_arabic">Activo (árabe)</label>
              <input
                id="participle_active_arabic"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.participle.active.arabic}
                onChange={(e) =>
                  setParticipleField("active", "arabic", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="participle_active_translit">
                Activo (transliteración)
              </label>
              <input
                id="participle_active_translit"
                type="text"
                className="form-control"
                value={form.participle.active.translit}
                onChange={(e) =>
                  setParticipleField("active", "translit", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="participle_pasive_arabic">Pasivo (árabe)</label>
              <input
                id="participle_pasive_arabic"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.participle.pasive.arabic}
                onChange={(e) =>
                  setParticipleField("pasive", "arabic", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="participle_pasive_translit">
                Pasivo (transliteración)
              </label>
              <input
                id="participle_pasive_translit"
                type="text"
                className="form-control"
                value={form.participle.pasive.translit}
                onChange={(e) =>
                  setParticipleField("pasive", "translit", e.target.value)
                }
              />
            </div>
          </div>
        )}

        <div className="form-section">
          <p className="form-section-title">Aparición coránica (opcional)</p>

          <div className="form-row">
            <label htmlFor="quranic_appearance">Referencia (ej. 12:53)</label>
            <input
              id="quranic_appearance"
              type="text"
              className="form-control"
              value={form.quranic_appear.appearance}
              onChange={(e) =>
                setNestedField("quranic_appear", "appearance", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="quranic_sentence">Versículo en árabe</label>
            <input
              id="quranic_sentence"
              type="text"
              dir="rtl"
              className="form-control"
              value={form.quranic_appear.sentence}
              onChange={(e) =>
                setNestedField("quranic_appear", "sentence", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="quranic_translation">Traducción</label>
            <input
              id="quranic_translation"
              type="text"
              className="form-control"
              value={form.quranic_appear.translation}
              onChange={(e) =>
                setNestedField("quranic_appear", "translation", e.target.value)
              }
            />
          </div>
        </div>

        <div className="form-section">
          <p className="form-section-title">Aparición en la Sunna (opcional)</p>

          <div className="form-row">
            <label htmlFor="hadith_collection">
              {"Código de colección abreviado (ej. b -> bukhari)"}
            </label>
            <input
              id="hadith_collection"
              type="text"
              className="form-control"
              value={form.hadith_appear.collection_name}
              onChange={(e) =>
                setNestedField(
                  "hadith_appear",
                  "collection_code",
                  e.target.value,
                )
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="hadith_collection_name">
              Nombre completo de la colección
            </label>
            <input
              id="hadith_collection_name"
              type="text"
              className="form-control"
              value={form.hadith_appear.collection_name}
              onChange={(e) =>
                setNestedField(
                  "hadith_appear",
                  "collection_name",
                  e.target.value,
                )
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="hadith_number">Número</label>
            <input
              id="hadith_number"
              type="text"
              className="form-control"
              value={form.hadith_appear.number}
              onChange={(e) =>
                setNestedField("hadith_appear", "number", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="hadith_sentence">Texto en árabe</label>
            <input
              id="hadith_sentence"
              type="text"
              dir="rtl"
              className="form-control"
              value={form.hadith_appear.sentence}
              onChange={(e) =>
                setNestedField("hadith_appear", "sentence", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="hadith_translation">Traducción</label>
            <input
              id="hadith_translation"
              type="text"
              className="form-control"
              value={form.hadith_appear.translation}
              onChange={(e) =>
                setNestedField("hadith_appear", "translation", e.target.value)
              }
            />
          </div>

          <DynamicStringList
            label="Enlaces de referencia"
            items={form.hadith_appear.links}
            onChange={(items) =>
              setNestedField("hadith_appear", "links", items)
            }
            placeholder="https://sunnah.com/..."
          />
        </div>

        <div className="form-section">
          <p className="form-section-title">Frase de ejemplo (opcional)</p>

          <div className="form-row">
            <label htmlFor="phrase_arabic">Árabe</label>
            <input
              id="phrase_arabic"
              type="text"
              dir="rtl"
              className="form-control"
              value={form.phrase.arabic}
              onChange={(e) =>
                setNestedField("phrase", "arabic", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="phrase_translit">Transliteración</label>
            <input
              id="phrase_translit"
              type="text"
              className="form-control"
              value={form.phrase.translit}
              onChange={(e) =>
                setNestedField("phrase", "translit", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="phrase_meaning">Significado</label>
            <input
              id="phrase_meaning"
              type="text"
              className="form-control"
              value={form.phrase.meaning}
              onChange={(e) =>
                setNestedField("phrase", "meaning", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="phrase_reference">
              Referencia (ej. Sunan Abi Dawud 5071)
            </label>
            <input
              id="phrase_reference"
              type="text"
              className="form-control"
              value={form.phrase.reference}
              onChange={(e) =>
                setNestedField("phrase", "reference", e.target.value)
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="phrase_link">Enlace</label>
            <input
              id="phrase_link"
              type="text"
              className="form-control"
              value={form.phrase.link}
              onChange={(e) => setNestedField("phrase", "link", e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <p className="form-section-title">
            Significados adicionales (opcional)
          </p>
          <AdditionalsList
            items={form.additionals}
            onChange={(items) => setField("additionals", items)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={status.state === "loading"}
        >
          {status.state === "loading" ? "Guardando..." : "Guardar palabra"}
        </button>

        {status.state === "success" && (
          <p className="submit-feedback success">{status.message}</p>
        )}
        {status.state === "error" && (
          <p className="submit-feedback error">{status.message}</p>
        )}
      </form>
    </div>
  );
};

export default AddWord;
