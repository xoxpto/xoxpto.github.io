document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavActive();
  initThemeToggle();
  initArchives();
});

/* Atualizar ano no footer */
function initYear() {
  document.querySelectorAll("#year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* Sidebar ativa conforme a página */
function initNavActive() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".sidebar-nav .nav-item").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (path === href || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* Tema dark/light */
function initThemeToggle() {
  const body = document.body;
  const themeToggleBtn = document.querySelector(".theme-toggle");

  function updateToggleLabel() {
    if (body.classList.contains("theme-light")) {
      themeToggleBtn.textContent = "☾";
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema escuro");
    } else {
      themeToggleBtn.textContent = "◐";
      themeToggleBtn.setAttribute("aria-label", "Mudar para tema claro");
    }
  }

  const saved = localStorage.getItem("theme");
  if (saved === "light") body.classList.add("theme-light");
  updateToggleLabel();

  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("theme-light");
    const isLight = body.classList.contains("theme-light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateToggleLabel();
  });
}

/* Archives automáticos via GitHub API */
function initArchives() {
  const root = document.getElementById("archives-root");
  if (!root) return;

  const tabsContainer = document.getElementById("archives-tabs");
  const grid = document.getElementById("archives-grid");
  const emptyMsg = document.getElementById("archives-empty");
  const errorMsg = document.getElementById("archives-error");

  const GITHUB_USER = "xoxpto";

  /* Categorias definidas por ti */
  const CATEGORIES = [
    { key: "devops", label: "DevOps" },
    { key: "gamedev", label: "GameDev" },
    { key: "3d", label: "3D & Design" },
    { key: "security", label: "CyberSecurity" },
  ];

  /* Funções para identificar a categoria de cada repo */
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
    currentCategory: "devops",
  };

  /* Iniciar arrays vazios para cada categoria */
  CATEGORIES.forEach((cat) => (state.byCategory[cat.key] = []));

  /* Criar tabs */
  createTabs();
  fetchRepos();

  function createTabs() {
    tabsContainer.innerHTML = "";

    CATEGORIES.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = "tab-button";
      btn.dataset.category = cat.key;
      btn.textContent = cat.label;

      if (index === 0) {
        btn.classList.add("active");
        state.currentCategory = cat.key;
      }

      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach((b) => {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        state.currentCategory = cat.key;
        renderCategory();
      });

      tabsContainer.appendChild(btn);
    });
  }

  async function fetchRepos() {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=desc`;

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) throw new Error("GitHub API error");

      const repos = await response.json();

      state.repos = repos.filter((r) => !r.fork);

      /* Classificação por categoria */
      state.repos.forEach((repo) => {
        Object.keys(categoryMatchers).forEach((key) => {
          if (categoryMatchers[key](repo)) {
            state.byCategory[key].push(repo);
          }
        });
      });

      /* Ordenar cada categoria por data */
      Object.keys(state.byCategory).forEach((key) => {
        state.byCategory[key].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      renderCategory();
    } catch (err) {
      console.error("Erro ao carregar repositórios:", err);
      errorMsg.hidden = false;
    }
  }

  function renderCategory() {
    const key = state.currentCategory;
    const repos = state.byCategory[key] || [];

    grid.innerHTML = "";

    if (!repos.length) {
      emptyMsg.hidden = false;
      return;
    }

    emptyMsg.hidden = true;

    repos.forEach((repo) => {
      const created = new Date(repo.created_at);
      const dateStr = created.toLocaleDateString("pt-PT", {
        year: "numeric",
        month: "short",
      });

      const desc =
        repo.description ||
        "Este repositório ainda não tem descrição. (A atualizar em breve.)";

      const card = document.createElement("article");
      card.className = "archive-card";

      card.innerHTML = `
        <div class="archive-card-header">
          <h2>${repo.name}</h2>
          <span class="archive-date">${dateStr}</span>
        </div>
        <p class="archive-desc">${desc}</p>
        <a href="${repo.html_url}" target="_blank" class="archive-link">Ver no GitHub →</a>
      `;

      grid.appendChild(card);
    });
  }
}
