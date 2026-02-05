import "./style.css";
import { router } from "./app/router";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Fant ikke #app i index.html");
}

// Første render
router(app);

// Re-render når hash endres (når du går til #/login osv)
window.addEventListener("hashchange", () => router(app));
