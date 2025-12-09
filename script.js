document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavActive();
  initThemeToggle();
  initArchives();
  initTagsPage();
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
  if (!themeToggleBtn) return;

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

/* ARCHIVES automáticos via GitHub API */
function initArchives() {
  const root = document.getElementById("archives-root");
  if (!root) return;

  const tabsContainer = document.getElementById("archives-tabs");
  const grid = document.getElementById("archives-grid");
  const emptyMsg = document.getElementById("archives-empty");
  const errorMsg = document.getElementById("archives-error");
  const searchInput = document.getElementById("archives-search");

  const GITHUB_USER = "xoxpto";

  const CATEGORIES = [
    { key: "all", label: "Todos" },
    { key: "devops", label: "DevOps" },
    { key: "gamedev", label: "GameDev" },
    { key: "3d", label: "3D & Design" },
    { key: "security", label: "CyberSecurity" },
  ];

  const categoryMatchers = {
    devops: (repo) => {
      const t = (repo.topics || []).map((x) => x.toLowerCase());
      const name = repo.name.toLowerCase();
      const lang = (repo.language || "").toLowerCase();
      return (
        t.includes("devops") ||
        t.includes("automation") ||
        t.includes("powershell") ||
        t.includes("infra") ||
        name.includes("automation") ||
        name.includes("powershell") ||
        name.includes("pipeline") ||
        lang === "powershell"
      );
    },
    gamedev: (repo) => {
      const t = (repo.topics || []).map((x) => x.toLowerCase());
      const name = repo.name.toLowerCase();
      return (
        t.includes("gamedev") ||
        t.includes("game") ||
        t.includes("js-game") ||
        name.includes("game")
      );
    },
    "3d": (repo) => {
      const t = (repo.topics || []).map((x) => x.toLowerCase());
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
      const t = (repo.topics || []).map((x) => x.toLowerCase());
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
    currentCategory: "all",
    searchQuery: "",
  };

  async function fetchRepos() {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=desc`;

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
      });

      if (!response.ok) throw new Error("GitHub API error");

      const repos = await response.json();
      state.repos = repos.filter((r) => !r.fork);

      // Inicializar categorias
      CATEGORIES.forEach((cat) => (state.byCategory[cat.key] = []));

      // "Todos" recebe tudo
      state.byCategory["all"] = [...state.repos];

      // Classificar por categorias específicas
      state.repos.forEach((repo) => {
        Object.keys(categoryMatchers).forEach((key) => {
          if (categoryMatchers[key](repo)) {
            state.byCategory[key].push(repo);
          }
        });
      });

      // Ordenar por data em todas as categorias
      Object.keys(state.byCategory).forEach((key) => {
        state.byCategory[key].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      createTabs();
      setupSearch();
      renderCategory();
    } catch (err) {
      console.error("Erro ao carregar repositórios (archives):", err);
      if (errorMsg) errorMsg.hidden = false;
    }
  }

  function createTabs() {
    tabsContainer.innerHTML = "";

    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "tab-button";
      btn.dataset.category = cat.key;

      const count =
        cat.key === "all"
          ? state.repos.length
          : (state.byCategory[cat.key] || []).length;

      btn.textContent =
        count > 0 ? `${cat.label} (${count})` : `${cat.label} (0)`;

      if (cat.key === state.currentCategory) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach((b) =>
          b.classList.remove("active")
        );
        btn.classList.add("active");
        state.currentCategory = cat.key;
        renderCategory();
      });

      tabsContainer.appendChild(btn);
    });
  }

  function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      state.searchQuery = searchInput.value.trim().toLowerCase();
      renderCategory();
    });
  }

  function renderCategory() {
    grid.innerHTML = "";

    const baseRepos =
      state.currentCategory === "all"
        ? state.repos
        : state.byCategory[state.currentCategory] || [];

    let filtered = baseRepos;

    if (state.searchQuery) {
      filtered = baseRepos.filter((repo) => {
        const name = repo.name.toLowerCase();
        const desc = (repo.description || "").toLowerCase();
        return (
          name.includes(state.searchQuery) ||
          desc.includes(state.searchQuery)
        );
      });
    }

    if (!filtered.length) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }
    if (emptyMsg) emptyMsg.hidden = true;

    filtered.forEach((repo) => {
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
        <a href="${repo.html_url}" target="_blank" class="archive-link">
          Ver no GitHub →
        </a>
      `;

      grid.appendChild(card);
    });
  }

  fetchRepos();
}

