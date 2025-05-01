import { useState } from "react";

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
            <p className="arabic-word-3xs">{word.translit_sg}</p>
            {word.arabic_pl.length > 0 && (
              <div>
                pl.
                {word.arabic_pl.map((item, index) => (
                  <p
                    key={item + "p"}
                    className="arabic-word-3xs"
                    style={{ display: "inline", margin: "0.3rem" }}
                  >
                    {item} ({word.translit_pl[index]}),
                  </p>
                ))}
              </div>
            )}
            <div
              className="arabic-word-xxs"
              style={{ paddingTop: "1rem", paddingBottom: "1.5rem" }}
            >
              Traducción:{" "}
              {word.spanish.map((i) => (
                <p
                  key={i + "p"}
                  style={{ display: "inline", margin: "0.3rem" }}
                >
                  {i},
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgglutinatedWord;
