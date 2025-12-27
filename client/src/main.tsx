import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const CANONICAL_HOST = "stagingequation.com";
const currentHost = window.location.hostname;
const shouldRedirect =
  currentHost === `www.${CANONICAL_HOST}` || currentHost.endsWith(".netlify.app");

if (shouldRedirect) {
  const url = new URL(window.location.href);
  url.hostname = CANONICAL_HOST;
  url.protocol = "https:";
  window.location.replace(url.toString());
}

createRoot(document.getElementById("root")!).render(<App />);
