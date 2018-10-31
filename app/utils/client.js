export function isPageScrollable() {
  const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight
  return isScrollable
}
