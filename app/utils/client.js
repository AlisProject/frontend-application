export function fetchDataIfNotScrollable(containerElement, fetchFunction) {
  const hasScrollbar = containerElement.scrollHeight > containerElement.clientHeight
  const isOverflowHidden =
    containerElement.style.overflow && containerElement.style.overflow === 'hidden'
  const isScrollable = hasScrollbar && !isOverflowHidden

  if (isScrollable) return
  fetchFunction()
}
