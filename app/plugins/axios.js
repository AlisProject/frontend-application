/* eslint-disable space-before-function-paren */
export default async ({ $axios, store, env }) => {
  store.dispatch('user/initCognito')
  try {
    await store.dispatch('user/getUserSession')
  } catch (e) {
    console.error(e)
  }

  $axios.onRequest(req => {
    console.log('req', req)
    try {
      store.dispatch('user/getUserSession')
      const currentUser = localStorage.getItem(
        `CognitoIdentityServiceProvider.${env.CLIENT_ID}.LastAuthUser`
      )
      const token = localStorage.getItem(
        `CognitoIdentityServiceProvider.${env.CLIENT_ID}.${currentUser}.idToken`
      )
      $axios.setToken(token)
    } catch (e) {
      console.error(e)
    }
    return req
  })

  if (process.client) {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${env.CLIENT_ID}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${env.CLIENT_ID}.${currentUser}.idToken`
    )
    $axios.setToken(token)
  }
}
