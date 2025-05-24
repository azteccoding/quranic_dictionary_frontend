import ColorTags from "./ColorTags";
import ExtraMeaning from "./ExtraMeaning";
import SacredTextInstances from "./SacredTextInstances";
import SearchSynonyms from "./SearchSynonyms";
import VerbConjugation from "./VerbConjugation";

const SearchResult = ({
  arabSearch,
  queryResult: r,
  searchSynonym,
  handleAgglutinate,
  searchWordManually,
}) => {
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
      <div
        className="arabic-word-xs"
        style={{
          paddingTop: "1rem",
          paddingBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.3rem",
          textAlign: "center",
        }}
      >
        Traducción:{" "}
        {r.spanish.map((i) => (
          <p key={i + "p"} style={{ display: "inline", margin: "0.3rem" }}>
            {i},
          </p>
        ))}
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
            {w}
            {r.spanish?.length > 1 && ","}
          </p>
        ))}
      </h2>
      <p className="arabic-word-xs">
        Traducción: {r.arabic_sg} {r.translit_sg}
      </p>
      {r.arabic_pl.length > 0 && (
        <div>
          <span className="arabic-word-xs">pl. </span>
          {r.arabic_pl.map((w, i) => (
            <p
              key={i + "pls"}
              className="arabic-word-xxs-pl"
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
    </div>
  );

  return (
    <div className="result">
      <button
        type="button"
        title="Guarda esta palabra y sigue buscando más"
        className="btn btn-outline-success inline-text"
        onClick={() => handleAgglutinate(r)}
      >
        Aglutinar
      </button>
      <ColorTags
        tags={{
          masculine: r.masculine,
          dipote: r.dipote,
          pl_diptote: r.pl_diptote,
          foreign: r.foreign,
          verb: r.verb,
          adjetive: r.adjetive,
          preposition: r.preposition,
          adverb: r.adverb,
          noun: r.noun,
          form: r.form,
          synonim: r.synonim,
        }}
      />
      {arabSearch ? ArabicSearch : SpanishSearch}
      {r.verb && <VerbConjugation props={r.conjugation} />}
      {r.additionals && <ExtraMeaning additionals={r.additionals} />}
      <SacredTextInstances r={r} />
      {r.synonim?.length > 0 && (
        <SearchSynonyms
          searchWordManually={searchWordManually}
          synonyms={r.synonim}
        />
      )}
      {r.foreign && (
        <div>
          <h6>Etimología del vocablo</h6>
          <p>{r.etymology}</p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
