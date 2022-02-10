"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButton = exports.getMainElement = void 0;
const getMainElement = ({ title, text, }) => {
    const element = document.createElement("div");
    element.setAttribute("id", "cogsworth-embed-app");
    element.innerHTML = `
  <div id="cogsworth-embed-app" style="text-align: center;">
    <h2 style="color: #5f6a7e; font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25em;">${title}</h2>
    <p style="color: #5f6a7e; font-size: 1.25rem;">${text}</p>
  </div>
  `;
    const style = "padding: 2rem; border: 1px solid #e5e7eb; background: #fff;";
    element.setAttribute("style", style);
    return element;
};
exports.getMainElement = getMainElement;
const getButton = ({ label, onClick, link, }) => {
    const element = link ? document.createElement("a") : document.createElement("button");
    element.innerText = label;
    const style = "display: block; background-color: #7fcacb; color: #fff; font-weight: 500; border: none; padding: 0.5em 1.5em; border-radius: 5px; margin: 1em auto 0 auto;";
    element.setAttribute("style", style);
    if (link) {
        element.setAttribute('href', link);
        element.setAttribute('target', "_blank");
    }
    if (onClick) {
        element.addEventListener("click", onClick);
    }
    return element;
};
exports.getButton = getButton;
//# sourceMappingURL=common.js.map