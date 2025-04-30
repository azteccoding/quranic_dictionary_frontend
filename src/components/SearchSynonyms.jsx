const SearchSynonyms = (props) => {
  return (
    <div>
      <div className="synonym arabic-word-xs">Sinónimos</div>
      {props.synonyms.map((syn) => (
        <p
          className="synonym arabic-word-s"
          onClick={() => props.searchSynonym(syn)}
        >
          {syn}
        </p>
      ))}
    </div>
  );
};

export default SearchSynonyms;
