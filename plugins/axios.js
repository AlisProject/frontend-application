/* eslint-disable space-before-function-paren */
export default async ({ $axios, store }) => {
  store.dispatch('user/initCognito')
  try {
    await store.dispatch('user/getUserSession')
  } catch (e) {
    console.error(e)
  }

  if (process.browser) {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.idToken`
    )
    $axios.setToken(token)
  }
}
