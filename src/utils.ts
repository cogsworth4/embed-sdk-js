export const addButtonEventListener = (
  container: HTMLElement,
  onClick: () => void
) => {
  if (!onClick) return

  const button = container.getElementsByTagName('button')
  if (button && button.length > 0) {
    button[0].addEventListener('click', onClick)
  }
}

export const removeElement = (selector: string) => {
  const element = document.querySelector(selector)
  if (element) {
    element.remove()
  }
}

export const renderIntoContainer = (
  container: HTMLElement,
  html: string,
  { onClick }: { onClick?: () => void } = {}
) => {
  container.innerHTML = html
  addButtonEventListener(container, onClick)
}

export const appendStyles = (styles: string) => {
  const stylesElement = document.getElementById('cogsworth-embed-styles')
  if (stylesElement) {
    stylesElement.remove()
  }
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style type="text/css" id="cogsworth-embed-styles">${styles}</style>`
  )
}
