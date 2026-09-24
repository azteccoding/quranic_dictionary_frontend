const ColorTags = ({ tags }) => {
  const wordGender = () => {
    const backgroundStyle = tags.masculine
      ? "text-bg-secondary"
      : "text-bg-pink";

    return tags.noun ? (
      <span className={`badge ${backgroundStyle}`}>
        {tags.masculine ? "Masculino" : "Femenino"}
      </span>
    ) : (
      ""
    );
  };
  const noun = tags.noun && (
    <span className="badge text-bg-primary">Sustantivo</span>
  );
  const adjetive = tags.adjetive && (
    <span className="badge text-bg-brown">Adjetivo</span>
  );
  const adverb = tags.adverb && (
    <span className="badge text-bg-purple">Adverbio</span>
  );
  const preposition = tags.preposition && (
    <span className="badge text-bg-purple">Preposición</span>
  );
  const verb = tags.verb && (
    <span className="badge text-bg-success">Verbo</span>
  );
  const nounInflection = tags.noun && (
    <span className="badge text-bg-danger">
      {tags.diptote ? "Diptote" : "Triptote"}
    </span>
  );
  const pluralDiptote = tags.pl_diptote && (
    <span className="badge text-bg-warning">Plural diptote</span>
  );
  const foreignWord = tags.foreign && (
    <span className="badge text-bg-info">Extranjerismo</span>
  );
  const verbForm = tags.verb && (
    <span className="badge text-bg-dark">Forma {tags.form || "I"}</span>
  );
  const verbVoice =
    tags.verb && tags.pasive ? (
      <span className="badge text-bg-purple">Voz pasiva</span>
    ) : (
      ""
    );

  return (
    <div className="tag-row">
      {noun}
      {adjetive}
      {preposition}
      {adverb}
      {wordGender()}
      {verb}
      {nounInflection}
      {pluralDiptote}
      {foreignWord}
      {verbForm}
      {verbVoice}
    </div>
  );
};

export default ColorTags;
