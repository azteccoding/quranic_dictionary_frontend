import { useState } from "react";
import IslamicTechnicalTerm from "./IslamicTechnicalTerm";

const AgglutinatedWord = ({
  word,
  handleDeleteAgglutinate,
  searchWordManually,
}) => {
  const [show, setShow] = useState(false);

  const showContent = () => {
    setShow(!show);
  };

  return (
    <div className="accordion box-container" id="accordionExample">
      <div className="card ">
        <div className="card-header position-relative" id="headingOne">
          <button
            type="button"
            title="Eliminar palabra"
            className="close-top-right"
            aria-label="Close"
            onClick={() => handleDeleteAgglutinate(word)}
          >
            <span aria-hidden="true">&times;</span>
          </button>

          <h2 className="mb-0" onClick={showContent}>
            <button
              className="btn btn-link"
              type="button"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
              onClick={() => searchWordManually(word.arabic_sg)}
            >
              <span className="arabic-word-s">{word.arabic_sg}</span>
              {word.isTechnicalTerm && (
                <span
                  className="islamic-term__marca"
                  title="Término técnico islámico"
                  aria-label="Término técnico islámico"
                >
                  ۞
                </span>
              )}
            </button>
          </h2>
        </div>

        <div
          id="collapseOne"
          className={`collapse ${show ? "show" : ""}`}
          aria-labelledby="headingOne"
          data-parent="#accordionExample"
        >
          <div className="card-body">
            <h2 className="arabic-word-s">{word.arabic_sg} </h2>
            <p className="arabic-word-3xs">
              <span style={{ fontSize: "1.2em" }}>
                {word.isCollectiveNoun && "colect. "}
                {word.translit_sg}
              </span>
            </p>
            {word.arabic_pl.length > 0 && (
              <div className="result-plural-row">
                pl.
                {word.arabic_pl.map((item, index) => (
                  <p
                    key={item + "p"}
                    className="arabic-word-3xs result-plural-item"
                  >
                    {item} ({word.translit_pl[index]}),
                  </p>
                ))}
              </div>
            )}
            {word.isCollectiveNoun && word.indefNoun && (
              <div className="result-plural-row">
                <p className="arabic-word-3xs result-plural-item">
                  indef. {word.indefNoun}
                </p>
              </div>
            )}
            {word.definite_sg && (
              <div className="result-plural-row">
                determ.
                <p className="arabic-word-3xs result-plural-item">
                  {word.definite_sg} ({word.definite_translit})
                </p>
              </div>
            )}
            <div className="arabic-word-xxs result-translation-row">
              {word.spanish.map((i) => (
                <p key={i + "p"} className="result-spanish-item">
                  {i},
                </p>
              ))}
            </div>

            <IslamicTechnicalTerm
              isTechnicalTerm={word.isTechnicalTerm}
              term={word.term}
            />

            {word.isVerb && (
              <div className="conjugation-block">
                <p className="arabic-word-xxs verb-p">
                  Raíz: {word.conjugation.root}
                </p>
                <p className="arabic-word-xxs verb-p">
                  Vocal de imperfectivo:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {word.conjugation.imperfect_vowel}
                  </span>
                </p>
                <p className="arabic-word-xxs verb-p">
                  Forma {word.conjugation.form}
                </p>
                <br />
                <p className="arabic-word-xxs verb-p">
                  Sustantivo verbal: {word.conjugation.masdar}{" "}
                  {word.conjugation.masdar_translit}{" "}
                  {word.conjugation.masdar_meaning}
                </p>
                {word.irregular && (
                  <>
                    <br />
                    <p className="arabic-word-xxs verb-p">
                      Perfectivo 1ra sing.: {word.conjugation.perfect1}{" "}
                      {word.conjugation.perfect1_translit}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgglutinatedWord;
