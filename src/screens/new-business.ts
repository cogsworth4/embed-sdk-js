import { getButton, getMainElement } from "./common";

export default (container: HTMLElement, create: () => void) => {
  const element = getMainElement({
    title: "Advanced, yet simple scheduling features",
    text: "Add this business to Cogsworth and get your calendar right on our dashboard.",
  });
  const button = getButton({
    label: "Add business",
    onClick: create,
  });
  element.append(button);
  container.innerHTML = "";
  container.append(element);
};
