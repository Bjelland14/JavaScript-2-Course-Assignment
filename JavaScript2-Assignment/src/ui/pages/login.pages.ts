export function renderLoginPage(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Login</h1>
    <p>Dette er en placeholder-side.</p>

    <nav>
      <a href="#/register">Gå til Register</a> |
      <a href="#/feed">Gå til Feed</a>
    </nav>
  `;
}
