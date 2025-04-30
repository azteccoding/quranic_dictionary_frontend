const SearchSynonyms = (props) => {
  return (
    <div>
      <div>Sinónimos</div>
      {props.synonyms.map((syn) => (
        <p className="synonym" onClick={() => props.searchSynonym(syn)}>
          {syn}
        </p>
      ))}
    </div>
  );
};

export default SearchSynonyms;
