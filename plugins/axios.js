/* eslint-disable space-before-function-paren */
import CognitoSDK from '~/utils/cognito-sdk'

export default async ({ $axios }) => {
  if (process.browser) {
    const cognito = new CognitoSDK()
    await cognito.getUserSession()
    const currentUser = localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`)
    const token = localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.idToken`)
    $axios.setToken(token)
  }
}
