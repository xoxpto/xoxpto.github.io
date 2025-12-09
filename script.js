document.addEventListener("DOMContentLoaded", () => {
  // Ano no footer
  const years = document.querySelectorAll("#year");
  years.forEach((el) => (el.textContent = new Date().getFullYear()));

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
});
