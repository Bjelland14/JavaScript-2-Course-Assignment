import { login } from "../../api/auth";
import { createApiKey } from "../../api/apiKey";
import { getApiKey, saveApiKey, saveToken } from "../../utils/storage";

export function renderLoginPage(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Login</h1>

    <form id="login-form">
      <label>
        Email
        <input name="email" type="email" required />
      </label>

      <label>
        Password
        <input name="password" type="password" required />
      </label>

      <button type="submit">Login</button>
    </form>

    <p id="login-error" style="color: red;"></p>

    <p>
      Don't have a user?
      <a href="#/register">Register here</a>
    </p>
  `;

  const form = container.querySelector<HTMLFormElement>("#login-form");
  const errorEl = container.querySelector<HTMLParagraphElement>("#login-error");
  if (!form || !errorEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.textContent = "";

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const result = await login({ email, password });
      saveToken(result.data.accessToken);

      // Create API key once (if not already stored)
      const existingKey = getApiKey();
      if (!existingKey) {
        const keyResult = await createApiKey();
        saveApiKey(keyResult.data.key);
      }

      location.hash = "#/feed";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      errorEl.textContent = message;
    }
  });
}
