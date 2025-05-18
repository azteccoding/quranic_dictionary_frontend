const SpecialHadithCollection = ({ props }) => {
  return (
    <>
      {props.links.map((link, index) => (
        <p style={{ fontSize: "0.7rem", display: "block" }}>
          Fuente {index + 2}:{" "}
          <a target="blank" href={link}>
            {props.collection_name} {props.number}
          </a>
        </p>
      ))}
    </>
  );
};

export default SpecialHadithCollection;
