import { useEffect, useState } from "react";
// import { mockDBQuery } from "../mocks/mockDBQuery";
import SearchResult from "./SearchResult";
import { findInDictionary } from "../services/requests";

const Searchbar = () => {
  const arab2EspTitle = "árabe coránico - español";
  const esp2ArabTitle = "español - árabe coránico";
  const [wordNotFoundInDictionary, setWordNotFoundInDictionary] =
    useState(false);
  const [hasQueryError, setHasQueryError] = useState(false);
  const [arab2EspSelected, setArab2EspSelected] = useState(true);
  const [searchTitle, setSearchTitle] = useState();
  const [searchWord, setSearchWord] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [queryResult, setQueryResult] = useState("");

  useEffect(() => {
    setSearchTitle(() => (arab2EspSelected ? arab2EspTitle : esp2ArabTitle));
  }, [arab2EspSelected, searchActive]);

  function handleInput(event) {
    setSearchWord(event.target.value);
  }

  function handleToggle() {
    setSearchActive(false);
    setSearchWord("");
    setQueryResult("");
    setArab2EspSelected(!arab2EspSelected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await findInDictionary(searchWord, arab2EspSelected);

    try {
      if (data?.data?.length) {
        const res = data.data[0];
        setQueryResult(res);
        setHasQueryError(false);
        setWordNotFoundInDictionary(false);
      } else {
        setHasQueryError(true);
        console.log("No data for that word: " + searchWord);
        setWordNotFoundInDictionary(true);
      }
    } catch (error) {
      console.log("==========ERROR FETCHING============");
      console.log(error);
      console.log("====================================");
      setHasQueryError(true);
    }

    setSearchWord("");
    setSearchActive(true);
  }

  return (
    <>
      <div>
        <h1>Diccionario {searchTitle}</h1>

        <div
          style={{
            margin: "1rem",
            textAlign: "left",
            paddingLeft: "8rem",
          }}
        >
          <div className="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              onChange={handleToggle}
              id="switchCheckDefault"
            />

            <label class="form-check-label" for="switchCheckDefault">
              Buscar palabra en {arab2EspSelected ? "árabe" : "español"}
            </label>
          </div>
        </div>

        <form
          class="row g-2 align-items-center"
          style={{ padding: "1rem 9rem" }}
          onSubmit={handleSubmit}
        >
          <label for="gsearch" class="form-label">
            Buscar
          </label>
          <input
            type="search"
            id="gsearch"
            class="form-control"
            aria-label="default input example"
            name="gsearch"
            placeholder={arab2EspSelected ? "كتاب" : "libro"}
            onChange={handleInput}
            value={searchWord}
          />
          <input type="submit" class="btn btn-primary mb-3" />
        </form>
      </div>
      {searchActive && !wordNotFoundInDictionary && !hasQueryError ? (
        <SearchResult arabSearch={arab2EspSelected} queryResult={queryResult} />
      ) : (
        ""
      )}
      {wordNotFoundInDictionary && hasQueryError
        ? "Esa palabra aun no se encuentra en el diccionario"
        : ""}
    </>
  );
};

export default Searchbar;
