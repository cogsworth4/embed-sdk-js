import { getButton, getMainElement } from "./common";

export default (container: HTMLElement, signup: () => void) => {
  const element = getMainElement({
    title: "Advanced, yet simple scheduling features",
    text: "Sign up to Cogsworth and get your calendar right on our dashboard.",
  });
  const button = getButton({
    label: "Sign up",
    onClick: signup,
  });
  element.append(button);
  container.innerHTML = "";
  container.append(element);
};
