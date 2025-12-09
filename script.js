document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavActive();
  initThemeToggle();
  initArchives();
});

/* Atualizar ano(s) no footer */
function initYear() {
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* Destacar item ativo na sidebar com base no pathname */
function initNavActive() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (path === href || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* Tema (dark / light) com localStorage */
function initThemeToggle() {
  const body = document.body;
  const themeToggleBtn = document.querySelector(".theme-toggle");

  const applyThemeLabel = () => {
    if (!themeToggleBtn) return;
    if (body.classList.contains("theme-light")) {
      themeToggleBtn.textContent = "☾";
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema escuro");
    } else {
      themeToggleBtn.textContent = "◐";
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema claro");
    }
  };

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
}

/* ARCHIVES DINÂMICO (GitHub API + tabs por área) */
function initArchives() {
  const root = document.getElementById("archives-root");
  if (!root) return; // só corre em archives.html

  const tabsContainer = document.getElementById("archives-tabs");
  const grid = document.getElementById("archives-grid");
  const emptyMsg = document.getElementById("archives-empty");
  const errorMsg = document.getElementById("archives-error");

  const GITHUB_USER = "xoxpto";

  const CATEGORIES = [
    { key: "devops", label: "DevOps" },
    { key: "gamedev", label: "GameDev" },
    { key: "3d", label: "3D & Design" },
    { key: "security", label: "CyberSecurity" },
  ];

  // Mapeamento de funções que decidem a que categoria pertence cada repo
  const categoryMatchers = {
    devops: (repo) => {
      const t = repo.topics || [];
      const name = repo.name.toLowerCase();
      return (
        t.includes("devops") ||
        t.includes("automation") ||
        t.includes("powershell") ||
        t.includes("infra") ||
        name.includes("automation") ||
        name.includes("powershell") ||
        name.includes("pipeline")
      );
    },
    gamedev: (repo) => {
      const t = repo.topics || [];
      const name = repo.name.toLowerCase();
      return (
        t.includes("gamedev") ||
        t.includes("game") ||
        t.includes("js-game") ||
        name.includes("game")
      );
    },
    "3d": (repo) => {
      const t = repo.topics || [];
      const name = repo.name.toLowerCase();
      return (
        t.includes("3d") ||
        t.includes("3d-design") ||
        t.includes("blender") ||
        name.includes("3d") ||
        name.includes("blender")
      );
    },
    security: (repo) => {
      const t = repo.topics || [];
      const name = repo.name.toLowerCase();
      return (
        t.includes("security") ||
        t.includes("cybersecurity") ||
        t.includes("ctf") ||
        name.includes("sec") ||
        name.includes("cyber")
      );
    },
  };

  const state = {
    repos: [],
    byCategory: {},
    currentCategory: null,
  };

  CATEGORIES.forEach((cat) => {
    state.byCategory[cat.key] = [];
  });

  createTabs();
  fetchRepos();

  function createTabs() {
    tabsContainer.innerHTML = "";
    CATEGORIES.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = "tab-button";
      if (index === 0) btn.classList.add("active");
      btn.dataset.category = cat.key;
      btn.textContent = cat.label;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".tab-button")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.currentCategory = cat.key;
        renderCategory();
      });
      tabsContainer.appendChild(btn);
    });
    state.currentCategory = CATEGORIES[0].key;
  }

  async function fetchRepos() {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=desc`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error("GitHub API error");
      }

      const repos = await response.json();

      state.repos = repos.filter((r) => !r.fork); // ignora forks

      // classificar por categorias
      state.repos.forEach((repo) => {
        const catKeys = Object.keys(categoryMatchers);
        catKeys.forEach((key) => {
          if (categoryMatchers[key](repo)) {
            state.byCategory[key].push(repo);
          }
        });
      });

      // ordenar projetos por data (mais recente primeiro)
      Object.keys(state.byCategory).forEach((key) => {
        state.byCategory[key].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      renderCategory();
    } catch (err) {
      console.error("Erro a carregar repos do GitHub:", err);
      if (errorMsg) errorMsg.hidden = false;
    }
  }

  function renderCategory() {
    const key = state.currentCategory;
    const repos = state.byCategory[key] || [];

    if (!grid) return;

    grid.innerHTML = "";

    if (repos.length === 0) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    } else {
      if (emptyMsg) emptyMsg.hidden = true;
    }

    repos.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "archive-card";

      const created = new Date(repo.created_at);
      const dateStr = created.toLocaleDateString("pt-PT", {
        year: "numeric",
        month: "short",
      });

      const desc =
        repo.description ||
        "Repositório ainda sem descrição detalhada. (A atualizar brevemente.)";

      card.innerHTML = `
        <div class="archive-card-header">
          <h2>${repo.name}</h2>
          <span class="archive-date">${dateStr}</span>
        </div>
        <p class="archive-desc">${desc}</p>
        <a class="archive-link" href="${repo.html_url}" target="_blank" rel="noreferrer">
          Ver no GitHub →
        </a>
      `;

      grid.appendChild(card);
    });
  }
}
