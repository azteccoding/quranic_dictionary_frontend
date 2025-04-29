const SacredTextInstances = ({ r }) => {
  return (
    <>
      {r.quranic_appear?.appearance && (
        <div>
          <h4>En el Corán aparece en {r.quranic_appear?.appearance}</h4>

          <p className="arabic-word-s">{r.quranic_appear.sentence}</p>
          <p>"{r.quranic_appear.translation}"</p>
          <p style={{ fontSize: "0.8rem" }}>
            <a
              target="blank"
              href={`https://quran.com/${r.quranic_appear?.appearance}?translations=28%2C199`}
            >
              Leer en el Corán
            </a>
          </p>
        </div>
      )}

      {r.hadith_appear?.collection_name && (
        <div>
          <h4>En la Sunna aparece en {r.hadith_appear?.collection_name}</h4>

          <p className="arabic-word-s">{r.hadith_appear.sentence}</p>
          <p>"{r.hadith_appear.translation}"</p>
          <p style={{ fontSize: "0.7rem" }}>
            Fuente:{" "}
            <a
              target="blank"
              href={`https://sunnah.com/${r.hadith_appear.collection}:${r.hadith_appear.number}`}
            >
              {r.hadith_appear.collection_name} {r.hadith_appear.number}
            </a>
          </p>
        </div>
      )}

      {r.phrase?.arabic && (
        <div>
          <h4>Ejemplos de uso</h4>
          <p className="arabic-word-s">{r.phrase.arabic}</p>
          <p>{r.phrase.translit}</p>
          <p>{r.phrase.meaning}</p>
          {r.phrase?.reference ? (
            <p style={{ fontSize: "0.7rem" }}>Fuente: {r.phrase.reference}</p>
          ) : (
            ""
          )}
          <p style={{ fontSize: "0.8rem" }}>
            <a
              target="blank"
              href={`https://translate.google.com/?sl=ar&tl=en&text=${r.phrase.arabic}&op=translate`}
            >
              Escuchar pronunciación
            </a>
          </p>
        </div>
      )}
    </>
  );
};

export default SacredTextInstances;
