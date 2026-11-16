// Renders the project list from projects.json.
// To add a project, add an entry to projects.json and its images to images/projects/.

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small helper for building elements without innerHTML
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "text") node.textContent = value;
    else if (key === "className") node.className = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

function renderCover(project) {
  if (!project.cover) {
    return el("div", { className: "project-cover project-cover--empty" }, [
      el("div", {}, [
        el("p", { className: "cover-placeholder-title", text: project.title }),
        el("p", { className: "cover-placeholder-note", text: "Screenshots coming soon" })
      ])
    ]);
  }
  const style = project.coverStyle === "phone" ? " project-cover--phone" : "";
  return el("div", { className: "project-cover" + style }, [
    el("img", { src: project.cover.src, alt: project.cover.alt, loading: "lazy" })
  ]);
}

function renderMediaItem(item) {
  let media;
  if (item.type === "video") {
    media = el("video", {
      src: item.src,
      poster: item.poster,
      muted: true,
      loop: true,
      playsinline: true,
      preload: "none",
      controls: prefersReducedMotion,
      "aria-label": item.alt
    });
    media.muted = true;
  } else {
    media = el("img", { src: item.src, alt: item.alt, loading: "lazy" });
  }
  return el("figure", {}, [media, item.caption ? el("figcaption", { text: item.caption }) : null]);
}

function renderBlock(title, content) {
  return el("div", { className: "case-block" }, [el("h4", { text: title }), ...[].concat(content)]);
}

function renderList(items) {
  return el("ul", {}, items.map((text) => el("li", { text })));
}

function renderCaseStudy(project, id) {
  const columns = el("div", { className: "case-columns" }, [
    renderBlock("Overview", el("p", { text: project.overview })),
    renderBlock("Why it matters", el("p", { text: project.problem })),
    renderBlock("What I did", [
      renderList(project.contributions),
      project.teamNote ? el("p", { className: "team-note", text: project.teamNote }) : null
    ]),
    project.highlights ? renderBlock(project.highlights.title, renderList(project.highlights.items)) : null,
    renderBlock("What I took away", el("p", { text: project.learned }))
  ]);

  const parts = [columns];

  if (project.media && project.media.length) {
    const galleryClass = "gallery" + (project.galleryStyle ? " gallery--" + project.galleryStyle : "");
    parts.unshift(el("div", { className: galleryClass }, project.media.map(renderMediaItem)));
  }

  return el("div", { className: "case-study", id, hidden: true }, parts);
}

function renderProject(project) {
  const caseId = "case-" + project.id;

  const toggle = el("button", {
    className: "btn btn-primary",
    type: "button",
    "aria-expanded": "false",
    "aria-controls": caseId
  }, [document.createTextNode("Read the case study"), el("span", { className: "toggle-icon", "aria-hidden": "true", text: "+" })]);

  const links = (project.links || []).map((link) =>
    el("a", { className: "btn btn-ghost", href: link.url, target: "_blank", rel: "noopener", text: link.label })
  );

  const body = el("div", { className: "project-body" }, [
    el("p", { className: "project-kind", text: project.kind }),
    el("h3", { className: "project-title", text: project.title }),
    el("p", { className: "project-meta" }, [
      el("span", { text: project.context }),
      el("span", { text: "Role: " + project.role })
    ]),
    el("p", { className: "project-summary", text: project.summary }),
    el("ul", { className: "tech-list", "aria-label": "Technologies used" }, project.tech.map((t) => el("li", { text: t }))),
    el("div", { className: "project-actions" }, [toggle, ...links])
  ]);

  const caseStudy = renderCaseStudy(project, caseId);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.firstChild.textContent = open ? "Read the case study" : "Hide the case study";
    caseStudy.hidden = open;
    caseStudy.querySelectorAll("video").forEach((video) => {
      if (open) video.pause();
      else if (!prefersReducedMotion) video.play().catch(() => {});
    });
  });

  return el("article", { className: "project", "aria-labelledby": "title-" + project.id }, [
    el("div", { className: "project-main" }, [renderCover(project), body]),
    caseStudy
  ]);
}

async function loadProjects() {
  const list = document.getElementById("project-list");
  const status = document.getElementById("project-status");
  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error(response.status);
    const projects = await response.json();
    status.remove();
    projects.forEach((project) => {
      const article = renderProject(project);
      article.querySelector(".project-title").id = "title-" + project.id;
      list.append(article);
    });
  } catch (error) {
    status.textContent = "Projects couldn't load. Refresh the page to try again.";
  }
}

// Hide resume links until resume.pdf exists in /documents
async function checkResume() {
  try {
    const response = await fetch("documents/resume.pdf", { method: "HEAD" });
    if (response.ok) return;
  } catch (error) { /* fall through */ }
  document.querySelectorAll(".js-resume").forEach((link) => {
    (link.closest("li") || link).hidden = true;
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
loadProjects();
checkResume();
