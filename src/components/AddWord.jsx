import { useState } from "react";
import { createWord } from "../services/requests";
import { initialFormState, emptyPlural } from "../model/interfaces";
import "../styles/WordMarks.css";

const DynamicStringList = ({
  label,
  items,
  onChange,
  placeholder,
  dir,
  onRemove,
}) => {
  const updateItem = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };
  const addItem = () => onChange([...items, ""]);
  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
    onRemove?.(index); // avisa qué posición se borró (para reajustar acepciones)
  };

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

// Casillas para elegir a qué acepciones (traducciones) aplica un plural o masdar.
// Sin ninguna marcada = aplica a todas. Solo aparece si hay 2+ traducciones escritas.
const SenseSelector = ({ label, spanish, selected = [], onChange }) => {
  const options = spanish
    .map((texto, i) => ({ texto: texto.trim(), i }))
    .filter((o) => o.texto);

  if (options.length < 2) return null;

  const toggle = (i) =>
    onChange(
      selected.includes(i)
        ? selected.filter((x) => x !== i)
        : [...selected, i].sort((a, b) => a - b),
    );

  return (
    <div className="sense-selector">
      <span className="sense-selector__label">{label}</span>
      {options.map((o) => (
        <label key={o.i} className="sense-selector__option">
          <input
            type="checkbox"
            checked={selected.includes(o.i)}
            onChange={() => toggle(o.i)}
          />{" "}
          {o.texto}
        </label>
      ))}
      <span className="sense-selector__hint">(sin marcar = todas)</span>
    </div>
  );
};

