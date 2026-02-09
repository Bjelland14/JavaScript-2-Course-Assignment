import { register } from "../../api/auth";

export function renderRegisterPage(container: HTMLElement): void {
  container.innerHTML = `
    <div class="container">
      <h1>Register</h1>

      <section class="card">
        <form id="register-form" class="form">
          <label>Name
            <input name="name" type="text" required />
          </label>

          <label>Email
            <input name="email" type="email" required />
          </label>

          <label>Password
            <input name="password" type="password" required />
          </label>

          <button class="btn" type="submit">Register</button>
        </form>

        <p id="register-error" class="error"></p>
        <p id="register-success" class="success"></p>
      </section>

      <p class="muted"><a href="#/login">Back to login</a></p>
    </div>
  `;

  const form = container.querySelector<HTMLFormElement>("#register-form");
  const errorEl = container.querySelector<HTMLParagraphElement>("#register-error");
  const successEl = container.querySelector<HTMLParagraphElement>("#register-success");
  if (!form || !errorEl || !successEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    successEl.textContent = "";

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    try {
      await register({ name, email, password });
      successEl.textContent = "Registered! Go to login.";
      location.hash = "#/login";
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : "Register failed";
    }
  });
}
