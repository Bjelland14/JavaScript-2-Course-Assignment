import { getPosts } from "../../api/posts";
import type { Post } from "../../types/post.types";

function renderPostItem(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const body = post.body?.trim() ? post.body : "";
  const author = post.author?.name ?? "Unknown";

  return `
    <article style="border: 1px solid #ccc; padding: 12px; margin: 12px 0;">
      <h3>${title}</h3>
      <p><small>By ${author}</small></p>
      ${body ? `<p>${body}</p>` : ""}
      <p><a href="#/post/${post.id}">Open post</a></p>
    </article>
  `;
}

export async function renderFeedPage(container: HTMLElement): Promise<void> {
  container.innerHTML = `
    <h1>Feed</h1>
    <p id="feed-status">Loading posts...</p(>
    <div id="feed-list"></div>

    <nav style="margin-top: 16px;">
      <a href="#/profile">My profile</a> |
      <a href="#/login">To Login</a>
    </nav>
  `;

  const statusEl = container.querySelector<HTMLParagraphElement>("#feed-status");
  const listEl = container.querySelector<HTMLDivElement>("#feed-list");

  if (!statusEl || !listEl) return;

  try {
    const result = await getPosts();
    const posts = result.data;

    if (posts.length === 0) {
      statusEl.textContent = "No posts found.";
      return;
    }

    statusEl.textContent = "";
    listEl.innerHTML = posts.map(renderPostItem).join("");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load feed";
    statusEl.textContent = message;
  }
}
