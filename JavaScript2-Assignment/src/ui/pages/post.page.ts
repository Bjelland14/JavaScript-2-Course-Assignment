import { getPostById } from "../../api/posts";
import type { Post } from "../../types/post.types";

function renderPost(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const body = post.body?.trim() ? post.body : "";
  const author = post.author?.name ?? "Unknown";

  return `
    <article class="card">
      <h1>${title}</h1>
      <p class="muted">By ${author}</p>
      ${body ? `<p>${body}</p>` : "<p><em>No content</em></p>"}
    </article>
  `;
}

export async function renderPostPage(container: HTMLElement, postId: string): Promise<void> {
  container.innerHTML = `
    <div class="container">
      <p id="status" class="muted">Loading...</p>
      <div id="content"></div>
      <nav class="nav"><a href="#/feed">Back to feed</a></nav>
    </div>
  `;

  const statusEl = container.querySelector<HTMLParagraphElement>("#status");
  const contentEl = container.querySelector<HTMLDivElement>("#content");
  if (!statusEl || !contentEl) return;

  try {
    const res = await getPostById(postId);
    statusEl.textContent = "";
    contentEl.innerHTML = renderPost(res.data);
  } catch (err) {
    statusEl.textContent = err instanceof Error ? err.message : "Failed to load post";
  }
}
