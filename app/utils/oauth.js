const LOCALSTRAGE_OAUTH_PARAMS_KEY = 'OAuthParams'

export function setOAuthParams(query) {
  if (typeof query !== 'object') {
    throw new TypeError('query must be object.')
  }
  localStorage.setItem(LOCALSTRAGE_OAUTH_PARAMS_KEY, JSON.stringify(query))
}

export function removeOAuthParams() {
  localStorage.removeItem(LOCALSTRAGE_OAUTH_PARAMS_KEY)
}

export function getOAuthParams() {
  return JSON.parse(localStorage.getItem(LOCALSTRAGE_OAUTH_PARAMS_KEY))
}
