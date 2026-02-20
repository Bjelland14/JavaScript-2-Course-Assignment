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
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    // Name validation
    const nameRegex = /^[a-z0-9_]+$/i;
    if (!nameRegex.test(name)) {
      errorEl.textContent = "Name can only contain letters, numbers and underscore.";
      return;
    }

    // Email validation (stud email)
    if (!email.endsWith("@stud.noroff.no")) {
      errorEl.textContent = "Email must be a @stud.noroff.no address.";
      return;
    }

    // Password validation
    if (password.length < 8) {
      errorEl.textContent = "Password must be at least 8 characters.";
      return;
    }

    try {
      await register({ name, email, password });
      successEl.textContent = "Registered successfully! Redirecting to login...";
      setTimeout(() => {
        location.hash = "#/login";
      }, 1000);
    } catch (err) {
      errorEl.textContent =
        err instanceof Error ? err.message : "Register failed";
    }
  });
}