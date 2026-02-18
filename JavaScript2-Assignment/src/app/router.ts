import { getToken } from "../utils/storage";
import { renderLoginPage } from "../ui/pages/login.page";
import { renderRegisterPage } from "../ui/pages/register.page";
import { renderFeedPage } from "../ui/pages/feed.page";
import { renderProfilePage } from "../ui/pages/profile.page";
import { renderPostPage } from "../ui/pages/post.page";
import { renderUserPage } from "../ui/pages/user.page";

function getHash(): string {
  return location.hash || "#/login";
}

function isProtected(hash: string): boolean {
  return (
    hash === "#/feed" ||
    hash === "#/profile" ||
    hash.startsWith("#/post/") ||
    hash.startsWith("#/user/")
  );
}

export function router(container: HTMLElement): void {
  const hash = getHash();
  const token = getToken();

  // Redirect to login if user tries to access protected route without token
  if (isProtected(hash) && !token) {
    location.hash = "#/login";
    renderLoginPage(container);
    return;
  }

  if (hash === "#/login") return renderLoginPage(container);
  if (hash === "#/register") return renderRegisterPage(container);
  if (hash === "#/feed") return renderFeedPage(container);

  if (hash === "#/profile") {
    void renderProfilePage(container);
    return;
  }

  if (hash.startsWith("#/post/")) {
    const id = hash.replace("#/post/", "");
    void renderPostPage(container, id);
    return;
  }

  if (hash.startsWith("#/user/")) {
    const name = hash.replace("#/user/", "");
    void renderUserPage(container, name);
    return;
  }

  container.innerHTML = `
    <div class="container">
      <h1>404</h1>
      <p><a href="#/login">Login</a> | <a href="#/feed">Feed</a></p>
    </div>
  `;
}
