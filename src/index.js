import { scan } from "react-scan";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
scan({
  enabled: false,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
