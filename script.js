document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initGitHubSections();
  initHamburgerMenu();
  initActiveNav();
  initLanguageToggle();

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
    if (window.lucide) lucide.createIcons();
  });

  function updateToggleIcon() {
    const icon = toggle.querySelector("i");
    if (!icon) return;
    icon.setAttribute(
      "data-lucide",
      body.classList.contains("light") ? "sun" : "moon"
    );
  }
}

/* ================= LANGUAGE TOGGLE ================== */
const translations = {
  en: {
    /* SIDEBAR */
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.archive": "Archive",
    "nav.tags": "Tags",
    "nav.resume": "Resume",
    "nav.contact": "Contact",
    "sidebar.quote.1": "Automate what you repeat.",
    "sidebar.quote.2": "Improve what you automate.",

    /* HOME */
    "home.title": "Technical Portfolio",
    "home.intro":
      "Computer Engineering student focused on automation, DevOps, cloud computing and technical problem solving.",

    "home.focus.title": "Current Focus",
    "home.focus.1": "Automation of systems using PowerShell and Python",
    "home.focus.2": "Foundations of DevOps, CI/CD and observability",
    "home.focus.3": "Cloud-based architectures and system integration",

    "home.areas.title": "Technical Areas",
    "home.areas.1": "DevOps and infrastructure automation",
    "home.areas.2": "Cloud computing and system administration",
    "home.areas.3": "CyberSecurity fundamentals and tooling",

    "home.stack.title": "Tools & Technologies",
    "home.stack.1": "PowerShell, Python and JavaScript",
    "home.stack.2": "Azure, Active Directory and Linux",
    "home.stack.3": "Git, CI/CD pipelines and monitoring",

    "home.cta.projects": "View Projects",
    "home.cta.about": "About Me",

    /* ABOUT */
    "about.title": "About",
    "about.intro":
      "Overview of my background, technical interests and professional goals.",

    "about.profile.title": "Profile",
    "about.profile.text":
      "Computer Engineering student with a strong interest in automation, DevOps practices and cloud-based systems. Focused on building efficient, maintainable and scalable technical solutions.",

    "about.skills.title": "Technical Skills",
    "about.skills.1": "PowerShell and Python scripting for automation",
    "about.skills.2": "Active Directory, Azure AD and identity management",
    "about.skills.3": "Cloud services, monitoring and log ingestion",
    "about.skills.4": "Web technologies: HTML, CSS and JavaScript",

    "about.goals.title": "Professional Goals",
    "about.goals.text":
      "To continue developing technical expertise in DevOps and cloud engineering, while building real-world projects that reinforce automation, reliability and security best practices.",

    /* PROJECTS */
    "projects.title": "Featured Projects",
    "projects.intro.1":
      "Here are a few projects I want to highlight. To see all public repositories, check the ",
    "projects.intro.archive": "Archive",
    "projects.intro.2": ".",

    "projects.card1.title": "PowerShell Automation Scripts",
    "projects.card1.text":
      "Project focused on automating administrative and operational tasks using PowerShell.",

    "projects.card2.title": "Python Tooling",
    "projects.card2.text":
      "A Python-based tool for automation and data organization, created for hands-on learning.",

    "projects.card3.title": "3D Experiments",
    "projects.card3.text":
      "Exploration of 3D modeling and rendering in Blender, with a visual focus.",

    "projects.card.link": "View on GitHub →",

    /* ARCHIVE */
    "archive.title": "Archive",
    "archive.intro":
      "All my public GitHub repositories organized by technical area.",
    "archive.filters.all": "All",
    "archive.filters.devops": "DevOps",
    "archive.filters.gamedev": "GameDev",
    "archive.filters.3d": "3D & Design",
    "archive.filters.cyber": "CyberSecurity",
    "archive.filters.other": "Other",

    /*TAGS*/
    "tags.title": "Tags",
    "tags.intro": "Browse projects by technology and topic",

    /* RESUME */
    "resume.title": "Resume",
    "resume.intro":
      "A concise overview of my academic background and current technical focus, intended as a reference for recruiters and technical professionals.",
    
    "resume.education.title": "Education",
    
    "resume.education.1.period": "2023 — Present",
    "resume.education.1.title": "Bachelor’s Degree in Computer Engineering",
    "resume.education.1.detail": "Universidade Autónoma de Lisboa",
    
    "resume.education.2.period": "Secondary Education",
    "resume.education.2.title": "Science and Technology Track",
    "resume.education.2.detail": "Completed (12th grade)",
    
    "resume.focus.title": "Current Focus",
    
    "resume.focus.1": "Automation and scripting with PowerShell and Python",
    "resume.focus.2": "DevOps fundamentals, CI/CD pipelines and observability",
    "resume.focus.3": "Cloud computing and system administration",
    "resume.focus.4": "Security fundamentals and operational best practices",


    /* GENERIC */
    "generic.githubLink": "View on GitHub →"
  },

  pt: {
    /* SIDEBAR */
    "nav.home": "Início",
    "nav.projects": "Projetos",
    "nav.about": "Sobre",
    "nav.archive": "Arquivo",
    "nav.tags": "Tags",
    "nav.resume": "Currículo",
    "nav.contact": "Contactos",
    "sidebar.quote.1": "Automatiza o que repetes.",
    "sidebar.quote.2": "Melhora o que automatizas.",

    /* HOME */
    "home.title": "Portefólio Técnico",
    "home.intro":
      "Estudante de Engenharia Informática com foco em automação, DevOps, cloud computing e resolução de problemas técnicos.",

    "home.focus.title": "Foco Atual",
    "home.focus.1": "Automação de sistemas com PowerShell e Python",
    "home.focus.2": "Fundamentos de DevOps, CI/CD e observabilidade",
    "home.focus.3": "Arquiteturas cloud e integração de sistemas",

    "home.areas.title": "Áreas Técnicas",
    "home.areas.1": "DevOps e automação de infraestrutura",
    "home.areas.2": "Cloud computing e administração de sistemas",
    "home.areas.3": "Fundamentos de CyberSecurity e ferramentas",

    "home.stack.title": "Ferramentas & Tecnologias",
    "home.stack.1": "PowerShell, Python e JavaScript",
    "home.stack.2": "Azure, Active Directory e Linux",
    "home.stack.3": "Git, pipelines CI/CD e monitorização",

    "home.cta.projects": "Ver Projetos",
    "home.cta.about": "Sobre Mim",

    /* ABOUT */
    "about.title": "Sobre",
    "about.intro":
      "Resumo do meu percurso, interesses técnicos e objetivos profissionais.",

    "about.profile.title": "Perfil",
    "about.profile.text":
      "Estudante de Engenharia Informática com forte interesse em automação, práticas de DevOps e sistemas cloud. Focado no desenvolvimento de soluções técnicas eficientes, escaláveis e sustentáveis.",

    "about.skills.title": "Competências Técnicas",
    "about.skills.1": "Automação e scripting com PowerShell e Python",
    "about.skills.2": "Active Directory, Azure AD e gestão de identidades",
    "about.skills.3": "Serviços cloud, monitorização e ingestão de logs",
    "about.skills.4": "Tecnologias web: HTML, CSS e JavaScript",

    "about.goals.title": "Objetivos Profissionais",
    "about.goals.text":
      "Continuar a desenvolver competências em DevOps e engenharia cloud, através da criação de projetos práticos que reforcem automação, fiabilidade e boas práticas de segurança.",

    /* PROJECTS */
    "projects.title": "Projetos em Destaque",
    "projects.intro.1":
      "Aqui junto alguns projetos que quero destacar. Para ver todos os repositórios públicos, consulta o ",
    "projects.intro.archive": "Arquivo",
    "projects.intro.2": ".",

    "projects.card1.title": "Scripts de Automação PowerShell",
    "projects.card1.text":
      "Projeto focado na automatização de tarefas administrativas e operacionais com PowerShell.",

    "projects.card2.title": "Ferramentas em Python",
    "projects.card2.text":
      "Ferramenta em Python para automação e organização de dados, criada para aprendizagem prática.",

    "projects.card3.title": "Experiências 3D",
    "projects.card3.text":
      "Exploração de modelação e renderização 3D em Blender, com foco visual.",

    "projects.card.link": "Ver no GitHub →",

    /* ARCHIVE */
    "archive.title": "Arquivo",
    "archive.intro":
      "Aqui encontras todos os meus repositórios públicos do GitHub organizados por área.",
    "archive.filters.all": "Todos",
    "archive.filters.devops": "DevOps",
    "archive.filters.gamedev": "GameDev",
    "archive.filters.3d": "3D & Design",
    "archive.filters.cyber": "CyberSecurity",
    "archive.filters.other": "Outros",

    /*TAGS*/
    "tags.title": "Tags",
    "tags.intro": "Explora os projetos por tecnologia e tema.",
        
    /* RESUME */
    "resume.title": "Currículo",
    "resume.intro":
      "Resumo do meu percurso académico e do foco técnico atual, pensado como referência para recrutadores e profissionais da área.",
    
    "resume.education.title": "Formação Académica",
    
    "resume.education.1.period": "2023 — Presente",
    "resume.education.1.title": "Licenciatura em Engenharia Informática",
    "resume.education.1.detail": "Universidade Autónoma de Lisboa",
    
    "resume.education.2.period": "Ensino Secundário",
    "resume.education.2.title": "Área de Ciências e Tecnologias",
    "resume.education.2.detail": "Concluído (12.º ano)",
    
    "resume.focus.title": "Foco Atual",
    
    "resume.focus.1": "Automação e scripting com PowerShell e Python",
    "resume.focus.2": "Fundamentos de DevOps, pipelines CI/CD e observabilidade",
    "resume.focus.3": "Cloud computing e administração de sistemas",
    "resume.focus.4": "Fundamentos de segurança e boas práticas operacionais",

    /* GENERIC */
    "generic.githubLink": "Ver no GitHub →"
  }
};

