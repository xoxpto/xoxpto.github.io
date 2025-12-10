// =====================================================
// 0. Arranque geral quando o DOM estiver pronto
// =====================================================
window.addEventListener('DOMContentLoaded', () => {
  // Ativar ícones Lucide
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  initThemeToggle();
  updateYear();
  setActiveNav();
  initArchives();
  initTags();
});

// =====================================================
// 1. Dark / Light Mode
// =====================================================
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('light') ? 'light' : 'dark'
    );
  });
}

// =====================================================
// 2. Atualizar ano no footer
// =====================================================
function updateYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// =====================================================
// 3. Sidebar: marcar página ativa
// =====================================================
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const href = item.getAttribute('href');
    item.classList.toggle('active', href === path);
  });
}

// =====================================================
// 4. GitHub API – obter repositórios
// =====================================================
const GITHUB_USER = 'xoxpto';
let cachedRepos = null;

async function fetchRepos() {
  if (cachedRepos) return cachedRepos;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      }
    );

    if (!res.ok) throw new Error('GitHub API error');

    const data = await res.json();

    cachedRepos = data.map(repo => ({
      name: repo.name,
      description: repo.description || 'Sem descrição.',
      url: repo.html_url,
      language: repo.language || 'Outro',
      topics: repo.topics || [],
      pushed_at: repo.pushed_at
    }));

    // Ordenar por atividade recente
    cachedRepos.sort(
      (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
    );

    return cachedRepos;
  } catch (err) {
    console.error('Erro ao obter repositórios do GitHub:', err);
    return null;
  }
}

// =====================================================
// 5. Categorizar repositórios (para Arquivo)
// =====================================================
function categorizeRepo(repo) {
  const name = repo.name.toLowerCase();
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  const lang = repo.language ? repo.language.toLowerCase() : '';

  // DevOps / automação
  if (
    topics.includes('devops') ||
    topics.includes('automation') ||
    topics.includes('powershell') ||
    name.includes('devops') ||
    name.includes('automation')
  ) {
    return 'DevOps';
  }

  // GameDev
  if (
    topics.includes('gamedev') ||
    topics.includes('game') ||
    topics.includes('unity') ||
    topics.includes('godot') ||
    name.includes('game')
  ) {
    return 'GameDev';
  }

  // 3D & Design
  if (
    topics.includes('3d') ||
    topics.includes('design') ||
    topics.includes('blender') ||
    lang === 'glsl'
  ) {
    return '3D';
  }

  // CyberSecurity
  if (
    topics.includes('cyber') ||
    topics.includes('security') ||
    topics.includes('pentest') ||
    name.includes('security')
  ) {
    return 'CyberSecurity';
  }

  return 'Outros';
}

// =====================================================
// 6. Renderizar card de repositório (markup comum)
// =====================================================
function renderRepoCard(repo) {
  return `
    <article class="project-card">
      <div class="project-header">
        <h2>${repo.name}</h2>
        <span class="tag">${repo.language}</span>
      </div>
      <p>${repo.description}</p>
      <a href="${repo.url}" target="_blank" class="project-link">
        Ver no GitHub →
      </a>
    </article>
  `;
}

// =====================================================
// 7. Página: Arquivo (archives.html)
// =====================================================
async function initArchives() {
  const grid = document.getElementById('archive-projects');
  if (!grid) return; // não estamos na página certa

  const emptyMsg = document.getElementById('archive-empty');
  const filterButtons = document.querySelectorAll('.archive-filters .filter-btn');

  const repos = await fetchRepos();
  if (!repos) {
    if (emptyMsg) {
      emptyMsg.hidden = false;
      emptyMsg.textContent =
        'Não foi possível carregar os repositórios. Tenta novamente mais tarde.';
    }
    return;
  }

  function applyFilter(filter) {
    let filtered = repos;

    if (filter && filter !== 'all') {
      filtered = repos.filter(r => categorizeRepo(r) === filter);
    }

    grid.innerHTML = '';

    if (!filtered.length) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }

    if (emptyMsg) emptyMsg.hidden = true;

    filtered.forEach(repo => {
      grid.insertAdjacentHTML('beforeend', renderRepoCard(repo));
    });
  }

  // Listeners dos botões de filtro
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      applyFilter(filter);
    });
  });

  // Ativar "Todos" inicialmente
  const defaultBtn = document.querySelector(
    '.archive-filters .filter-btn[data-filter="all"]'
  );
  if (defaultBtn) {
    defaultBtn.classList.add('active');
  }

  applyFilter('all');
}

// =====================================================
// 8. Página: Tags (tags.html)
// =====================================================
async function initTags() {
  const cloud = document.getElementById('tags-cloud');
  const results = document.getElementById('tags-results');
  if (!cloud || !results) return; // não é a página de tags

  const hint = document.getElementById('tags-hint');
  const emptyMsg = document.getElementById('tags-empty');
  const errorMsg = document.getElementById('tags-error');

  const repos = await fetchRepos();
  if (!repos) {
    if (errorMsg) errorMsg.hidden = false;
    return;
  }

  // Construir lista de tags (topics + fallback em linguagem)
  const tagsSet = new Set();

  repos.forEach(r => {
    if (r.topics && r.topics.length) {
      r.topics.forEach(t => tagsSet.add(t.toLowerCase()));
    } else if (r.language) {
      tagsSet.add(r.language.toLowerCase());
    }
  });

  if (!tagsSet.size) {
    if (hint) {
      hint.textContent =
        'Ainda não há tags associadas. Em breve vou organizar isto melhor.';
    }
    return;
  }

  function renderTagResults(tag) {
    const selected = tag.toLowerCase();

    const filtered = repos.filter(r => {
      const topics = (r.topics || []).map(t => t.toLowerCase());
      const lang = r.language ? r.language.toLowerCase() : null;
      return topics.includes(selected) || lang === selected;
    });

    results.innerHTML = '';

    if (!filtered.length) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }

    if (emptyMsg) emptyMsg.hidden = true;

    filtered.forEach(repo => {
      results.insertAdjacentHTML('beforeend', renderRepoCard(repo));
    });
  }

  // Criar chips de tags
  tagsSet.forEach(tag => {
    const chip = document.createElement('button');
    chip.className = 'tag-chip';
    chip.textContent = tag;

    chip.addEventListener('click', () => {
      document
        .querySelectorAll('.tag-chip')
        .forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (hint) hint.style.display = 'none';
      renderTagResults(tag);
    });

    cloud.appendChild(chip);
  });

  // Suporte a ?tag= na URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlTag = urlParams.get('tag');
  if (urlTag && tagsSet.has(urlTag.toLowerCase())) {
    const targetChip = [...document.querySelectorAll('.tag-chip')].find(
      c => c.textContent.toLowerCase() === urlTag.toLowerCase()
    );
    if (targetChip) {
      targetChip.click();
      return;
    }
  }
}
