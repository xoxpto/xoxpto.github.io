/* =========================================================
   CONFIG
========================================================= */
const GITHUB_USERNAME = "xoxpto";

/* =========================================================
   THEME TOGGLE
========================================================= */
const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    });
}

// Load saved theme on page load
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}

/* =========================================================
   SIDEBAR ACTIVE LINK
========================================================= */
function setActiveSidebarLink() {
    const page = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-item");

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && page === href) {
            link.classList.add("active");
        }
    });
}

setActiveSidebarLink();

/* =========================================================
   FETCH REPOS FROM GITHUB
========================================================= */
async function fetchRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar repositórios:", error);
        return [];
    }
}

/* =========================================================
   CATEGORY DETECTION
========================================================= */
function detectCategory(repo) {
    const name = repo.name.toLowerCase();
    const desc = (repo.description || "").toLowerCase();

    if (name.includes("devops") || desc.includes("automation") || desc.includes("powershell")) return "DevOps";
    if (name.includes("game") || desc.includes("game")) return "GameDev";
    if (name.includes("3d") || desc.includes("blender")) return "3D & Design";
    if (name.includes("cyber") || desc.includes("security")) return "CyberSecurity";

    return "Outros";
}

/* =========================================================
   TAG DETECTION
========================================================= */
function detectTags(repo) {
    const tags = [];
    const name = repo.name.toLowerCase();
    const desc = (repo.description || "").toLowerCase();

    if (repo.language) tags.push(repo.language);

    if (name.includes("powershell")) tags.push("PowerShell");
    if (name.includes("python")) tags.push("Python");
    if (name.includes("3d") || name.includes("blender")) tags.push("3D");
    if (name.includes("game")) tags.push("Game");
    if (name.includes("js") || name.includes("javascript")) tags.push("JavaScript");

    return [...new Set(tags)];
}

/* =========================================================
   RENDER ARCHIVE PAGE
========================================================= */
async function loadArchive() {
    const container = document.getElementById("archive-list");
    if (!container) return;

    const repos = await fetchRepos();

    const categorizedRepos = repos.map(repo => ({
        name: repo.name,
        description: repo.description || "Sem descrição.",
        url: repo.html_url,
        language: repo.language,
        category: detectCategory(repo),
        tags: detectTags(repo)
    }));

    window.allRepos = categorizedRepos;

    renderArchive(categorizedRepos);
    setupArchiveFilters();
}

function renderArchive(list) {
    const container = document.getElementById("archive-list");
    if (!container) return;

    container.innerHTML = "";

    list.forEach(repo => {
        const card = document.createElement("div");
        card.classList.add("project-card");

        card.innerHTML = `
            <div class="project-header">
                <h3>${repo.name}</h3>
                <span class="tag">${repo.tags[0] || repo.category}</span>
            </div>
            <p>${repo.description}</p>
            <a href="${repo.url}" target="_blank" class="project-link">Ver no GitHub →</a>
        `;

        container.appendChild(card);
    });
}

/* =========================================================
   ARCHIVE FILTERS
========================================================= */
function setupArchiveFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.dataset.category;

            if (category === "all") {
                renderArchive(window.allRepos);
            } else {
                const filtered = window.allRepos.filter(r => r.category === category);
                renderArchive(filtered);
            }
        });
    });
}

/* =========================================================
   TAGS PAGE
========================================================= */
async function loadTagsPage() {
    const cloud = document.getElementById("tags-cloud");
    const listContainer = document.getElementById("tag-results");

    if (!cloud || !listContainer) return;

    const repos = await fetchRepos();
    const tagMap = {};

    repos.forEach(repo => {
        const detectedTags = detectTags(repo);
        detectedTags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push(repo);
        });
    });

    Object.keys(tagMap).forEach(tag => {
        const chip = document.createElement("span");
        chip.classList.add("tag-chip");
        chip.textContent = tag;

        chip.addEventListener("click", () => {
            document.querySelectorAll(".tag-chip").forEach(t => t.classList.remove("active"));
            chip.classList.add("active");

            renderTagResults(tagMap[tag], listContainer);
        });

        cloud.appendChild(chip);
    });
}

function renderTagResults(repos, container) {
    container.innerHTML = "";

    repos.forEach(repo => {
        const card = document.createElement("div");
        card.classList.add("project-card");

        card.innerHTML = `
            <div class="project-header">
                <h3>${repo.name}</h3>
                <span class="tag">${repo.language || "Tag"}</span>
            </div>
            <p>${repo.description || "Sem descrição."}</p>
            <a href="${repo.html_url}" target="_blank" class="project-link">Ver no GitHub →</a>
        `;

        container.appendChild(card);
    });
}

/* =========================================================
   PAGE ROUTER
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadArchive();
    loadTagsPage();
});
