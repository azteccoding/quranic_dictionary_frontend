const VerbConjugation = ({ props }) => {
  return (
    <div>
      <h5>Conjugación</h5>

      <p className="arabic-word-xxs verb-p">Raíz: {props.root}</p>
      <br />
      <p className="arabic-word-xxs verb-p">
        Perfectivo: {props.perfect3} {props.perfect3_translit}
      </p>
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
    </div>
  );
};

export default VerbConjugation;
