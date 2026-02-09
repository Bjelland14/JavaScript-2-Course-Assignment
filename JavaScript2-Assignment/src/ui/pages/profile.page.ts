import { getProfile, getProfilePosts } from "../../api/profiles";
import { getProfileName } from "../../utils/storage";
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

export async function renderProfilePage(container: HTMLElement): Promise<void> {
  const myName = getProfileName();

  container.innerHTML = `
    <div class="container">
      <h1>My profile</h1>

      <p id="profile-status" class="muted">Loading profile...</p>
      <section id="profile-card" class="card"></section>

      <h2>My posts</h2>
      <p id="posts-status" class="muted"></p>
      <div id="posts-list"></div>

      <nav class="nav">
        <a href="#/feed">Back to feed</a>
      </nav>
    </div>
  `;

  const profileStatus = container.querySelector<HTMLParagraphElement>("#profile-status");
  const profileCard = container.querySelector<HTMLElement>("#profile-card");
  const postsStatus = container.querySelector<HTMLParagraphElement>("#posts-status");
  const postsList = container.querySelector<HTMLDivElement>("#posts-list");

  if (!profileStatus || !profileCard || !postsStatus || !postsList) return;

  if (!myName) {
    profileStatus.textContent = "Missing profile name. Please log in again.";
    return;
  }

  try {
    const profileRes = await getProfile(myName);
    const profile = profileRes.data;

    const avatarUrl = profile.avatar?.url;
    const avatarAlt = profile.avatar?.alt ?? "Avatar";
    const bio = profile.bio ?? "";

    profileStatus.textContent = "";
    profileCard.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        ${avatarUrl ? `<img class="avatar" src="${avatarUrl}" alt="${avatarAlt}" />` : ""}
        <div>
          <h2 style="margin:0;">${profile.name}</h2>
          ${bio ? `<p class="muted">${bio}</p>` : `<p class="muted"><em>No bio</em></p>`}
        </div>
      </div>
    `;
  } catch (err) {
    profileStatus.textContent = err instanceof Error ? err.message : "Failed to load profile";
    return;
  }

  try {
    postsStatus.textContent = "Loading posts...";
    const postsRes = await getProfilePosts(myName);

    postsStatus.textContent = "";
    postsList.innerHTML = postsRes.data.length
      ? postsRes.data.map(renderPostItem).join("")
      : "<p>No posts yet.</p>";
  } catch (err) {
    postsStatus.textContent = err instanceof Error ? err.message : "Failed to load posts";
  }
}
