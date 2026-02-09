import { deletePost, getPostById, updatePost } from "../../api/posts";
import { getProfileName } from "../../utils/storage";
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

export async function renderPostPage(
  container: HTMLElement,
  postId: string
): Promise<void> {
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

    // Only show edit/delete if you own the post
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

    // Update
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      successEl.textContent = "";

      const fd = new FormData(form);
      const title = String(fd.get("title") ?? "").trim();
      const body = String(fd.get("body") ?? "").trim();

      try {
        await updatePost(postId, { title, body });
        successEl.textContent = "Saved!";
        await renderPostPage(container, postId);
      } catch (err) {
        errorEl.textContent = err instanceof Error ? err.message : "Update failed";
      }
    });

    // Delete
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
