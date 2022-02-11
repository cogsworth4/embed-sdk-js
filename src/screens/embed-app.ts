export default (container: HTMLElement, embedUrl: string) => {
  const element = document.createElement('iframe')
  element.setAttribute(
    'style',
    'width: 100%; min-height: 300px; height: 100%; display: none;'
  )
  element.setAttribute('src', embedUrl)
  container.append(element)
  element.onload = (e) => {
    const loadingElement = document.getElementById('cogsworth-loading')
    loadingElement.remove()
    element.setAttribute(
      'style',
      'width: 100%; min-height: 300px; height: 100%; display: block;'
    )
  }
}