/* TAGS — página de tags com cloud neon + filtro */
function initTagsPage() {
  const root = document.getElementById("tags-root");
  if (!root) return;

  const cloudEl = document.getElementById("tags-cloud");
  const resultsEl = document.getElementById("tags-results");
  const emptyMsg = document.getElementById("tags-empty");
  const errorMsg = document.getElementById("tags-error");
  const hintMsg = document.getElementById("tags-hint");

  const GITHUB_USER = "xoxpto";

  const TAGS = [
    { key: "devops", label: "DevOps" },
    { key: "automation", label: "Automation" },
    { key: "powershell", label: "PowerShell" },
    { key: "python", label: "Python" },
    { key: "javascript", label: "JavaScript" },
    { key: "gamedev", label: "GameDev" },
    { key: "game", label: "Game" },
    { key: "3d", label: "3D" },
    { key: "blender", label: "Blender" },
    { key: "cybersecurity", label: "CyberSecurity" },
    { key: "security", label: "Security" },
    { key: "project", label: "Project" },
    { key: "portfolio", label: "Portfolio" },
    { key: "school", label: "School" },
  ];

  const state = {
    repos: [],
    tagsData: {},
    currentTag: null,
  };

  TAGS.forEach((t) => {
    state.tagsData[t.key] = { label: t.label, repos: [] };
  });

  createTagCloud();
  fetchReposAndAssignTags();

  function createTagCloud() {
    cloudEl.innerHTML = "";
    TAGS.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "tag-chip";
      btn.dataset.tag = tag.key;
      btn.textContent = tag.label;

      btn.addEventListener("click", () => {
        setActiveTag(tag.key, true);
      });

      cloudEl.appendChild(btn);
    });
  }

  async function fetchReposAndAssignTags() {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=desc`;

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
      });

      if (!response.ok) throw new Error("GitHub API error");

      const repos = await response.json();
      state.repos = repos.filter((r) => !r.fork);

      state.repos.forEach((repo) => {
        const topics = (repo.topics || []).map((x) => x.toLowerCase());
        const name = repo.name.toLowerCase();
        const lang = (repo.language || "").toLowerCase();

        TAGS.forEach((tag) => {
          if (matchesTag(tag.key, topics, name, lang)) {
            state.tagsData[tag.key].repos.push(repo);
          }
        });
      });

      // Remover tags sem repos
      Object.keys(state.tagsData).forEach((key) => {
        if (state.tagsData[key].repos.length === 0) {
          const btn = cloudEl.querySelector(`[data-tag="${key}"]`);
          if (btn) btn.remove();
          delete state.tagsData[key];
        } else {
          state.tagsData[key].repos.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        }
      });

      const urlTag = new URLSearchParams(window.location.search).get("tag");
      if (urlTag && state.tagsData[urlTag]) {
        setActiveTag(urlTag, false);
      }
    } catch (err) {
      console.error("Erro ao carregar repositórios (tags):", err);
      if (errorMsg) errorMsg.hidden = false;
    }
  }

  function matchesTag(key, topics, name, lang) {
    switch (key) {
      case "devops":
        return (
          topics.includes("devops") ||
          topics.includes("automation") ||
          topics.includes("infra") ||
          name.includes("devops")
        );
      case "automation":
        return topics.includes("automation") || name.includes("automation");
      case "powershell":
        return (
          topics.includes("powershell") ||
          lang === "powershell" ||
          name.includes("powershell")
        );
      case "python":
        return topics.includes("python") || lang === "python";
      case "javascript":
        return (
          topics.includes("javascript") ||
          topics.includes("js") ||
          lang === "javascript" ||
          name.includes("js")
        );
      case "gamedev":
        return topics.includes("gamedev") || name.includes("game");
      case "game":
        return topics.includes("game") || name.includes("game");
      case "3d":
        return topics.includes("3d") || name.includes("3d");
      case "blender":
        return topics.includes("blender") || name.includes("blender");
      case "cybersecurity":
        return topics.includes("cybersecurity") || name.includes("cyber");
      case "security":
        return topics.includes("security");
      case "project":
        return topics.includes("project") || name.includes("project");
      case "portfolio":
        return topics.includes("portfolio");
      case "school":
        return (
          topics.includes("school") ||
          topics.includes("university") ||
          topics.includes("college")
        );
      default:
        return false;
    }
  }

  function setActiveTag(tagKey, updateUrl) {
    if (!state.tagsData[tagKey]) return;

    state.currentTag = tagKey;

    document.querySelectorAll(".tag-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.tag === tagKey);
    });

    if (hintMsg) hintMsg.hidden = true;

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("tag", tagKey);
      window.history.replaceState({}, "", url.toString());
    }

    renderTagResults();
  }

  function renderTagResults() {
    resultsEl.innerHTML = "";

    const data = state.tagsData[state.currentTag];
    if (!data) return;

    const repos = data.repos || [];

    if (!repos.length) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }
    if (emptyMsg) emptyMsg.hidden = true;

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
        <a href="${repo.html_url}" target="_blank" class="archive-link">
          Ver no GitHub →
        </a>
      `;

      resultsEl.appendChild(card);
    });
  }
}
