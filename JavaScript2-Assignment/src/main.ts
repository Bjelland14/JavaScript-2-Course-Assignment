import "./style.css";
import { router } from "./app/router";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Could not find #app in index.html");
}

// If the app is opened without a hash route (common on GitHub Pages),
// default to the login route.
if (!location.hash) {
  location.hash = "#/login";
}

router(app);
window.addEventListener("hashchange", () => router(app));
