import ColorTags from "./ColorTags";

const SearchResult = ({ arabSearch, queryResult: r }) => {
  const ArabicSearch = r?.arabic_sg && (
    <div>
      <h2>{r.arabic_sg} </h2>
      <p>{r.translit_sg}</p>
      <div>
        pl.
        {r.arabic_pl.map((item, index) => (
          <p key={item + "p"} style={{ display: "inline", margin: "0.3rem" }}>
            {item} ({r.translit_pl[index]}),
          </p>
        ))}
      </div>
      <div>
        Traducción:{" "}
        {r.spanish.map((i) => (
          <p key={i + "p"} style={{ display: "inline", margin: "0.3rem" }}>
            {i},
          </p>
        ))}
      </div>
      <div style={{ margin: "1rem" }}></div>

      <div>
        {r.quranic_appear?.appearance && (
          <h4>En el Corán aparece en {r.quranic_appear?.appearance}</h4>
        )}
        <p>{r.quranic_appear.sentence}</p>
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

      <div>
        {r.hadith_appear?.collection_name && (
          <h4>En la Sunna aparece en {r.hadith_appear?.collection_name}</h4>
        )}
        <p>{r.hadith_appear.sentence}</p>
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

      <div>
        {r.phrase?.arabic && <h4>Ejemplos de uso</h4>}
        <p>{r.phrase.arabic}</p>
        <p>{r.phrase.translit}</p>
        <p>{r.phrase.meaning}</p>
        <p style={{ fontSize: "0.8rem" }}>
          <a
            target="blank"
            href={`https://translate.google.com/?sl=ar&tl=en&text=${r.phrase.arabic}&op=translate`}
          >
            Escuchar pronunciación
          </a>
        </p>
      </div>
    </div>
  );

  const SpanishSearch = r?.arabic_sg && (
    <div>
      <h2>
        {r.spanish.map((w, i) => (
          <p
            key={i + "pls"}
            style={{ display: "inline-block", margin: "0.3rem" }}
          >
            {w} {","}
          </p>
        ))}
      </h2>
      <p>
        Traducción: {r.arabic_sg} {r.translit_sg}
      </p>
      <div>
        pl.{" "}
        {r.arabic_pl.map((w, i) => (
          <p
            key={i + "pls"}
            style={{ display: "inline-block", margin: "0.3rem" }}
          >
            {r.arabic_pl[i]} ({r.translit_pl[i]}),{" "}
          </p>
        ))}
      </div>
      <p style={{ fontSize: "0.8rem" }}>
        <a
          target="blank"
          href={`https://translate.google.com/?sl=ar&tl=en&text=${r.arabic_sg}&op=translate`}
        >
          Escuchar pronunciación
        </a>
      </p>
    </div>
  );

  return (
    <>
      <ColorTags
        tags={{
          masculine: r.masculine,
          dipote: r.dipote,
          pl_diptote: r.pl_diptote,
          foreign: r.foreign,
          verb: r.verb,
          noun: r.noun,
          form: r.form,
          synonim: r.synonim,
          control: r.control,
        }}
      />
      {arabSearch ? ArabicSearch : SpanishSearch}
      <footer>
        <p style={{ fontSize: "0.5rem" }}>Fuentes:</p>
        <p style={{ fontSize: "0.5rem" }}>
          Badawi, E. M., & Abdel Haleem, M. (2008). Arabic-English dictionary of
          Qur'anic usage. Brill.
        </p>
        <p style={{ fontSize: "0.5rem" }}>
          Corriente Córdoba, F. (2005). Diccionario árabe-español: Texto,
          gramática y cultura (1.ª ed.). Herder.
        </p>
        <p style={{ fontSize: "0.5rem" }}>
          Hans Wehr & J. Milton Cowan (2020). A Dictionary of Modern Written
          Arabic (4ª ed.). BN Publishing
        </p>
      </footer>
    </>
  );
};

export default SearchResult;
