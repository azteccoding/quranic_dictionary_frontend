import ColorTags from "./ColorTags";
import ExtraMeaning from "./ExtraMeaning";
import TextInstances from "./TextInstances";

const SearchResult = ({ arabSearch, queryResult: r }) => {
  const ArabicSearch = r?.arabic_sg && (
    <div>
      <h2 className="arabic-word-xxl">{r.arabic_sg} </h2>
      <p className="arabic-word-s">{r.translit_sg}</p>
      {r.arabic_pl.length > 0 && (
        <div>
          pl.
          {r.arabic_pl.map((item, index) => (
            <p
              key={item + "p"}
              className="arabic-word-xs"
              style={{ display: "inline", margin: "0.3rem" }}
            >
              {item} ({r.translit_pl[index]}),
            </p>
          ))}
        </div>
      )}
      <div className="arabic-word-xs" style={{ paddingTop: "1rem" }}>
        Traducción:{" "}
        {r.spanish.map((i) => (
          <p key={i + "p"} style={{ display: "inline", margin: "0.3rem" }}>
            {i},
          </p>
        ))}
      </div>
      <ExtraMeaning additionals={r.additionals} />
      <div style={{ margin: "1rem" }}></div>
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
      <p className="arabic-word-xs">
        Traducción: {r.arabic_sg} {r.translit_sg}
      </p>
      {r.arabic_pl.length > 0 && (
        <div>
          pl.{" "}
          {r.arabic_pl.map((w, i) => (
            <p
              key={i + "pls"}
              className="arabic-word-s"
              style={{ display: "inline-block", margin: "0.3rem" }}
            >
              {r.arabic_pl[i]} ({r.translit_pl[i]}),{" "}
            </p>
          ))}
        </div>
      )}
      <p style={{ fontSize: "0.8rem" }}>
        <a
          target="blank"
          href={`https://translate.google.com/?sl=ar&tl=en&text=${r.arabic_sg}&op=translate`}
        >
          Escuchar pronunciación
        </a>
      </p>
      <ExtraMeaning additionals={r.additionals} />
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
          adjetive: r.adjetive,
          adverb: r.adverb,
          noun: r.noun,
          form: r.form,
          synonim: r.synonim,
        }}
      />
      {arabSearch ? ArabicSearch : SpanishSearch}
      <TextInstances r={r} />
      {r.foreign && (
        <div>
          <h6>Etimología del vocablo</h6>
          <p>{r.etymology}</p>
        </div>
      )}
      <footer className="footer">
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
