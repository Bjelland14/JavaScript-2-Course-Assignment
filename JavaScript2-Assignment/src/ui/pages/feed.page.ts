import { createPost, getPosts } from "../../api/posts";
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

      <section class="card">
        <h2>Create post</h2>

        <form id="create-post-form" class="form">
          <label>Title
            <input name="title" type="text" />
          </label>

          <label>Body
            <textarea name="body" rows="4"></textarea>
          </label>

          <button class="btn" type="submit">Create</button>
        </form>

        <p id="create-error" class="error"></p>
        <p id="create-success" class="success"></p>
      </section>

      <p id="status" class="muted">Loading...</p>
      <div id="list"></div>

      <nav class="nav">
        <a href="#/profile">My profile</a> |
        <a href="#/login">Login</a>
      </nav>
    </div>
  `;

  const form = container.querySelector<HTMLFormElement>("#create-post-form");
  const createError = container.querySelector<HTMLParagraphElement>("#create-error");
  const createSuccess = container.querySelector<HTMLParagraphElement>("#create-success");

  const statusEl = container.querySelector<HTMLParagraphElement>("#status");
  const listEl = container.querySelector<HTMLDivElement>("#list");

  if (!form || !createError || !createSuccess || !statusEl || !listEl) return;

  async function loadFeed(): Promise<void> {
    statusEl.textContent = "Loading...";
    listEl.innerHTML = "";

    try {
      const res = await getPosts();
      statusEl.textContent = "";
      listEl.innerHTML = res.data.map(renderPostItem).join("");
    } catch (err) {
      statusEl.textContent = err instanceof Error ? err.message : "Failed to load feed";
    }
  }

  // initial load
  void loadFeed();

  // create post
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    createError.textContent = "";
    createSuccess.textContent = "";

    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();

    if (!title && !body) {
      createError.textContent = "Please add a title or body.";
      return;
    }

    try {
      await createPost({ title: title || undefined, body: body || undefined });
      createSuccess.textContent = "Post created!";
      form.reset();
      await loadFeed();
    } catch (err) {
      createError.textContent = err instanceof Error ? err.message : "Create post failed";
    }
  });
}
