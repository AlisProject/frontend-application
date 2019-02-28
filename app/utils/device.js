export function isIOS() {
  return /iP(hone|(o|a)d)/.test(navigator.userAgent)
}

export function isAndroid() {
  return navigator.userAgent.includes('Android')
}

export function isMobile() {
  return isIOS() || isAndroid()
}
