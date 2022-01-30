import { getMainElement } from "./common";

export default (container: HTMLElement) => {
  const element = getMainElement({
    title: "Advanced, yet simple scheduling features",
    text: "Ask your account administrator to sign up to Cogsworth and get your calendar right on our dashboard.",
  });
  container.innerHTML = "";
  container.append(element);
};
