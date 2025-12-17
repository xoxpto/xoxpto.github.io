document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initGitHubSections();
  initHamburgerMenu();
  initActiveNav();
  initLanguageToggle();
  initRevealAnimations(); 

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

    /* CONTACT */
    "contact.title": "Contact",
    "contact.intro":
      "For professional inquiries, project collaboration or technical opportunities, these are the preferred contact channels.",
    
    "contact.direct.title": "Direct Contacts",
    
    "contact.email.label": "Email",
    "contact.linkedin.label": "LinkedIn",
    "contact.github.label": "GitHub",
    
    "contact.note.title": "Note",
    "contact.note.text":
      "This website does not currently provide a backend contact form. Please get in touch via email or LinkedIn. Messages are answered whenever possible.",
    
    /* RESUME — EXPERIENCE */
    "resume.experience.title": "Professional Experience",
    
    "resume.experience.1.title": "Teaching Assistant Internship (120 hours)",
    "resume.experience.1.place":
      "Agrupamento de Escolas Rainha Dona Leonor — Lisbon",
    "resume.experience.1.task1":
      "Computer science teaching support for 2nd-year classes (including special education)",
    "resume.experience.1.task2":
      "IT technical support across multiple school facilities",
    
    "resume.experience.2.title":
      "IT Technician — Internship (480 hours)",
    "resume.experience.2.place":
      "Assembly of the Republic — Lisbon",
    "resume.experience.2.task1":
      "Maintenance and technical support of computer equipment",
    "resume.experience.2.task2":
      "Support in internal systems and development projects",
    
    /* RESUME — LANGUAGES */
    "resume.languages.title": "Languages",
    
    "resume.languages.pt": "Portuguese: Native",
    "resume.languages.en": "English: C1 (comprehension), B2 (production)",
    "resume.languages.es": "Spanish: B2 / B1",
    "resume.languages.jp": "Japanese: A1",
    
    /* RESUME — SKILLS */
    "resume.skills.title": "Technical Skills",

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
    
    /* CONTACT */
    "contact.title": "Contactos",
    "contact.intro":
      "Para questões profissionais, colaboração em projetos ou oportunidades técnicas, estes são os canais de contacto preferenciais.",
    
    "contact.direct.title": "Contactos Diretos",
    
    "contact.email.label": "Email",
    "contact.linkedin.label": "LinkedIn",
    "contact.github.label": "GitHub",
    
    "contact.note.title": "Nota",
    "contact.note.text":
      "Este site não dispõe atualmente de formulário com backend. O contacto deverá ser efetuado por email ou LinkedIn. As mensagens são respondidas sempre que possível.",
    
    /* RESUME — EXPERIENCE */
    "resume.experience.title": "Experiência Profissional",
    
    "resume.experience.1.title":
      "Estágio Curricular — Apoio à Docência (120 horas)",
    "resume.experience.1.place":
      "Agrupamento de Escolas Rainha Dona Leonor — Lisboa",
    "resume.experience.1.task1":
      "Apoio à docência de Informática em turmas do 2.º ano (incluindo educação especial)",
    "resume.experience.1.task2":
      "Suporte técnico informático em várias unidades escolares",
    
    "resume.experience.2.title":
      "Técnico de Informática — Estágio Curricular (480 horas)",
    "resume.experience.2.place":
      "Assembleia da República — Lisboa",
    "resume.experience.2.task1":
      "Manutenção e suporte técnico a equipamentos informáticos",
    "resume.experience.2.task2":
      "Apoio em sistemas internos e projetos de desenvolvimento",
    
    /* RESUME — LANGUAGES */
    "resume.languages.title": "Competências Linguísticas",
    
    "resume.languages.pt": "Português: Língua materna",
    "resume.languages.en": "Inglês: C1 (compreensão), B2 (produção)",
    "resume.languages.es": "Espanhol: B2 / B1",
    "resume.languages.jp": "Japonês: A1",
    
    /* RESUME — SKILLS */
    "resume.skills.title": "Competências Técnicas",

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
  // Se estamos no index.html, o scroll spy trata disto
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
    return;
  }

  const current = window.location.pathname.split("/").pop();

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
  const languages = new Set();
  const topics = new Set();

  const name = (repo.name || "").toLowerCase();
  const desc = (repo.description || "").toLowerCase();

  // Linguagem principal do GitHub
  if (repo.language) languages.add(repo.language);

  // Linguagens extra
  if (name.includes("python") || desc.includes("python")) languages.add("Python");
  if (name.includes("powershell") || desc.includes("powershell")) languages.add("PowerShell");
  if (name.includes("js") || name.includes("javascript")) languages.add("JavaScript");
  if (name.includes("csharp")) languages.add("C#");

  // Tópicos / áreas
  if (name.includes("script") || desc.includes("automation")) topics.add("Automation");
  if (name.includes("devops") || desc.includes("pipeline")) topics.add("DevOps");
  if (name.includes("game")) topics.add("GameDev");
  if (name.includes("blender") || desc.includes("3d")) topics.add("3D");
  if (name.includes("cyber") || desc.includes("security")) topics.add("CyberSecurity");

  return {
    languages: Array.from(languages),
    topics: Array.from(topics)
  };
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
function setupTags(languagesCloud, topicsCloud, results, repos) {
  const languageMap = new Map();
  const topicMap = new Map();

  repos.forEach(r => {
    r.tags.languages.forEach(tag => {
      if (!languageMap.has(tag)) languageMap.set(tag, []);
      languageMap.get(tag).push(r);
    });

    r.tags.topics.forEach(tag => {
      if (!topicMap.has(tag)) topicMap.set(tag, []);
      topicMap.get(tag).push(r);
    });
  });

  renderTagCloud(languagesCloud, languageMap, results, "Linguagem");
  renderTagCloud(topicsCloud, topicMap, results, "Área");
}

function renderTagCloud(container, tagMap, results, typeLabel) {
  const tags = Array.from(tagMap.keys()).sort((a, b) =>
    a.localeCompare(b)
  );

  container.innerHTML = tags
    .map(tag => `<button class="tag-chip" data-tag="${tag}">${tag}</button>`)
    .join("");

  const chips = container.querySelectorAll(".tag-chip");
  const linkText = t("generic.githubLink") || "Ver no GitHub →";

  function renderResults(tag) {
    const list = tagMap.get(tag) || [];

    results.innerHTML = `
      <p class="muted">Resultados para <strong>${tag}</strong> (${typeLabel})</p>
    ` + list.map(r => {
      const repo = r.raw;
      return `
        <article class="repo-item">
          <h3>${repo.name}</h3>
          <p class="repo-description">${repo.description || "Sem descrição."}</p>
          <p class="repo-meta">
            <span class="badge badge-small">${r.area}</span>
            ${r.tags.languages.map(t => `<span class="chip-mini">${t}</span>`).join("")}
            ${r.tags.topics.map(t => `<span class="chip-mini">${t}</span>`).join("")}
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
      document.querySelectorAll(".tag-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderResults(chip.dataset.tag);
    });
  });
}


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

// =========================================================
// ON-SCROLL REVEAL ANIMATIONS
// =========================================================
function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll(
    ".home-card, .project-card, .repo-card, .resume-item"
  );

  revealElements.forEach((el, index) => {
    el.classList.add("reveal");

    const delay = index % 3;
    el.classList.add(`reveal-delay-${delay}`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("reveal-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach(el => observer.observe(el));
}


