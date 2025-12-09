document.addEventListener("DOMContentLoaded", () => {
  // Atualizar ano no footer (pode haver vários #year)
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Destacar item ativo na sidebar com base no pathname
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    if (path === href || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Tema (dark / light) com localStorage
  const body = document.body;
  const themeToggleBtn = document.querySelector(".theme-toggle");

  const applyThemeLabel = () => {
    if (!themeToggleBtn) return;
    if (body.classList.contains("theme-light")) {
      themeToggleBtn.textContent = "☾"; // botão mostra lua quando está em light
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema escuro");
    } else {
      themeToggleBtn.textContent = "◐"; // botão mostra símbolo quando está em dark
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema claro");
    }
  };

  // Carregar tema guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("theme-light");
  }
  applyThemeLabel();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      body.classList.toggle("theme-light");
      const isLight = body.classList.contains("theme-light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      applyThemeLabel();
    });
  }
});
