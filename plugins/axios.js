export default ({ $axios }) => {
  if (process.browser) {
    const currentUser = localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`)
    const token = localStorage.getItem(`CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.${currentUser}.idToken`)
    $axios.setToken(token)
  }
}
