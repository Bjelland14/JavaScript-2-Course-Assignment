export function renderPostPage(container: HTMLElement, postId: string): void {
  container.innerHTML = `
    <h1>Post</h1>
    <p>Viser post med id: <strong>${postId}</strong></p>

    <nav>
      <a href="#/feed">Til Feed</a>
    </nav>
  `;
}
