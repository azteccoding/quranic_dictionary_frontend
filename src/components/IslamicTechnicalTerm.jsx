import "../styles/IslamicTechnicalTerm.css";

// Solo acepta enlaces http/https (evita "javascript:" u otros esquemas raros en el JSON)
const esLinkValido = (url) => {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const IslamicTechnicalTerm = ({ isTechnicalTerm, term }) => {
  if (!isTechnicalTerm || !term || typeof term !== "object") return null;

  const { meaning, reference, link } = term;
  const tieneLink = typeof link === "string" && esLinkValido(link);

  // Si no hay nada que mostrar, no se pinta
  if (!meaning && !reference && !tieneLink) return null;

  return (
    <aside className="islamic-term" aria-label="Término técnico islámico">
      <span className="islamic-term__etiqueta">
        <span className="islamic-term__icono" aria-hidden="true">
          ۞
        </span>
        Término técnico islámico
      </span>

      {meaning && <p className="islamic-term__significado">{meaning}</p>}

      {(reference || tieneLink) && (
        <p className="islamic-term__fuente">
          Fuente:{" "}
          {tieneLink ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {reference || "Ver referencia"}
            </a>
          ) : (
            <cite>{reference}</cite>
          )}
        </p>
      )}
    </aside>
  );
};

export default IslamicTechnicalTerm;
