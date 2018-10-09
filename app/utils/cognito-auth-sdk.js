import { CognitoAuth } from 'amazon-cognito-auth-js'

const isDev = process.env.NODE_ENV === 'development'

export default class CognitoAuthSDK {
  constructor(identityProvider) {
    this.authData = {
      ClientId: process.env.CLIENT_ID,
      UserPoolId: process.env.USER_POOL_ID,
      AppWebDomain: process.env.APP_WEB_DOMAIN,
      TokenScopesArray: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin', 'phone'],
      RedirectUriSignIn: isDev
        ? 'http://localhost:3000/idpcb'
        : `https://${process.env.DOMAIN}/idpcb`,
      RedirectUriSignOut: isDev ? 'http://localhost:3000/' : `https://${process.env.DOMAIN}/`,
      IdentityProvider: identityProvider,
      AdvancedSecurityDataCollectionFlag: false
    }
    this.auth = new CognitoAuth(this.authData)
  }

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

  getOnSuccessResult() {
    return new Promise((resolve, reject) => {
      this.auth.userhandler = {
        onSuccess: (result) => {
          resolve(result)
        },
        onFailure: (err) => {
          reject(err)
        }
      }
    })
  }

  checkAuth(curUrl) {
    this.auth.parseCognitoWebResponse(curUrl)
  }

  logout() {
    this.auth.signOut()
  }
}
