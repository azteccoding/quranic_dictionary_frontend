const SearchSynonyms = (props) => {
  return (
    <div>
      <div className="arabic-word-xs">Sinónimos</div>
      {props.synonyms.map((syn) => (
        <p
          className="synonym arabic-word-s"
          onClick={() => props.searchWordManually(syn)}
        >
          {syn}
        </p>
      ))}
    </div>
  );
};

export default SearchSynonyms;
