import { marked } from 'marked';

/**
 * SPA controller for sidebar + content
 */

const BLOG_INDEX_URL = '/assets/blogs/index.json';
const RESUME_URL = 'https://docs.google.com/document/d/1k2DykOWzGUJDyEUucN_9BKA7eyEeuJnOn75vVY4Cdjs/edit?tab=t.0';
let HOME_HTML = '';

// Helpers
function toMonthKey(dateStr) {
  // dateStr format 'YYYY-MM-DD' or 'YYYY-MM'
  const [y, m] = dateStr.split('-');
  return `${y}-${m}`;
}

function groupByMonth(posts) {
  // { 'YYYY-MM': [post, ...], ... } sorted desc by key
  const buckets = {};
  for (const p of posts) {
    if (!p?.date || !p?.title || !p?.path) continue;
    const key = toMonthKey(p.date);
    (buckets[key] ||= []).push(p);
  }
  // sort each month by date desc
  Object.values(buckets).forEach(list => list.sort((a,b) => (b.date > a.date ? 1 : -1)));
  // return entries sorted by YYYY-MM desc
  return Object.entries(buckets).sort((a,b) => (a[0] < b[0] ? 1 : -1));
}

function getRouteFromHash() {
  const raw = (window.location.hash || '').replace(/^#/, '');
  if (!raw || raw === 'home') return { type: 'home' };

  if (raw.startsWith('blog=')) {
    const qs = raw.slice('blog='.length);
    const params = new URLSearchParams(qs);
    const path = params.get('path');
    const title = params.get('title');
    if (path) return { type: 'blog', path, title: title || '' };
  }

  return { type: 'home' };
}

function setHomeRoute() {
  window.location.hash = 'home';
}

function setBlogRoute(path, title) {
  const params = new URLSearchParams();
  params.set('path', path);
  if (title) params.set('title', title);
  window.location.hash = `blog=${params.toString()}`;
}

function setActiveBlog(path) {
  const links = document.querySelectorAll('#blogs-list a[data-path]');
  links.forEach((link) => {
    const isActive = link.dataset.path === path;
    link.classList.toggle('is-active', isActive);
  });
}

function renderHome() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = HOME_HTML;
  window.scrollTo(0, 0);
}

function renderBlogsList(posts) {
  const container = document.getElementById('blogs-list');
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(posts) || posts.length === 0) {
    container.innerHTML = '<p style="opacity:0.8">No blog posts yet.</p>';
    return;
  }

  const grouped = groupByMonth(posts);
  for (const [ym, list] of grouped) {
    const section = document.createElement('section');

    const dateStamp = document.createElement('small');
    dateStamp.textContent = `— ${ym} —`; // e.g., 2025-05
    dateStamp.classList.add('datestamp');
    section.appendChild(dateStamp);

    const ul = document.createElement('ul');
    for (const post of list) {
      if (!post?.title || !post?.path) continue;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = post.title;
      a.dataset.path = post.path;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveBlog(post.path);
        setBlogRoute(post.path, post.title);
      });
      li.appendChild(a);
      ul.appendChild(li);
    }

    section.appendChild(ul);
    container.appendChild(section);
  }

  const route = getRouteFromHash();
  if (route.type === 'blog') setActiveBlog(route.path);
}

async function showBlog(mdPath, title) {
  const content = document.getElementById('content');
  if (!content) return;
  try {
    const res = await fetch(mdPath, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    const html = marked.parse(md);
    content.innerHTML = `
      <article class="blog-post">
        <h1>${title}</h1>
        ${html}
      </article>
    `;
    window.scrollTo(0, 0);
  } catch (e) {
    content.innerHTML = `<p style="color:#f88">Failed to load blog: ${title}</p>`;
  }
}

function renderProjects() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <section id="projects-host" class="projects-section">
      <iframe class="projects-frame" src="./src/portfolio.html" title="Projects"></iframe>
    </section>
  `;
  window.scrollTo(0, 0);
}
// Events + init
async function loadBlogs() {
  try {
    const res = await fetch(BLOG_INDEX_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    renderBlogsList(posts);
  } catch (e) {
    const container = document.getElementById('blogs-list');
    if (container) container.innerHTML = '<p style="color:#f88">Failed to load blogs.</p>';
    // console.error(e);
  }
}

function makeAccessibleButton(el, onActivate) {
  if (!el || typeof onActivate !== 'function') return;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.addEventListener('click', (e) => {
    e.preventDefault();
    onActivate(e);
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(e);
    }
  });
}

function wireNav() {
  const homeBtn = document.getElementById('nav-home');
  if (homeBtn) {
    makeAccessibleButton(homeBtn, () => {
      setHomeRoute();
    });
  }

  const resume = document.getElementById('nav-resume');
  if (resume) resume.setAttribute('href', RESUME_URL);

  // Handle Projects in-page
  const projects = document.getElementById('nav-projects');
  if (projects) {
    makeAccessibleButton(projects, () => {
      renderProjects();
    });
  }
}

function setSidebarForRoute(route) {
  const blogs = document.getElementById('nav-blogs');
  const socials = document.getElementById('nav-socials');
  if (!blogs || !socials) return;
  if (route.type === 'blog') {
    blogs.open = true;
    socials.open = false;
    return;
  }
  blogs.open = false;
  socials.open = true;
}

function handleRoute() {
  const route = getRouteFromHash();
  if (route.type === 'blog') {
    showBlog(route.path, route.title);
    setActiveBlog(route.path);
    setSidebarForRoute(route);
    return;
  }
  setSidebarForRoute(route);
  setActiveBlog('');
  renderHome();
}

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');
  if (content) HOME_HTML = content.innerHTML;
  wireNav();
  await loadBlogs();
  handleRoute();
});

window.addEventListener('hashchange', () => {
  handleRoute();
});
