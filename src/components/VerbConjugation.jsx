const VerbConjugation = ({ props, participle, searchWordManually }) => {
  const hasParticiple =
    participle && (participle.active?.arabic || participle.pasive?.arabic);

  return (
    <div className="conjugation-block">
      <h5>Conjugación</h5>

      <p className="arabic-word-xxs verb-p">Raíz: {props.root}</p>
      <br />
      {props.irregular && (
        <>
          {" "}
          <p className="arabic-word-xxs verb-p">
            Perfectivo 1ra sing.: {props.perfect1} {props.perfect1_translit}
          </p>
        </>
      )}
      <br />
      <p className="arabic-word-xxs verb-p">
        Vocal de imperfectivo:{" "}
        <span style={{ fontWeight: "bold" }}>{props.imperfect_vowel}</span>
      </p>
      <br />
      <p className="arabic-word-xxs verb-p">
        Sustantivo verbal: {props.masdar} {props.masdar_translit}{" "}
        {props.masdar_meaning}
      </p>

      {hasParticiple && (
        <div className="participle-block">
          <h6>Participios</h6>
          {participle.active?.arabic && (
            <p className="arabic-word-xxs verb-p">
              Activo:{" "}
              <button
                type="button"
                className="word-link"
                onClick={() => searchWordManually(participle.active.arabic)}
              >
                <span className="arabic-word-s">
                  {participle.active.arabic}
                </span>
              </button>{" "}
              ({participle.active.translit})
            </p>
          )}
          {participle.pasive?.arabic && (
            <p className="arabic-word-xxs verb-p">
              Pasivo:{" "}
              <button
                type="button"
                className="word-link"
                onClick={() => searchWordManually(participle.pasive.arabic)}
              >
                <span className="arabic-word-s">
                  {participle.pasive.arabic}
                </span>
              </button>{" "}
              ({participle.pasive.translit})
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerbConjugation;
