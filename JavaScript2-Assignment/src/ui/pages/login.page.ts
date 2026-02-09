import { login } from "../../api/auth";
import { createApiKey } from "../../api/apiKey";
import { getApiKey, saveApiKey, saveProfileName, saveToken } from "../../utils/storage";

export function renderLoginPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container">
      <h1>Login</h1>

      <section class="card">
        <form id="login-form" class="form">
          <label>Email
            <input name="email" type="email" required />
          </label>

          <label>Password
            <input name="password" type="password" required />
          </label>

          <button class="btn" type="submit">Login</button>
        </form>

        <p id="login-error" class="error"></p>
      </section>

      <p class="muted">No user? <a href="#/register">Register</a></p>
    </div>
  `;

  const form = container.querySelector<HTMLFormElement>("#login-form");
  const errorEl = container.querySelector<HTMLParagraphElement>("#login-error");
  if (!form || !errorEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    try {
      const result = await login({ email, password });
      saveToken(result.data.accessToken);
      saveProfileName(result.data.name);

      const existing = getApiKey();
      if (!existing) {
        const apiKeyRes = await createApiKey("fed2-js2-ca");
        saveApiKey(apiKeyRes.data.key);
      }

      location.hash = "#/feed";
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : "Login failed";
    }
  });
}
