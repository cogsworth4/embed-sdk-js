import { getButton, getMainElement } from "./common";

export default (container: HTMLElement, signup: () => void) => {
  const element = getMainElement({
    title: "Link your Cogsworth account",
    text: "Authorize this site in your Cogsworth dashboard to show your calendar right here.",
  });
  const button = getButton({
    label: "Authorize",
    onClick: signup,
  });
  element.append(button);
  container.innerHTML = "";
  container.append(element);
};
