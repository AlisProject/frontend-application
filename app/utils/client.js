export function isPageScrollable() {
  const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight
  return isScrollable
}

export function isScrollBottom() {
  const isScrollBottom =
    window.innerHeight + Math.ceil(window.pageYOffset) >= document.body.offsetHeight
  return isScrollBottom
}
