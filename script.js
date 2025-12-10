// =========================
// CONFIG
// =========================
const GITHUB_USERNAME = "xoxpto";

// Palavras-chave para categorizar repositórios
const CATEGORY_RULES = {
  DevOps: ["devops", "cicd", "ci/cd", "ci-cd", "pipeline", "automation", "powershell", "azure"],
  GameDev: ["game", "unity", "godot"],
  "3D & Design": ["3d", "blender", "render"],
  CyberSecurity: ["cyber", "security", "hacking", "ctf", "tryhackme"],
};

// Cache de repositórios em memória
let reposCache = null;

// =========================
// TEMA (dark / light)
// =========================
function updateThemeIcon(btn) {
  const icon = btn.querySelector("i");
  if (!icon) return;
  const isLight = document.body.classList.contains("light");
  icon.className = isLight ? "lucide lucide-sun" : "lucide lucide-moon";
}

function setupThemeToggle() {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  // Carregar preferência guardada
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
  }
  updateThemeIcon(btn);

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon(btn);
  });
}

// =========================
 // GITHUB API
// =========================
async function fetchRepos() {
  if (reposCache) return reposCache;

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Falha ao obter repositórios:", res.status);
    return [];
  }
  const data = await res.json();
  reposCache = data;
  return data;
}

function getCategoryForRepo(repo) {
  const text = `${repo.name ?? ""} ${repo.description ?? ""}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return "Outros";
}

function getTagsForRepo(repo) {
  const tags = [];
  if (repo.language) tags.push(repo.language);

  const text = `${repo.name ?? ""} ${repo.description ?? ""}`.toLowerCase();

  if (text.includes("powershell")) tags.push("PowerShell");
  if (text.includes("python")) tags.push("Python");
  if (text.includes("javascript") || text.includes("js")) tags.push("JavaScript");
  if (text.includes("blender") || text.includes("3d")) tags.push("3D");
  if (text.includes("game")) tags.push("GameDev");
  if (text.includes("autom") || text.includes("script")) tags.push("Automation");
  if (text.includes("devops") || text.includes("cicd") || text.includes("ci/cd")) tags.push("DevOps");

  // Tag genérica
  tags.push("Project");

  // Remover duplicados
  return [...new Set(tags)];
}

function createRepoCard(repo, extraBadge) {
  const category = getCategoryForRepo(repo);
  const language = repo.language || category || "Repo";

  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.category = category;

  card.innerHTML = `
    <div class="project-header">
      <h2 class="project-title">${repo.name}</h2>
      <span class="project-tag">${extraBadge || language}</span>
    </div>
    <p class="project-desc">
      ${repo.description || "Sem descrição."}
    </p>
    <a href="${repo.html_url}" target="_blank" class="project-link">Ver no GitHub →</a>
  `;
  return card;
}

// =========================
// ARQUIVO
// =========================
async function initArchivePage() {
  const listEl = document.getElementById("repo-list");
  if (!listEl) return;

  const repos = await fetchRepos();
  listEl.innerHTML = "";

  repos.forEach((repo) => {
    const card = createRepoCard(repo);
    listEl.appendChild(card);
  });

  // Filtros
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      const cards = listEl.querySelectorAll(".project-card");
      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === "all" || filter === cat) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// =========================
// TAGS
// =========================
async function initTagsPage() {
  const cloudEl = document.getElementById("tag-cloud");
  const resultsEl = document.getElementById("tag-results");
  if (!cloudEl || !resultsEl) return;

  const repos = await fetchRepos();

  const tagMap = new Map(); // tag -> [repos]

  repos.forEach((repo) => {
    const repoTags = getTagsForRepo(repo);
    repoTags.forEach((tag) => {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag).push(repo);
    });
  });

  cloudEl.innerHTML = "";
  resultsEl.innerHTML = "";

  // Criar chips de tags
  tagMap.forEach((repoList, tag) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "tag-chip";
    chip.textContent = tag;
    chip.dataset.tag = tag;

    chip.addEventListener("click", () => {
      // estado active
      cloudEl.querySelectorAll(".tag-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      // render resultados
      resultsEl.innerHTML = "";
      repoList.forEach((repo) => {
        const card = createRepoCard(repo, tag);
        resultsEl.appendChild(card);
      });
    });

    cloudEl.appendChild(chip);
  });

  // Dica / texto inicial
  const hint = document.querySelector(".tag-hint");
  if (hint) {
    hint.textContent = "Seleciona uma tag para ver os projetos relacionados.";
  }
}

// =========================
// DOM ready
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  initArchivePage();
  initTagsPage();
});
