/* eslint-disable no-undef */
import getTwitterProfileTemplate from './getTwitterProfileTemplate'

export default ({ $axios }) => {
  document.querySelectorAll('[data-alis-iframely-url]').forEach(async (element) => {
    const { alisIframelyUrl } = element.dataset
    const isTweet = alisIframelyUrl.split('/')[4] === 'status'
    if (isTweet) {
      element.innerHTML = `<a href="${alisIframelyUrl}" data-iframely-url></a>`
    } else {
      const profileInfo = await $axios.$get(
        `https://iframe.ly/api/oembed?api_key=${process.env.IFRAMELY_API_KEY}&url=${alisIframelyUrl}`
      )
      element.innerHTML = `
      ${getTwitterProfileTemplate({ ...profileInfo })}
      <br>`
    }
    iframely.load()
  })
}
