import { createPost, getPosts } from "../../api/posts";
import type { Post } from "../../types/post.types";

function renderPostItem(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const body = post.body?.trim() ? post.body : "";
  const authorName = post.author?.name ?? "Unknown";

  const mediaUrl = post.media?.url;
  const mediaAlt = post.media?.alt ?? "Post image";

  const authorHtml =
    authorName !== "Unknown"
      ? `<a href="#/user/${authorName}">${authorName}</a>`
      : "Unknown";

  return `
    <article class="card">
      <h3>${title}</h3>
      <p class="muted">By ${authorHtml}</p>
      ${mediaUrl ? `<img class="post-img" src="${mediaUrl}" alt="${mediaAlt}" />` : ""}
      ${body ? `<p>${body}</p>` : ""}
      <p><a href="#/post/${post.id}">Open post</a></p>
    </article>
  `;
}

/**
 * Filters posts based on a search query.
 *
 * @param posts - Array of posts
 * @param query - Search string entered by the user
 * @returns Filtered array of posts
 */

function filterPosts(posts: Post[], query: string): Post[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;

  return posts.filter((p) => {
    const title = p.title?.toLowerCase() ?? "";
    const body = p.body?.toLowerCase() ?? "";
    const author = p.author?.name?.toLowerCase() ?? "";
    return title.includes(q) || body.includes(q) || author.includes(q);
  });
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

          <label>Media URL (optional)
            <input name="mediaUrl" type="url" />
          </label>

          <label>Media alt text (optional)
            <input name="mediaAlt" type="text" />
          </label>

          <button class="btn" type="submit">Create</button>
        </form>

        <p id="create-error" class="error"></p>
        <p id="create-success" class="success"></p>
      </section>

      <section class="card">
        <h2>Search</h2>
        <input id="search-input" type="text" placeholder="Search by title, body or author..." />
        <p id="search-info" class="muted"></p>
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

  const searchInput = container.querySelector<HTMLInputElement>("#search-input");
  const searchInfo = container.querySelector<HTMLParagraphElement>("#search-info");

  if (!form || !createError || !createSuccess || !statusEl || !listEl || !searchInput || !searchInfo) return;

  let allPosts: Post[] = [];
// Load all posts from API and render them
  async function loadFeed(): Promise<void> {
    statusEl!.textContent = "Loading...";
    listEl!.innerHTML = "";
    searchInfo!.textContent = "";

    try {
      const res = await getPosts();
      allPosts = res.data;

      const filtered = filterPosts(allPosts, searchInput!.value);

      statusEl!.textContent = "";
      searchInfo!.textContent =
        filtered.length !== allPosts.length
          ? `Showing ${filtered.length} of ${allPosts.length} posts`
          : `Showing ${allPosts.length} posts`;

      listEl!.innerHTML = filtered.map(renderPostItem).join("");
    } catch (err) {
      statusEl!.textContent = err instanceof Error ? err.message : "Failed to load feed";
    }
  }
// Immediately load posts when page is rendered
  void loadFeed();
// Handle search input to filter posts
  searchInput!.addEventListener("input", () => {
    const filtered = filterPosts(allPosts, searchInput!.value);

    searchInfo!.textContent =
      filtered.length !== allPosts.length
        ? `Showing ${filtered.length} of ${allPosts.length} posts`
        : `Showing ${allPosts.length} posts`;

    listEl!.innerHTML = filtered.map(renderPostItem).join("");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    createError.textContent = "";
    createSuccess.textContent = "";

    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const body = String(fd.get("body") ?? "").trim();
    const mediaUrl = String(fd.get("mediaUrl") ?? "").trim();
    const mediaAlt = String(fd.get("mediaAlt") ?? "").trim();

    if (!title && !body && !mediaUrl) {
      createError.textContent = "Please add a title, body, or media URL.";
      return;
    }

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
      await createPost(payload);
      createSuccess.textContent = "Post created!";
      form.reset();
      await loadFeed();
    } catch (err) {
      createError.textContent = err instanceof Error ? err.message : "Create post failed";
    }
  });
}
