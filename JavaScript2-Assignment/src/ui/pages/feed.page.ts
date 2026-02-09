import { getPosts } from "../../api/posts";
import type { Post } from "../../types/post.types";

function renderPostItem(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const author = post.author?.name ?? "Unknown";

  return `
    <article class="card">
      <h3>${title}</h3>
      <p class="muted">By ${author}</p>
      <p><a href="#/post/${post.id}">Open post</a></p>
    </article>
  `;
}

export function renderFeedPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container">
      <h1>Feed</h1>
      <p id="status" class="muted">Loading...</p>
      <div id="list"></div>

      <nav class="nav">
        <a href="#/profile">My profile</a> |
        <a href="#/login">Login</a>
      </nav>
    </div>
  `;

  const statusEl = container.querySelector<HTMLParagraphElement>("#status");
  const listEl = container.querySelector<HTMLDivElement>("#list");
  if (!statusEl || !listEl) return;

  (async () => {
    try {
      const res = await getPosts();
      statusEl.textContent = "";
      listEl.innerHTML = res.data.map(renderPostItem).join("");
    } catch (err) {
      statusEl.textContent = err instanceof Error ? err.message : "Failed to load";
    }
  })();
}
