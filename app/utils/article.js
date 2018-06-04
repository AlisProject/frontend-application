/* eslint-disable no-undef */
import moment from 'moment'

export function getThumbnails(images) {
  return images
    .filter((img) => !img.src.includes('data:') || img.src.includes(process.env.DOMAIN))
    .map((img) => img.src)
}

export function getTwitterProfileTemplate({ url, title, description }) {
  return `<div data-alis-iframely-url="${url}" contenteditable="false">
    <a href="${url}" target="_blank" class="twitter-profile-card">
      <div class="title">${title}</div>
      <div class="description">${description}</div>
      <div class="site">twitter.com</div>
    </a>
  </div>`
}

export function showEmbedTweet({ $axios }) {
  document.querySelectorAll('[data-alis-iframely-url]').forEach(async (element) => {
    const { alisIframelyUrl } = element.dataset
    const isTweet = alisIframelyUrl.split('/')[4] === 'status'
    if (isTweet) {
      element.innerHTML = `<a href="${alisIframelyUrl}" data-iframely-url></a>`
    } else {
      const profileInfo = await $axios.$get(
        `https://iframe.ly/api/oembed?api_key=${
          process.env.IFRAMELY_API_KEY
        }&url=${alisIframelyUrl}`
      )
      element.innerHTML = `
      ${getTwitterProfileTemplate({ ...profileInfo })}
      <br>`
    }
    iframely.load()
  })
}

export function formatDate(date) {
  return moment(date, 'X')
    .locale('ja')
    .format('L')
}
