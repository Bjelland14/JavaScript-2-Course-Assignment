import { register } from "../../api/auth";

export function renderRegisterPage(container: HTMLElement): void {
  container.innerHTML = `
    <h1>Register</h1>

    <form id="register-form">
      <label>
        Name (profile name)
        <input name="name" type="text" required />
      </label>

      <label>
        Email
        <input name="email" type="email" required />
      </label>

      <label>
        Password
        <input name="password" type="password" required />
      </label>

      <button type="submit">Register</button>
    </form>

    <p id="register-error" style="color: red;"></p>
    <p id="register-success" style="color: green;"></p>

    <p>
      Already have a user?
      <a href="#/login">Login</a>
    </p>
  `;

  const form = container.querySelector<HTMLFormElement>("#register-form");
  const errorEl = container.querySelector<HTMLParagraphElement>("#register-error");
  const successEl =
    container.querySelector<HTMLParagraphElement>("#register-success");

  if (!form || !errorEl || !successEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.textContent = "";
    successEl.textContent = "";

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await register({ name, email, password });
      successEl.textContent = "User created! You can log in now.";
      location.hash = "#/login";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      errorEl.textContent = message;
    }
  });
}
