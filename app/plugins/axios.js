export default async ({ $axios, store, env }) => {
  store.dispatch('user/initCognito')
  try {
    await store.dispatch('user/getUserSession')
  } catch (e) {}

  $axios.onRequest(async (req) => {
    if (
      req.url.startsWith('/api/me/') ||
      req.url.startsWith('/laboratory/labo/') ||
      req.url.startsWith(env.WEB3_SERVICE_BASE_URL + '/api/me/')
    ) {
      try {
        await store.dispatch('user/getUserSession')
        const currentUser = localStorage.getItem(
          `CognitoIdentityServiceProvider.${env.COGNITO_APP_CLIENT_ID}.LastAuthUser`
        )
        const token = localStorage.getItem(
          `CognitoIdentityServiceProvider.${env.COGNITO_APP_CLIENT_ID}.${currentUser}.idToken`
        )
        req.headers.common.Authorization = token
      } catch (e) {}
    }
    return req
  })

  if (process.client) {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${env.COGNITO_APP_CLIENT_ID}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${env.COGNITO_APP_CLIENT_ID}.${currentUser}.idToken`
    )
    $axios.setToken(token)
  }
}
