export default async ({ $axios, store, env }) => {
  store.dispatch('user/initCognito')
  try {
    await store.dispatch('user/getUserSession')
  } catch (e) {}

  $axios.onRequest(async (req) => {
    if (req.url.startsWith('/me/')) {
      try {
        await store.dispatch('user/getUserSession')
        const currentUser = localStorage.getItem(
          `CognitoIdentityServiceProvider.${env.CLIENT_ID}.LastAuthUser`
        )
        const token = localStorage.getItem(
          `CognitoIdentityServiceProvider.${env.CLIENT_ID}.${currentUser}.idToken`
        )
        $axios.setToken(token)
      } catch (e) {}
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
