import { followProfile, getProfile, getProfilePosts, unfollowProfile } from "../../api/profiles";
import type { Post } from "../../types/post.types";

function renderPostItem(post: Post): string {
  const title = post.title?.trim() ? post.title : "(No title)";
  const body = post.body?.trim() ? post.body : "";

  return `
    <article class="card">
      <h3>${title}</h3>
      ${body ? `<p>${body}</p>` : ""}
      <p><a href="#/post/${post.id}">Open post</a></p>
    </article>
  `;
}

export async function renderUserPage(container: HTMLElement, userName: string): Promise<void> {
  container.innerHTML = `
    <div class="container">
      <h1>User</h1>

      <p class="muted">Viewing: <strong>${userName}</strong></p>

      <section class="card">
        <p id="user-status" class="muted">Loading profile...</p>
        <div id="user-content"></div>

        <div style="margin-top:12px;">
          <button class="btn" id="follow-btn" type="button">Follow</button>
          <button class="btn" id="unfollow-btn" type="button">Unfollow</button>
          <p id="follow-msg" class="muted"></p>
        </div>
      </section>

      <h2>Posts</h2>
      <p id="posts-status" class="muted"></p>
      <div id="posts-list"></div>

      <nav class="nav">
        <a href="#/feed">Back to feed</a>
      </nav>
    </div>
  `;

  const userStatus = container.querySelector<HTMLParagraphElement>("#user-status");
  const userContent = container.querySelector<HTMLDivElement>("#user-content");

  const followBtn = container.querySelector<HTMLButtonElement>("#follow-btn");
  const unfollowBtn = container.querySelector<HTMLButtonElement>("#unfollow-btn");
  const followMsg = container.querySelector<HTMLParagraphElement>("#follow-msg");

  const postsStatus = container.querySelector<HTMLParagraphElement>("#posts-status");
  const postsList = container.querySelector<HTMLDivElement>("#posts-list");

  if (!userStatus || !userContent || !followBtn || !unfollowBtn || !followMsg || !postsStatus || !postsList) return;

  // Load profile
  try {
    const res = await getProfile(userName);
    const p = res.data;

    const avatarUrl = p.avatar?.url;
    const avatarAlt = p.avatar?.alt ?? "Avatar";
    const bio = p.bio ?? "";

    userStatus.textContent = "";
    userContent.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        ${avatarUrl ? `<img class="avatar" src="${avatarUrl}" alt="${avatarAlt}" />` : ""}
        <div>
          <h2 style="margin:0;">${p.name}</h2>
          ${bio ? `<p class="muted">${bio}</p>` : `<p class="muted"><em>No bio</em></p>`}
        </div>
      </div>
    `;
  } catch (err) {
    userStatus.textContent = err instanceof Error ? err.message : "Failed to load user";
    return;
  }

  // Follow/unfollow
  followBtn.addEventListener("click", async () => {
    followMsg.textContent = "";
    try {
      await followProfile(userName);
      followMsg.textContent = "Followed!";
    } catch (err) {
      followMsg.textContent = err instanceof Error ? err.message : "Follow failed";
    }
  });

  unfollowBtn.addEventListener("click", async () => {
    followMsg.textContent = "";
    try {
      await unfollowProfile(userName);
      followMsg.textContent = "Unfollowed!";
    } catch (err) {
      followMsg.textContent = err instanceof Error ? err.message : "Unfollow failed";
    }
  });

  // Load user posts
  try {
    postsStatus.textContent = "Loading posts...";
    const postsRes = await getProfilePosts(userName);
    postsStatus.textContent = "";
    postsList.innerHTML = postsRes.data.length
      ? postsRes.data.map(renderPostItem).join("")
      : "<p>No posts found.</p>";
  } catch (err) {
    postsStatus.textContent = err instanceof Error ? err.message : "Failed to load posts";
  }
}
