/* eslint-disable */

export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return

  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-5DZNDNB');

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'gtm.js', 'gtm.start': new Date().getTime()
  });

  app.router.afterEach((to, from) => {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.CLIENT_ID}.LastAuthUser`
    )
    dataLayer.push(to.gtm || { userId: currentUser })
  })
}
