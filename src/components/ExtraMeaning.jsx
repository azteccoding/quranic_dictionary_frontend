const ExtraMeaning = ({ additionals }) => {
  return (
    <div className="arabic-word-xxs" style={{ paddingTop: "1rem" }}>
      {additionals.map((item, i) => (
        <p key={"addExtra" + i} style={{ margin: "0.2rem" }}>
          {item.arabic} | {item.translit} | {item.meaning}
        </p>
      ))}
    </div>
  );
};

export default ExtraMeaning;
