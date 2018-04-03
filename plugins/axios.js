/* eslint-disable space-before-function-paren */
import CognitoSDK from '~/utils/cognito-sdk'

export default async ({ $axios }) => {
  if (process.browser) {
    const cognito = new CognitoSDK()

    try {
      await cognito.getUserSession()
    } catch (e) {
      console.error(e)
    }

    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.idToken`
    )
    $axios.setToken(token)
  }
}
