import { useEffect, useState } from "react";

// Sem valor gravado o tema segue o sistema, e é o CSS que decide. Gravar
// "light" ou "dark" fixa a escolha e tem precedência sobre o sistema.
const lerPreferencia = () => {
  try {
    return localStorage.getItem("vidya-theme") || "system";
  } catch {
    return "system";
  }
};

const aplicar = (tema) => {
  const raiz = document.documentElement;
  if (tema === "system") raiz.removeAttribute("data-theme");
  else raiz.setAttribute("data-theme", tema);
};

const escuroAgora = (tema) =>
  tema === "dark" ||
  (tema === "system" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches);

const ThemeToggle = () => {
  const [tema, setTema] = useState(lerPreferencia);

  useEffect(() => {
    aplicar(tema);
    try {
      if (tema === "system") localStorage.removeItem("vidya-theme");
      else localStorage.setItem("vidya-theme", tema);
    } catch {
      // Navegação privada pode bloquear o armazenamento; o tema ainda aplica.
    }
  }, [tema]);

  const alternar = () => setTema(escuroAgora(tema) ? "light" : "dark");
  const estaEscuro = escuroAgora(tema);

  return (
    <button
      className="theme-toggle"
      onClick={alternar}
      title={estaEscuro ? "Usar tema claro" : "Usar tema escuro"}
      aria-label={estaEscuro ? "Usar tema claro" : "Usar tema escuro"}
    >
      {estaEscuro ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
