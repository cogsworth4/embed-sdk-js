export const getMainElement = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => {
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

export const getButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const element = document.createElement("button");
  element.innerText = label;
  const style =
    "display: block; background-color: #7fcacb; color: #fff; font-weight: 500; border: none; padding: 0.5em 1.5em; border-radius: 5px; margin: 1em auto 0 auto;";
  element.setAttribute("style", style);
  if (onClick) {
    element.addEventListener("click", onClick);
  }

  return element;
};
