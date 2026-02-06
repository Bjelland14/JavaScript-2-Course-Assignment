export function renderProfilePage(container: HTMLElement): void {
  container.innerHTML = `
    <h1>My profile</h1>
    <p>Here will the profile information come later.</p>

    <nav>
      <a href="#/feed">To Feed</a>
    </nav>
  `;
}
