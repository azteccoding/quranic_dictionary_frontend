const ColorTags = ({ tags }) => {
  const wordGender = () => {
    const backgroundStyle = tags.masculine ? "text-bg-secondary" : "bg-pink";

    return (
      <span className={`badge ${backgroundStyle}`}>
        {tags.masculine ? "Masculino" : "Femenino"}
      </span>
    );
  };
  const noun = tags.noun && (
    <span className="badge text-bg-primary">Sustantivo</span>
  );
  const verb = tags.verb && (
    <span className="badge text-bg-success">Verbo</span>
  );
  const nounInflection = (
    <span className="badge text-bg-danger">
      {tags.diptote ? "Diptote" : "Triptote"}
    </span>
  );
  const pluralDiptote = tags.pl_diptote && (
    <span className="badge text-bg-warning">Plural diptote</span>
  );
  const foreignWord = tags.foreing && (
    <span className="badge text-bg-info">Extranjerismo</span>
  );
  const verbForm = tags.verb && (
    <span class="badge text-bg-dark">Form {tags.form || "I"}</span>
  );

  return (
    <div style={{ margin: "1rem" }}>
      {noun}
      {wordGender()}
      {verb}
      {nounInflection}
      {pluralDiptote}
      {foreignWord}
      {verbForm}
    </div>
  );
};

export default ColorTags;
