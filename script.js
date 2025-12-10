//------------------------------------------------------
// 1. Dark / Light Mode Toggle
//------------------------------------------------------
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('light') ? 'light' : 'dark'
    );
  });
}

//------------------------------------------------------
// 2. Atualizar ano no rodapé
//------------------------------------------------------
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

//------------------------------------------------------
// 3. Sidebar Active State
//------------------------------------------------------
const setActiveNav = () => {
  const path = window.location.pathname.split('/').pop();

  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    item.classList.toggle('active', href === path);
  });
};
setActiveNav();

//------------------------------------------------------
// 4. GitHub API — Obter Repositórios
//------------------------------------------------------
const GITHUB_USER = "xoxpto";
let cachedRepos = null;

async function fetchRepos() {
  if (cachedRepos) return cachedRepos;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos`);
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();

    cachedRepos = data.map(repo => ({
      name: repo.name,
      description: repo.description || "Sem descrição.",
      url: repo.html_url,
      language: repo.language || "Outro",
      topics: repo.topics || [],
      pushed_at: repo.pushed_at
    }));

    cachedRepos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    return cachedRepos;

  } catch (err) {
    console.error(err);
    return null;
  }
}

//------------------------------------------------------
// 5. Categoria Automática (A → B → C → …)
//------------------------------------------------------
function categorizeRepo(repo) {
  const name = repo.name.toLowerCase();
  const topics = repo.topics.map(t => t.toLowerCase());

  if (topics.includes("devops") || topics.includes("automation"))
    return "DevOps";

  if (topics.includes("game") || topics.includes("unity") || topics.includes("godot"))
    return "GameDev";

  if (topics.includes("3d") || topics.includes("design") || topics.includes("blender"))
    return "3D & Design";

  if (topics.includes("cyber") || topics.includes("security"))
    return "CyberSecurity";

  return "Outros";
}

//------------------------------------------------------
// 6. Renderizar Cards de Repositórios
//------------------------------------------------------
function renderRepoCard(repo) {
  return `
    <article class="card project-card">
      <div class="project-header">
        <h2>${repo.name}</h2>
        <span class="tag">${repo.language}</span>
      </div>

      <p>${repo.description}</p>

      <a href="${repo.url}" target="_blank"
         class="project-link">Ver no GitHub →</a>
    </article>
  `;
}

//------------------------------------------------------
// 7. PAGE: Arquivo (archives.html)
//------------------------------------------------------
async function initArchives() {
  const tabsContainer = document.getElementById("archives-tabs");
  const grid = document.getElementById("archives-grid");
  const emptyMessage = document.getElementById("archives-empty");
  const errorMessage = document.getElementById("archives-error");
  const searchInput = document.getElementById("archives-search");

  if (!tabsContainer) return; // Página errada

  const repos = await fetchRepos();
  if (!repos) {
    errorMessage.hidden = false;
    return;
  }

  // Criar categorias
  const categories = {
    "Todos": repos,
    "DevOps": repos.filter(r => categorizeRepo(r) === "DevOps"),
    "GameDev": repos.filter(r => categorizeRepo(r) === "GameDev"),
    "3D & Design": repos.filter(r => categorizeRepo(r) === "3D & Design"),
    "CyberSecurity": repos.filter(r => categorizeRepo(r) === "CyberSecurity"),
    "Outros": repos.filter(r => categorizeRepo(r) === "Outros")
  };

  // Criar abas
  Object.keys(categories).forEach((cat, index) => {
    const tab = document.createElement("button");
    tab.className = "archives-tab";
    tab.textContent = cat;
    if (index === 0) tab.classList.add("active");
    tabsContainer.appendChild(tab);

    tab.addEventListener("click", () => {
      document.querySelectorAll(".archives-tab")
        .forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      renderCategory(cat);
    });
  });

  function renderCategory(category) {
    grid.innerHTML = "";
    const active = categories[category];

    if (!active || active.length === 0) {
      emptyMessage.hidden = false;
      return;
    }

    emptyMessage.hidden = true;
    active.forEach(repo => {
      grid.innerHTML += renderRepoCard(repo);
    });
  }

  // Pesquisa
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = repos.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.description && r.description.toLowerCase().includes(query))
    );

    grid.innerHTML = "";
    if (filtered.length === 0) {
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
      filtered.forEach(repo => grid.innerHTML += renderRepoCard(repo));
    }
  });

  renderCategory("Todos");
}

//------------------------------------------------------
// 8. PAGE: Tags (tags.html)
//------------------------------------------------------
async function initTags() {
  const cloud = document.getElementById("tags-cloud");
  const results = document.getElementById("tags-results");
  const emptyMessage = document.getElementById("tags-empty");
  const errorMessage = document.getElementById("tags-error");

  if (!cloud) return; // Página errada

  const repos = await fetchRepos();
  if (!repos) {
    errorMessage.hidden = false;
    return;
  }

  // Juntar todas as tags únicas
  const allTags = new Set();
  repos.forEach(r => r.topics.forEach(t => allTags.add(t)));

  // Renderizar cloud de tags
  allTags.forEach(tag => {
    const chip = document.createElement("button");
    chip.className = "tag-chip";
    chip.textContent = tag;

    cloud.appendChild(chip);

    chip.addEventListener("click", () => {
      document.querySelectorAll(".tag-chip")
        .forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      renderTag(tag);
    });
  });

  function renderTag(tag) {
    const filtered = repos.filter(r => r.topics.includes(tag));

    results.innerHTML = "";
    if (filtered.length === 0) {
      emptyMessage.hidden = false;
      return;
    }

    emptyMessage.hidden = true;
    filtered.forEach(repo => {
      results.innerHTML += renderRepoCard(repo);
    });
  }

  // Se tiver ?tag= na URL
  const urlTag = new URLSearchParams(window.location.search).get("tag");
  if (urlTag && allTags.has(urlTag)) {
    const targetChip = [...cloud.children].find(c => c.textContent === urlTag);
    if (targetChip) targetChip.click();
  }
}

//------------------------------------------------------
// 9. Inicialização global
//------------------------------------------------------
initArchives();
initTags();
