export default class CognitoAuthSDK {
  setTokens({
    last_auth_user: lastAuthUser,
    id_token: idToken,
    access_token: accessToken,
    refresh_token: refreshToken
  }) {
    const key = `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}`
    const keyWithLastAuthUser = `${key}.${lastAuthUser}`
    localStorage.setItem(`${key}.LastAuthUser`, lastAuthUser)
    localStorage.setItem(`${keyWithLastAuthUser}.idToken`, idToken)
    localStorage.setItem(`${keyWithLastAuthUser}.accessToken`, accessToken)
    localStorage.setItem(`${keyWithLastAuthUser}.refreshToken`, refreshToken)
  }

  removeTokens({ lastAuthUser }) {
    const key = `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}`
    const keyWithLastAuthUser = `${key}.${lastAuthUser}`
    localStorage.removeItem(`${keyWithLastAuthUser}.idToken`)
    localStorage.removeItem(`${keyWithLastAuthUser}.accessToken`)
    localStorage.removeItem(`${keyWithLastAuthUser}.refreshToken`)
  }
}
