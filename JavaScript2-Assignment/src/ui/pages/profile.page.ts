export function renderProfilePage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container">
      <h1>My profile</h1>
      <p class="muted">Profile page is wired up. Next step: fetch profile + posts.</p>
      <nav class="nav"><a href="#/feed">Back to feed</a></nav>
    </div>
  `;
}
