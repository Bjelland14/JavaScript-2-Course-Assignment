export function renderFeedPage(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Feed</h1>
    <p>Her skal alle posts komme senere.</p>

    <nav>
      <a href="#/profile">Min profil</a> |
      <a href="#/post/123">Test: åpne post 123</a> |
      <a href="#/login">Til Login</a>
    </nav>
  `;
}
