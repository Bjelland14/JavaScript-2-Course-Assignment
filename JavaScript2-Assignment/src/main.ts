import "./style.css";
import { router } from "./app/router";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Could not find #app in index.html");
}

router(app);
window.addEventListener("hashchange", () => router(app));
