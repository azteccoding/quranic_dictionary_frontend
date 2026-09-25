import { useEffect, useRef, useState } from "react";
// import { mockDBQuery } from "../mocks/mockDBQuery";
import SearchResult from "./SearchResult";
import { findInDictionary } from "../services/requests";
import AgglutinatedWord from "./AgglutinatedWord";
import {
  ARAB_2_SPANISH_TITLE,
  SIGNATURE,
  SPANISH_2_ARAB_TITLE,
} from "../constants/constants";

const Searchbar = () => {
  const [agglutinatedWords, setAgglutinatedWords] = useState([]);
  const [wordNotFoundInDictionary, setWordNotFoundInDictionary] =
    useState(false);
  const [arab2EspSelected, setArab2EspSelected] = useState(true);
  const [searchTitle, setSearchTitle] = useState();
  const [searchWord, setSearchWord] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [queryResult, setQueryResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [synonymSearched, setSynonymSearched] = useState(false);
  const inputReference = useRef(null);
  const agglutinatedRef = useRef(null);
  const isFirstRender = useRef(true);
  const toggleRef = useRef(false);

  useEffect(() => {
    const agglutinatedInLocal =
      JSON.parse(localStorage.getItem("agglutinate")) || [];

    setAgglutinatedWords(agglutinatedInLocal);
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) {
      agglutinatedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [agglutinatedWords]);

  useEffect(() => {
    setIsLoading(false);
    setSynonymSearched(false);
    setSearchTitle(() =>
      arab2EspSelected ? ARAB_2_SPANISH_TITLE : SPANISH_2_ARAB_TITLE,
    );

    if (toggleRef.current && !isFirstRender.current) {
      inputReference.current.focus();
      inputReference.current.scrollIntoView({ behavior: "smooth" });
    }

    toggleRef.current = true;
  }, [arab2EspSelected, searchActive, searchWord, synonymSearched]);

  function handleInput(event) {
    setSearchWord(event.target.value);
    toggleRef.current = false;
    isFirstRender.current = false;
  }

  function handleAgglutinate(word) {
    const wordContent = {
      id: Math.random().toString(16).slice(2),
      spanish: word.spanish,
      arabic_sg: word.arabic_sg,
      arabic_pl: word.arabic_pl,
      translit_sg: word.translit_sg,
      translit_pl: word.translit_pl,
      isVerb: word.verb,
      conjugation: word.conjugation,
      isTechnicalTerm: word.isTechnicalTerm,
      term: word.term,
      isCollectiveNoun: word.isCollectiveNoun,
      isCuadriliteral: word.isCuadriliteral,
      indefNoun: word.indefNoun,
      definite_sg: word.definite_sg,
      definite_translit: word.definite_translit,
    };

    let updater = JSON.parse(JSON.stringify(agglutinatedWords));
    updater.push(wordContent);

    setAgglutinatedWords(updater);

    localStorage.setItem("agglutinate", JSON.stringify(updater));
  }

  function handleDeleteAgglutinate(word) {
    let updater = JSON.parse(JSON.stringify(agglutinatedWords));
    const updatedLocal = updater.filter((w) => word.id !== w.id);
    setAgglutinatedWords(updatedLocal);

    if (updatedLocal.length === 0) {
      isFirstRender.current = true;
      localStorage.clear();
      return;
    }

    localStorage.setItem("agglutinate", JSON.stringify(updatedLocal));
  }

  function handleLanguageChange(toArabic) {
    setSearchActive(false);
    setSearchWord("");
    setQueryResult("");
    setArab2EspSelected(toArabic);
    setWordNotFoundInDictionary(false);
    toggleRef.current = false;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (searchWord) {
      setIsLoading(true);

      const { data } = await findInDictionary(searchWord, arab2EspSelected);

      try {
        if (data?.data?.length) {
          const res = data.data;
          setQueryResult(res);
          setWordNotFoundInDictionary(false);
        } else {
          setQueryResult([]);
          console.log("No data for that word: " + searchWord);
          setWordNotFoundInDictionary(true);
        }
      } catch (error) {
        console.log("==========ERROR FETCHING============");
        console.log(error);
        console.log("====================================");
      }

      setSearchWord("");
      setSearchActive(true);
    }
    setIsLoading(false);
  }

  const searchWordManually = async (p) => {
    setArab2EspSelected(true);
    setSearchTitle(ARAB_2_SPANISH_TITLE);
    setWordNotFoundInDictionary(false);
    setIsLoading(true);

    const { data } = await findInDictionary(p, true);

    try {
      if (data?.data?.length) {
        const res = data.data;
        setQueryResult(res);
        setWordNotFoundInDictionary(false);
      } else {
        setQueryResult([]);
        console.log("No data for that word: " + searchWord);
        setWordNotFoundInDictionary(true);
      }
    } catch (error) {
      console.log("======ERROR FETCHING SYNONYMS=======");
      console.log(error);
      console.log("====================================");
    }

    setSearchWord("");
    setSearchActive(true);
    setSynonymSearched(true);
  };

  return (
    <>
      <div className="dictionary-header">
        <h1 className="search-title">Diccionario {searchTitle}</h1>

        <div
          className="btn-group btn-group-toggle language-toggle"
          data-toggle="buttons"
        >
          <label className="btn">Buscar palabra en</label>
          <label
            className={`btn btn-secondary ${arab2EspSelected && "active"}`}
          >
            <input
              type="radio"
              name="options"
              id="option1"
              autoComplete="off"
              checked={arab2EspSelected}
              onChange={() => handleLanguageChange(true)}
            />{" "}
            árabe coránico
          </label>
          <label
            className={`btn btn-secondary ${!arab2EspSelected && "active"}`}
          >
            <input
              type="radio"
              name="options"
              id="option2"
              autoComplete="off"
              checked={!arab2EspSelected}
              onChange={() => handleLanguageChange(false)}
            />{" "}
            español
          </label>
        </div>

        <form
          className="row g-2 align-items-center form-field search-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="gsearch" className="form-label">
            Buscar
          </label>
          <div className="search-input-row">
            <input
              type="search"
              id="gsearch"
              className="form-control mobile-input-lg"
              aria-label="Palabra a buscar"
              name="gsearch"
              ref={inputReference}
              placeholder={arab2EspSelected ? "كتاب" : "libro"}
              onChange={handleInput}
              value={searchWord}
            />

            <button
              type="submit"
              className="btn btn-primary btn-lg search-submit"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="spinner-grow" role="status">
          <span className="sr-only"></span>
        </div>
      )}
      {queryResult?.length > 0 && !isLoading && (
        <p className="result-count">
          {queryResult.length} coincidencia{queryResult.length > 1 ? "s" : ""}
        </p>
      )}
      {searchActive && !wordNotFoundInDictionary && !isLoading
        ? queryResult.map((word) => (
            <SearchResult
              key={word.english}
              searchWordManually={searchWordManually}
              arabSearch={arab2EspSelected}
              queryResult={word}
              handleAgglutinate={handleAgglutinate}
            />
          ))
        : null}
      {wordNotFoundInDictionary && !isLoading ? (
        <p className="not-found-message">
          Esa palabra aun no se encuentra en el diccionario
        </p>
      ) : (
        ""
      )}
      <div className="signature">{SIGNATURE}</div>

      {queryResult?.length === 0 && <div className="bottom-filler"></div>}
      <div ref={agglutinatedRef}>
        {agglutinatedWords.map((word, i) => (
          <AgglutinatedWord
            key={"agg" + i}
            searchWordManually={searchWordManually}
            handleDeleteAgglutinate={handleDeleteAgglutinate}
            word={word}
          />
        ))}
      </div>
    </>
  );
};

export default Searchbar;
