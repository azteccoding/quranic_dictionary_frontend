import ColorTags from "./ColorTags";
import ExtraMeaning from "./ExtraMeaning";
import SacredTextInstances from "./SacredTextInstances";
import SearchSynonyms from "./SearchSynonyms";
import VerbConjugation from "./VerbConjugation";
import IslamicTechnicalTerm from "./IslamicTechnicalTerm";

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
        <div className="result-plural-row">
          pl.
          {r.arabic_pl.map((item, index) => (
            <p key={item + "p"} className="arabic-word-xs result-plural-item">
              {item} ({r.translit_pl[index]}),
            </p>
          ))}
        </div>
      )}
      <div className="arabic-word-xs result-translation-row">
        {r.spanish.map((i) => (
          <p key={i + "p"} className="result-spanish-item">
            {i},
          </p>
        ))}
      </div>
    </div>
  );

  const SpanishSearch = r?.arabic_sg && (
    <div>
      <h2 className="result-spanish-heading">
        {r.spanish.map((w, i) => (
          <p key={i + "pls"} className="result-spanish-item">
            {w}
            {r.spanish?.length > 1 && ","}
          </p>
        ))}
      </h2>
      <p className="arabic-word-xs">
        {r.arabic_sg} {r.translit_sg}
      </p>
      {r.arabic_pl.length > 0 && (
        <div>
          <span className="arabic-word-xs">pl. </span>
          {r.arabic_pl.map((w, i) => (
            <p
              key={i + "pls"}
              className="arabic-word-xxs-pl result-plural-item"
            >
              {r.arabic_pl[i]} ({r.translit_pl[i]}),{" "}
            </p>
          ))}
        </div>
      )}
      <p className="pronunciation-link">
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
          form: r.conjugation?.form ? r.conjugation?.form : "",
          synonim: r.synonim,
          pasive: r.pasive ? r.pasive : false,
        }}
      />
      {arabSearch ? ArabicSearch : SpanishSearch}
      <IslamicTechnicalTerm isTechnicalTerm={r.isTechnicalTerm} term={r.term} />
      {r.verb && (
        <VerbConjugation
          props={r.conjugation}
          participle={r.participle}
          searchWordManually={searchWordManually}
        />
      )}
      {r.additionals && <ExtraMeaning additionals={r.additionals} />}
      <SacredTextInstances r={r} />
      {r.synonim?.length > 0 && (
        <SearchSynonyms
          searchWordManually={searchWordManually}
          synonyms={r.synonim}
        />
      )}
      {r.foreign && (
        <div className="etymology-block">
          <h6>Etimología del vocablo</h6>
          <p>{r.etymology}</p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