function initLanguageToggle() {
  // aplica sempre no load
  let lang = localStorage.getItem("lang") || "en";
  applyLanguage(lang);

  const langBtn = document.getElementById("lang-toggle");
  if (!langBtn) return;

  langBtn.textContent = lang === "en" ? "🇬🇧" : "🇵🇹";

  langBtn.addEventListener("click", () => {
    lang = lang === "en" ? "pt" : "en";
    localStorage.setItem("lang", lang);
    langBtn.textContent = lang === "en" ? "🇬🇧" : "🇵🇹";
    applyLanguage(lang);

    // re-render de secções geradas via JS (para atualizar textos tipo "Ver no GitHub")
    rerenderDynamicSections();

    if (window.lucide) lucide.createIcons();
  });
}

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function t(key) {
  const lang = getLang();
  return (translations[lang] && translations[lang][key]) ? translations[lang][key] : null;
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
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    const href = item.getAttribute("href");
    if (href === current) {
      item.classList.add("active");
    }
  });
}

/* ================= GITHUB (ARCHIVE + TAGS) ================== */
let __cachedRepos = null; // cache para re-render na troca de língua

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

      __cachedRepos = enriched;

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

function rerenderDynamicSections() {
  const archiveContainer = document.getElementById("repos-archive");
  const filters = document.querySelectorAll(".filter-btn");
  const tagsCloud = document.getElementById("tags-cloud");
  const tagResults = document.getElementById("tag-results");

  if (!__cachedRepos) return;

  if (archiveContainer) setupArchive(archiveContainer, filters, __cachedRepos);
  if (tagsCloud && tagResults) setupTags(tagsCloud, tagResults, __cachedRepos);
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

    const linkText = t("generic.githubLink") || "Ver no GitHub →";

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
              ${linkText}
            </a>
            <span class="repo-date">${updated}</span>
          </footer>
        </article>
      `;
    }).join("");
  }

  render("all");

  // evita duplicar listeners ao re-render
  if (filters && filters.length) {
    filters.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });
  }

  const freshFilters = document.querySelectorAll(".filter-btn");
  freshFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      freshFilters.forEach(b => b.classList.remove("active"));
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
    .map(tg => `<button class="tag-chip" data-tag="${tg}">${tg}</button>`)
    .join("");

  const chips = cloud.querySelectorAll(".tag-chip");

  const linkText = t("generic.githubLink") || "Ver no GitHub →";

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
            ${r.tags.map(tg => `<span class="chip-mini">${tg}</span>`).join("")}
          </p>
          <a href="${repo.html_url}" target="_blank" class="project-link">
            ${linkText}
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
