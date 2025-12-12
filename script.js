document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initGitHubSections();
  initHamburgerMenu();
  initActiveNav();

  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ================= THEME TOGGLE ================== */
function initThemeToggle() {
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");

  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    body.classList.add("light");
  }

  updateToggleIcon();

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    localStorage.setItem(
      "theme",
      body.classList.contains("light") ? "light" : "dark"
    );
    updateToggleIcon();
    if (window.lucide) {
      lucide.createIcons();
    }
  });

  function updateToggleIcon() {
    if (!toggle) return;
    const icon = toggle.querySelector("i");
    if (!icon) return;
    const isLight = body.classList.contains("light");
    icon.setAttribute("data-lucide", isLight ? "sun" : "moon");
  }
}

/* ================= HAMBURGER MENU ================== */
function initHamburgerMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuToggle.classList.toggle("active");
  });

  // fechar ao clicar num item (mobile)
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 880) {
        sidebar.classList.remove("open");
        menuToggle.classList.remove("active");
      }
    });
  });
}

/* ================= NAV ATIVA AUTOMÁTICA ================== */
function initActiveNav() {
  const current =
    window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-item").forEach(item => {
    const href = item.getAttribute("href");
    if (href === current) {
      item.classList.add("active");
    }
  });
}

/* ================= GITHUB (ARCHIVE + TAGS) ================== */
function initGitHubSections() {
  const archiveContainer = document.getElementById("repos-archive");
  const filters = document.querySelectorAll(".filter-btn");
  const tagsCloud = document.getElementById("tags-cloud");
  const tagResults = document.getElementById("tag-results");

  if (!archiveContainer && !tagsCloud) return;

  fetch("https://api.github.com/users/xoxpto/repos?per_page=100&sort=updated")
    .then(res => res.json())
    .then(repos => {
      const enriched = repos.map(r => ({
        raw: r,
        area: classifyRepo(r),
        tags: buildTags(r)
      }));

      if (archiveContainer) {
        setupArchive(archiveContainer, filters, enriched);
      }
      if (tagsCloud && tagResults) {
        setupTags(tagsCloud, tagResults, enriched);
      }
    })
    .catch(err => {
      console.error("Erro ao carregar repositórios do GitHub", err);
      if (archiveContainer) {
        archiveContainer.innerHTML =
          '<p class="muted">Não foi possível carregar os repositórios de momento.</p>';
      }
    });
}

function classifyRepo(repo) {
  const name = (repo.name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();

  if (name.includes("pipeline") || name.includes("devops") || desc.includes("devops")) return "DevOps";
  if (name.includes("game") || desc.includes("game")) return "GameDev";
  if (name.includes("3d") || name.includes("blender") || desc.includes("3d")) return "3D & Design";
  if (name.includes("cyber") || desc.includes("security") || desc.includes("ctf")) return "CyberSecurity";

  return "Outros";
}

function buildTags(repo) {
  const tags = new Set();
  const name = (repo.name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();

  if (repo.language) tags.add(repo.language);
  if (name.includes("python") || desc.includes("python")) tags.add("Python");
  if (name.includes("powershell") || desc.includes("powershell")) tags.add("PowerShell");
  if (name.includes("script")) tags.add("Automation");
  if (name.includes("js") || name.includes("javascript")) tags.add("JavaScript");
  if (name.includes("blender")) tags.add("3D");
  if (name.includes("game")) tags.add("GameDev");

  return Array.from(tags);
}

/* --------------- Archive --------------- */
function setupArchive(container, filters, repos) {
  function render(area) {
    const list =
      area && area !== "all"
        ? repos.filter(r => r.area === area)
        : repos;

    if (!list.length) {
      container.innerHTML =
        '<p class="muted">Ainda não tenho repositórios nesta categoria.</p>';
      return;
    }

    container.innerHTML = list.map(r => {
      const repo = r.raw;
      const updated = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString("pt-PT")
        : "";
      return `
        <article class="repo-card">
          <header class="repo-header">
            <h2>${repo.name}</h2>
            <span class="badge">${r.area}</span>
          </header>
          <p class="repo-description">${repo.description || "Sem descrição."}</p>
          <footer class="repo-footer">
            <a href="${repo.html_url}" target="_blank" class="project-link">
              Ver no GitHub →
            </a>
            <span class="repo-date">${updated}</span>
          </footer>
        </article>
      `;
    }).join("");
  }

  render("all");

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.area || "all");
    });
  });
}

/* --------------- Tags --------------- */
function setupTags(cloud, results, repos) {
  const tagMap = new Map();

  repos.forEach(r => {
    r.tags.forEach(t => {
      if (!tagMap.has(t)) tagMap.set(t, []);
      tagMap.get(t).push(r);
    });
  });

  const allTags = Array.from(tagMap.keys()).sort((a, b) =>
    a.localeCompare(b)
  );

  cloud.innerHTML = allTags
    .map(t => `<button class="tag-chip" data-tag="${t}">${t}</button>`)
    .join("");

  const chips = cloud.querySelectorAll(".tag-chip");

  function renderTag(tag) {
    const list = tagMap.get(tag) || [];
    if (!list.length) {
      results.innerHTML =
        '<p class="muted">Não há projetos com esta tag.</p>';
      return;
    }

    results.innerHTML = list.map(r => {
      const repo = r.raw;
      return `
        <article class="repo-item">
          <h3>${repo.name}</h3>
          <p class="repo-description">${repo.description || "Sem descrição."}</p>
          <p class="repo-meta">
            <span class="badge badge-small">${r.area}</span>
            ${r.tags.map(t => `<span class="chip-mini">${t}</span>`).join("")}
          </p>
          <a href="${repo.html_url}" target="_blank" class="project-link">
            Ver no GitHub →
          </a>
        </article>
      `;
    }).join("");
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderTag(chip.dataset.tag);
    });
  });
}
