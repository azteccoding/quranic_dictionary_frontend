import "../styles/WordMarks.css";

// ----- Helpers (tolerantes a datos incompletos o viejos) -----

// Formato nuevo: pl_diptote = [false, true, ...] (paralelo a arabic_pl).
// El formato viejo (booleano) lo sigue mostrando ColorTags como etiqueta general,
// así que aquí solo se marca cuando es arreglo, para no duplicar.
export const isPluralDiptote = (plDiptote, index) =>
  Array.isArray(plDiptote) && !!plDiptote[index];

// Convierte índices de acepciones ([1, 3]) en su texto ("hoja, página").
// Vacío o ausente = aplica a todas las acepciones -> null (no se muestra nada).
export const sensesText = (senses, spanish = []) => {
  if (!Array.isArray(senses) || senses.length === 0) return null;
  const textos = senses
    .filter((i) => Number.isInteger(i) && i >= 0 && spanish[i])
    .map((i) => spanish[i]);
  return textos.length ? textos.join(", ") : null;
};

// ----- Marcas discretas -----

export const DiptoteMark = ({ show }) =>
  show ? (
    <span className="word-mark" title="Plural diptote">
      dipt.
    </span>
  ) : null;

export const SenseNote = ({ senses, spanish }) => {
  const texto = sensesText(senses, spanish);
  return texto ? (
    <span className="word-mark word-mark--sense">
      (en el sentido de: {texto})
    </span>
  ) : null;
};
