import { deletePost, getPostById, updatePost } from "../../api/posts";
import { getProfileName } from "../../utils/storage";
import type { Post } from "../../types/post.types";

function renderPost(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const body = post.body?.trim() ? post.body : "";
  const author = post.author?.name ?? "Unknown";

  const mediaUrl = post.media?.url;
  const mediaAlt = post.media?.alt ?? "Post image";

  return `
    <article class="card">
      <h1>${title}</h1>
      <p class="muted">By ${author}</p>
      ${mediaUrl ? `<img class="post-img" src="${mediaUrl}" alt="${mediaAlt}" />` : ""}
      ${body ? `<p>${body}</p>` : "<p><em>No content</em></p>"}
    </article>
  `;
}

export async function renderPostPage(container: HTMLElement, postId: string): Promise<void> {
  container.innerHTML = `
    <div class="container">
      <p id="status" class="muted">Loading...</p>
      <div id="content"></div>
      <div id="actions"></div>
      <nav class="nav"><a href="#/feed">Back to feed</a></nav>
    </div>
  `;

  const statusEl = container.querySelector<HTMLParagraphElement>("#status");
  const contentEl = container.querySelector<HTMLDivElement>("#content");
  const actionsEl = container.querySelector<HTMLDivElement>("#actions");
  if (!statusEl || !contentEl || !actionsEl) return;

  try {
    const res = await getPostById(postId);
    const post = res.data;

    statusEl.textContent = "";
    contentEl.innerHTML = renderPost(post);

    const myName = getProfileName();
    const isOwner = myName && post.author?.name === myName;
    if (!isOwner) return;

    actionsEl.innerHTML = `
      <section class="card">
        <h2>Edit post</h2>

        <form id="edit-form" class="form">
          <label>Title
            <input name="title" type="text" value="${post.title ?? ""}" />
          </label>

          <label>Body
            <textarea name="body" rows="4">${post.body ?? ""}</textarea>
          </label>

          <label>Media URL (optional)
            <input name="mediaUrl" type="url" value="${post.media?.url ?? ""}" />
          </label>

          <label>Media alt text (optional)
            <input name="mediaAlt" type="text" value="${post.media?.alt ?? ""}" />
          </label>

          <button class="btn" type="submit">Save</button>
          <button class="btn" id="delete-btn" type="button">Delete</button>
        </form>

        <p id="edit-error" class="error"></p>
        <p id="edit-success" class="success"></p>
      </section>
    `;

    const form = container.querySelector<HTMLFormElement>("#edit-form");
    const deleteBtn = container.querySelector<HTMLButtonElement>("#delete-btn");
    const errorEl = container.querySelector<HTMLParagraphElement>("#edit-error");
    const successEl = container.querySelector<HTMLParagraphElement>("#edit-success");
    if (!form || !deleteBtn || !errorEl || !successEl) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      successEl.textContent = "";

      const fd = new FormData(form);
      const title = String(fd.get("title") ?? "").trim();
      const body = String(fd.get("body") ?? "").trim();
      const mediaUrl = String(fd.get("mediaUrl") ?? "").trim();
      const mediaAlt = String(fd.get("mediaAlt") ?? "").trim();

      const payload: {
        title?: string;
        body?: string;
        media?: { url?: string; alt?: string };
      } = {};

      if (title) payload.title = title;
      if (body) payload.body = body;

      if (mediaUrl) {
        payload.media = { url: mediaUrl };
        if (mediaAlt) payload.media.alt = mediaAlt;
      }

      try {
        await updatePost(postId, payload);
        successEl.textContent = "Saved!";
        await renderPostPage(container, postId);
      } catch (err) {
        errorEl.textContent = err instanceof Error ? err.message : "Update failed";
      }
    });

    deleteBtn.addEventListener("click", async () => {
      errorEl.textContent = "";
      successEl.textContent = "";

      const ok = confirm("Delete this post?");
      if (!ok) return;

      try {
        await deletePost(postId);
        location.hash = "#/feed";
      } catch (err) {
        errorEl.textContent = err instanceof Error ? err.message : "Delete failed";
      }
    });
  } catch (err) {
    statusEl.textContent = err instanceof Error ? err.message : "Failed to load post";
  }
}
