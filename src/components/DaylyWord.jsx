import { useEffect, useState } from "react";
import { getDailyWord } from "../services/requests";
import "../styles/DaylyWord.css";

const STORAGE_KEY = "palabraDelDiaCerrada";

function estaCerrada() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // navegación privada o storage bloqueado
  }
}

export default function DaylyWord() {
  const [palabra, setPalabra] = useState(null);
  const [cerrada, setCerrada] = useState(estaCerrada);

  useEffect(() => {
    if (cerrada) return;

    const cargarPalabra = async () => {
      const { hasExternalError, data, errorMessage } = await getDailyWord();
      if (hasExternalError) {
        console.error("Palabra del día:", errorMessage);
        return;
      }
      setPalabra(data.data); // axios guarda el body en response.data
    };

    cargarPalabra();
  }, [cerrada]);

  const cerrar = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* si falla, al menos se oculta en esta vista */
    }
    setCerrada(true);
  };

  if (cerrada || !palabra) return null;

  return (
    <aside className="palabra-dia mb-3" aria-label="Palabra del día">
      <span className="palabra-dia__etiqueta">Palabra destacada</span>

      <span className="palabra-dia__arabe" lang="ar" dir="rtl">
        {palabra.arabic_sg}
      </span>

      {palabra.translit_sg && (
        <span className="palabra-dia__translit">{palabra.translit_sg}</span>
      )}

      {palabra.spanish?.length > 0 && (
        <span
          className="palabra-dia__significado"
          title={palabra.spanish.join(" · ")}
        >
          {palabra.spanish.join(" · ")}
        </span>
      )}

      <button
        type="button"
        className="btn-close palabra-dia__cerrar"
        aria-label="Cerrar palabra del día"
        onClick={cerrar}
      />
    </aside>
  );
}