// Cada plural en su propio renglón: árabe, transliteración, diptote y acepciones
const PluralsList = ({ items, spanish, onChange }) => {
  const updateField = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };
  const addItem = () => onChange([...items, { ...emptyPlural, senses: [] }]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="form-row">
      <label>Plurales</label>
      {items.map((item, index) => (
        <div className="plural-entry" key={index}>
          <div className="dynamic-list-item">
            <input
              type="text"
              className="form-control"
              dir="rtl"
              placeholder="كُتُب"
              value={item.arabic}
              onChange={(e) => updateField(index, "arabic", e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="kutub"
              value={item.translit}
              onChange={(e) => updateField(index, "translit", e.target.value)}
            />
            <button
              type="button"
              className="btn-remove"
              title="Eliminar plural"
              onClick={() => removeItem(index)}
            >
              &times;
            </button>
          </div>

          <label className="checkbox-row plural-entry__diptote">
            <input
              type="checkbox"
              checked={item.diptote}
              onChange={(e) => updateField(index, "diptote", e.target.checked)}
            />
            Diptote
          </label>

          <SenseSelector
            label="Aplica solo a:"
            spanish={spanish}
            selected={item.senses}
            onChange={(senses) => updateField(index, "senses", senses)}
          />
        </div>
      ))}
      <button type="button" className="btn-add-item" onClick={addItem}>
        + Agregar plural
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

  // Palabra cuatrilítera (verbo o sustantivo): la raíz pasa a tener 4 casillas (y regresa a 3 si
  // se desmarca, solo si la cuarta quedó vacía)
  const handleCuadriliteralChange = (checked) =>
    setForm((prev) => {
      let root = [...prev.root];
      if (checked) while (root.length < 4) root.push("");
      else if (root.length === 4 && !root[3].trim()) root = root.slice(0, 3);
      return { ...prev, isCuadriliteral: checked, root };
    });

  // Si se borra una traducción, los índices de acepciones posteriores se recorren
  // para que cada plural/masdar siga apuntando a la misma traducción
  const handleSpanishRemoved = (removed) => {
    const remap = (arr = []) =>
      arr.filter((i) => i !== removed).map((i) => (i > removed ? i - 1 : i));
    setForm((prev) => ({
      ...prev,
      plurals: prev.plurals.map((p) => ({ ...p, senses: remap(p.senses) })),
      conjugation: {
        ...prev.conjugation,
        masdar_senses: remap(prev.conjugation.masdar_senses),
      },
    }));
  };

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

    // "spanish" se guarda sin traducciones vacías, así que los índices del
    // formulario se traducen a los índices finales. Si se marcaron todas las
    // acepciones, se guarda [] (= aplica a todas).
    const senseMap = {};
    let finalIndex = 0;
    form.spanish.forEach((s, i) => {
      if (s.trim()) senseMap[i] = finalIndex++;
    });
    const mapSenses = (arr = []) => {
      const mapped = [
        ...new Set(arr.filter((i) => i in senseMap).map((i) => senseMap[i])),
      ].sort((a, b) => a - b);
      return mapped.length === finalIndex ? [] : mapped;
    };

    // Plurales: arreglos paralelos (arabic_pl, translit_pl, pl_diptote, pl_senses)
    const plurals =
      form.mode === "sustantivo"
        ? form.plurals.filter((p) => str(p.arabic))
        : [];

    const payload = {
      spanish: clean(form.spanish),
      english: str(form.english),
      arabic_sg: str(form.arabic_sg),
      arabic_pl: plurals.map((p) => str(p.arabic)),
      translit_sg: str(form.translit_sg),
      translit_pl: plurals.map((p) => str(p.translit)),
      root: clean(form.root),
      dipote: form.mode === "sustantivo" && !!form.dipote,
      foreign: !!form.foreign,
      pl_diptote: plurals.map((p) => !!p.diptote),
      pl_senses: plurals.map((p) => mapSenses(p.senses)),
      isCollectiveNoun: form.mode === "sustantivo" && !!form.isCollectiveNoun,
      indefNoun:
        form.mode === "sustantivo" && form.isCollectiveNoun
          ? str(form.indefNoun)
          : "",
      definite_sg: form.mode === "sustantivo" ? str(form.definite_sg) : "",
      definite_translit: form.mode === "sustantivo" ? str(form.definite_translit) : "",
      synonim: clean(form.synonim),
      antonym: str(form.antonym),
      noun: form.mode === "sustantivo" && form.wordClass === "noun",
      adjetive: form.mode === "sustantivo" && form.wordClass === "adjetive",
      adverb: form.mode === "sustantivo" && form.wordClass === "adverb",
      preposition:
        form.mode === "sustantivo" && form.wordClass === "preposition",
      verb: form.mode === "verbo",
      isCuadriliteral: !!form.isCuadriliteral,
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
      // Si el checkbox está desmarcado, "term" se manda vacío (esqueleto
      // completo), aunque en el estado se conserve lo que se haya escrito.
      isTechnicalTerm: !!form.isTechnicalTerm,
      term: {
        meaning: form.isTechnicalTerm ? str(form.term.meaning) : "",
        reference: form.isTechnicalTerm ? str(form.term.reference) : "",
        link: form.isTechnicalTerm ? str(form.term.link) : "",
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
        masdar_senses: mapSenses(form.conjugation.masdar_senses),
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

    if (form.isTechnicalTerm && !form.term.meaning.trim()) {
      setStatus({
        state: "error",
        message:
          "Si la palabra es un término técnico islámico, su significado técnico es obligatorio.",
      });
      return;
    }

    if (
      form.mode === "verbo" &&
      form.isCuadriliteral &&
      !["I", "II", "III", "IV"].includes(
        (form.conjugation.form || "I").trim().toUpperCase(),
      )
    ) {
      setStatus({
        state: "error",
        message: "Los verbos cuatrilíteros solo tienen formas I a IV.",
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
            <div className="form-row">
              <label htmlFor="definite_sg">
                Forma con artículo (solo si cambia, ej. المرأة)
              </label>
              <input
                id="definite_sg"
                type="text"
                dir="rtl"
                className="form-control"
                value={form.definite_sg}
                onChange={(e) => setField("definite_sg", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label htmlFor="definite_translit">
                Transliteración de la forma con artículo
              </label>
              <input
                id="definite_translit"
                type="text"
                className="form-control"
                placeholder="al-marʾa"
                value={form.definite_translit}
                onChange={(e) => setField("definite_translit", e.target.value)}
              />
            </div>
            </>
          )}

          {form.mode === "sustantivo" && (
            <>
              <PluralsList
                items={form.plurals}
                spanish={form.spanish}
                onChange={(items) => setField("plurals", items)}
              />
            </>
          )}

          <DynamicStringList
            label="Traducciones al español"
            items={form.spanish}
            onChange={(items) => setField("spanish", items)}
            onRemove={handleSpanishRemoved}
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

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isCuadriliteral}
              onChange={(e) => handleCuadriliteralChange(e.target.checked)}
            />
            Cuatrilítero (raíz de 4 letras)
          </label>

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
                  checked={form.isCollectiveNoun}
                  onChange={(e) =>
                    setField("isCollectiveNoun", e.target.checked)
                  }
                />
                Nombre colectivo
              </label>
              {form.isCollectiveNoun && (
                <div className="form-row">
                  <label htmlFor="indefNoun">
                    Nombre de unidad (ej. شعرة, o جمل para إبل)
                  </label>
                  <input
                    id="indefNoun"
                    type="text"
                    dir="rtl"
                    className="form-control"
                    value={form.indefNoun}
                    onChange={(e) => setField("indefNoun", e.target.value)}
                  />
                </div>
              )}
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

        <div className="form-section">
          <p className="form-section-title">Término técnico islámico</p>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.isTechnicalTerm}
              onChange={(e) => setField("isTechnicalTerm", e.target.checked)}
            />
            Esta palabra es un término técnico islámico
          </label>

          {form.isTechnicalTerm && (
            <>
              <div className="form-row">
                <label htmlFor="term_meaning">Significado técnico</label>
                <input
                  id="term_meaning"
                  type="text"
                  className="form-control"
                  placeholder="Ablución ritual"
                  value={form.term.meaning}
                  onChange={(e) =>
                    setNestedField("term", "meaning", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="term_reference">
                  Referencia (obra o fuente)
                </label>
                <input
                  id="term_reference"
                  type="text"
                  className="form-control"
                  placeholder="Diccionario de términos islámicos"
                  value={form.term.reference}
                  onChange={(e) =>
                    setNestedField("term", "reference", e.target.value)
                  }
                />
              </div>

              <div className="form-row">
                <label htmlFor="term_link">Enlace (opcional)</label>
                <input
                  id="term_link"
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={form.term.link}
                  onChange={(e) =>
                    setNestedField("term", "link", e.target.value)
                  }
                />
              </div>
            </>
          )}
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
              <SenseSelector
                label="El masdar aplica solo a:"
                spanish={form.spanish}
                selected={form.conjugation.masdar_senses}
                onChange={(senses) =>
                  setNestedField("conjugation", "masdar_senses", senses)
                }
              />
            </div>

            <div className="form-row">
              <label htmlFor="conj_form">
                {form.isCuadriliteral
                  ? "Forma (I–IV)"
                  : "Forma (I, II, III…)"}
              </label>
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
              value={form.hadith_appear.collection_code}
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
