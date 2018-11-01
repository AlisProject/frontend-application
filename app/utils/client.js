export function isPageScrollable(containerElement) {
  const hasScrollbar = containerElement.scrollHeight > containerElement.clientHeight
  const isOverflowHidden =
    containerElement.style.overflow && containerElement.style.overflow === 'hidden'
  const isScrollable = hasScrollbar && !isOverflowHidden

  return isScrollable
}
