export default (container: HTMLElement, embedUrl: string) => {
  const element = document.createElement("iframe");
  element.setAttribute("src", embedUrl);
  element.setAttribute("style", "width: 100%; min-height: 300px;");
  container.innerHTML = "";
  container.append(element);
};
