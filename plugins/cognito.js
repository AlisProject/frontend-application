/* eslint-disable space-before-function-paren */
export default async ({ store }) => {
  store.dispatch('user/initCognito')
  try {
    await store.dispatch('user/getUserSession')
  } catch (error) {
    return error
  }
}
