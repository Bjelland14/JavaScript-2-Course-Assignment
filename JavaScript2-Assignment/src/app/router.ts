import { getToken } from "../utils/storage.ts";
import { renderLoginPage } from "../ui/pages/login.pages.ts";
import { renderRegisterPage } from "../ui/pages/register.page";
import { renderFeedPage } from "../ui/pages/feed.page.ts";
import { renderProfilePage } from "../ui/pages/profile.page.ts";
import { renderPostPage } from "../ui/pages/post.page.ts";

function getHash(): string {
  return location.hash || "#/login";
}

function isProtectedRoute(hash: string): boolean {
  return hash === "#/feed" || hash === "#/profile" || hash.startsWith("#/post/");
}

export function router(container: HTMLElement): void {
  const hash = getHash();

  // Protected routes needs token
  const token = getToken();
  if (isProtectedRoute(hash) && !token) {
    location.hash = "#/login";
    return renderLoginPage(container);
  }

  // Public routes
  if (hash === "#/login") return renderLoginPage(container);
  if (hash === "#/register") return renderRegisterPage(container);

  // Protected routes (now the token is checked)
  if (hash === "#/feed") return renderFeedPage(container);
  if (hash === "#/profile") return renderProfilePage(container);

  if (hash.startsWith("#/post/")) {
    const id = hash.replace("#/post/", "");
    return renderPostPage(container, id);
  }

  container.innerHTML = `
    <h1>Did not find the page</h1>
    <p>Prøv <a href="#/login">Login</a> or <a href="#/feed">Feed</a></p>
  `;
}
