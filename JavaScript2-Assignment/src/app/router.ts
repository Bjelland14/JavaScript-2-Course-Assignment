import { renderLoginPage } from "../ui/pages/login.page";
import { renderRegisterPage } from "../ui/pages/register.page";
import { renderFeedPage } from "../ui/pages/feed.page";
import { renderProfilePage } from "../ui/pages/profile.page";
import { renderPostPage } from "../ui/pages/post.page";

function getHash(): string {
  // Hvis ingen hash, send til login (eller feed hvis du heller vil det senere)
  return location.hash || "#/login";
}

export function router(container: HTMLElement): void {
  const hash = getHash();

  // Enkle routes
  if (hash === "#/login") return renderLoginPage(container);
  if (hash === "#/register") return renderRegisterPage(container);
  if (hash === "#/feed") return renderFeedPage(container);
  if (hash === "#/profile") return renderProfilePage(container);

  // Route med parameter: #/post/123
  if (hash.startsWith("#/post/")) {
    const id = hash.replace("#/post/", "");
    return renderPostPage(container, id);
  }

  // 404
  container.innerHTML = `
    <h1>Fant ikke siden</h1>
    <p>Prøv <a href="#/login">Login</a> eller <a href="#/feed">Feed</a></p>
  `;
}
