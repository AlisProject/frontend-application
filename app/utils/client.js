export function isPageScrollable() {
  const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight
  return isScrollable
}

export function isScrollBottom() {
  const downloadBarHeight = 50
  const isScrollBottom =
    window.innerHeight + Math.ceil(window.pageYOffset) >=
    document.body.offsetHeight - downloadBarHeight
  return isScrollBottom
}
