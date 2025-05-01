import { useEffect, useRef, useState } from "react";
// import { mockDBQuery } from "../mocks/mockDBQuery";
import SearchResult from "./SearchResult";
import { findInDictionary } from "../services/requests";
import AgglutinatedWord from "./AgglutinatedWord";

const Searchbar = () => {
  const [agglutinatedWords, setAgglutinatedWords] = useState([]);
  const arab2EspTitle = "Árabe coránico - Español";
  const esp2ArabTitle = "Español - Árabe coránico";
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

  useEffect(() => {
    const agglutinatedInLocal =
      JSON.parse(localStorage.getItem("agglutinate")) || [];

    setAgglutinatedWords(agglutinatedInLocal);
  }, []);

  useEffect(() => {
    agglutinatedRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("====================================");
    console.log("no funciona");
    console.log("====================================");
  }, [agglutinatedWords]);

  useEffect(() => {
    setIsLoading(false);
    setSynonymSearched(false);
    setSearchTitle(() => (arab2EspSelected ? arab2EspTitle : esp2ArabTitle));

    inputReference.current.focus();
    inputReference.current.scrollIntoView({ behavior: "smooth" });
  }, [arab2EspSelected, searchActive, searchWord, synonymSearched]);

  function handleInput(event) {
    setSearchWord(event.target.value);
  }

  function handleAgglutinate(word) {
    const wordContent = {
      id: Math.random().toString(16).slice(2),
      spanish: word.spanish,
      arabic_sg: word.arabic_sg,
      arabic_pl: word.arabic_pl,
      translit_sg: word.translit_sg,
      translit_pl: word.translit_pl,
    };

    let updater = JSON.parse(JSON.stringify(agglutinatedWords));
    updater.push(wordContent);

    setAgglutinatedWords(updater);

    localStorage.setItem("agglutinate", JSON.stringify(agglutinatedWords));
  }

  function handleDeleteAgglutinate(word) {
    let updater = JSON.parse(JSON.stringify(agglutinatedWords));
    const updatedLocal = updater.filter((w) => word.id !== w.id);
    setAgglutinatedWords(updatedLocal);

    localStorage.setItem("agglutinate", JSON.stringify(agglutinatedWords));
  }

  function handleLanguageChange(toArabic) {
    setSearchActive(false);
    setSearchWord("");
    setQueryResult("");
    setArab2EspSelected(toArabic);
    setWordNotFoundInDictionary(false);
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
    setSearchTitle(arab2EspTitle);
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
      <div>
        <h1 style={{ paddingTop: "3rem" }}>Diccionario {searchTitle}</h1>

        <div
          style={{ paddingTop: "1.8rem", paddingBottom: "1.3rem" }}
          className="btn-group btn-group-toggle"
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
          className="row g-2 align-items-center form-field"
          style={{ padding: "1rem 9rem" }}
          onSubmit={handleSubmit}
        >
          <label htmlFor="gsearch" className="form-label">
            Buscar
          </label>
          <input
            type="search"
            id="gsearch"
            autoFocus
            className="form-control mobile-input-lg"
            aria-label="default input example"
            name="gsearch"
            ref={inputReference}
            placeholder={arab2EspSelected ? "كتاب" : "libro"}
            onChange={handleInput}
            value={searchWord}
          />

          <input type="submit" className="btn btn-primary mb-4 btn-lg" />
        </form>
      </div>
      {isLoading && (
        <div className="spinner-grow" role="status">
          <span className="sr-only"></span>
        </div>
      )}
      {queryResult?.length > 0 && (
        <p>
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
      {wordNotFoundInDictionary && !isLoading
        ? "Esa palabra aun no se encuentra en el diccionario"
        : ""}
      <div className="signature">
        {"Investigación y programación por Khalid Jorge"}
      </div>
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
