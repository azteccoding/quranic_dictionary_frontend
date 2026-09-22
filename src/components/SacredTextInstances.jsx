import { hadithCollectionCode } from "../constants/constants";
import SpecialHadithCollection from "./SpecialHadithCollection";

const SacredTextInstances = ({ r }) => {
  const hadithCollectionFullName =
    r?.hadith_appear?.collection_name ||
    hadithCollectionCode[r?.hadith_appear?.collection_code]?.name ||
    "";

  const hadithCollectionShortName =
    r?.hadith_appear?.collection ||
    hadithCollectionCode[r?.hadith_appear?.collection_code]?.shortName ||
    "";

  return (
    <>
      {r.quranic_appear?.appearance && (
        <div className="sacred-text-block">
          <h4>En el Corán aparece en {r.quranic_appear?.appearance}</h4>

          <p className="arabic-word-s">{r.quranic_appear.sentence}</p>
          <p className="sacred-text-translation">
            "{r.quranic_appear.translation}"
          </p>
          <p className="pronunciation-link sacred-text-source">
            <a
              target="blank"
              href={`https://quran.com/${r.quranic_appear?.appearance}?translations=28%2C199`}
            >
              Leer en el Corán
            </a>
          </p>
        </div>
      )}

      {hadithCollectionShortName && (
        <div className="sacred-text-block">
          <h4>En la Sunna aparece en {hadithCollectionFullName}</h4>

          <p className="arabic-word-s">{r.hadith_appear.sentence}</p>
          <p className="sacred-text-translation">
            "{r.hadith_appear.translation}"
          </p>
          <p className="sacred-text-source">
            Fuente:{" "}
            <a
              target="blank"
              href={`https://sunnah.com/${hadithCollectionShortName}:${r.hadith_appear.number}`}
            >
              {hadithCollectionFullName} {r.hadith_appear.number}
            </a>
          </p>
          {hadithCollectionShortName === "ahmad" && (
            <SpecialHadithCollection
              props={r.hadith_appear}
              hadithCollectionFullName={hadithCollectionFullName}
            />
          )}
        </div>
      )}

      {r.phrase?.arabic && (
        <div className="sacred-text-block">
          <h4>Ejemplos de uso</h4>
          <p className="arabic-word-s">{r.phrase.arabic}</p>
          <p>{r.phrase.translit}</p>
          <p>{r.phrase.meaning}</p>
          {r.phrase?.reference ? (
            <p className="sacred-text-source">
              Fuente:{" "}
              <a target="blank" href={r.phrase.link}>
                {r.phrase.reference}
              </a>
            </p>
          ) : (
            ""
          )}
          <p className="pronunciation-link">
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
