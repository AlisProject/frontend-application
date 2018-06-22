/* eslint-disable no-undef */
import axios from './axios'

export function getThumbnails(images) {
  return images
    .filter((img) => !img.src.includes('data:') || img.src.includes(process.env.DOMAIN))
    .map((img) => img.src)
}

export function getTwitterProfileTemplate({ url, title, description }) {
  // This method returns DOM string like this.
  //
  // `<div data-alis-iframely-url="${url}" contenteditable="false">
  //   <a href="${url}" target="_blank" class="twitter-profile-card">
  //     <div class="title">${title}</div>
  //     <div class="description">${description}</div>
  //     <div class="site">twitter.com</div>
  //   </a>
  // </div>`

  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('data-alis-iframely-url', url)
  wrapperElement.setAttribute('contenteditable', 'false')

  const anchorElement = document.createElement('a')
  anchorElement.setAttribute('href', url)
  anchorElement.setAttribute('target', '_blank')
  anchorElement.classList.add('twitter-profile-card')

  const titleElement = document.createElement('div')
  titleElement.classList.add('title')
  titleElement.appendChild(document.createTextNode(title))

  const descriptionElement = document.createElement('div')
  descriptionElement.classList.add('description')
  descriptionElement.appendChild(document.createTextNode(description))

  const siteElement = document.createElement('div')
  siteElement.classList.add('site')
  siteElement.appendChild(document.createTextNode('twitter.com'))

  anchorElement.appendChild(titleElement)
  anchorElement.appendChild(descriptionElement)
  anchorElement.appendChild(siteElement)

  wrapperElement.appendChild(anchorElement)

  const div = document.createElement('div')
  div.appendChild(wrapperElement)

  return div.innerHTML
}

export function showEmbedTweet() {
  document.querySelectorAll('[data-alis-iframely-url]').forEach(async (element) => {
    const { alisIframelyUrl } = element.dataset
    const isTweet = alisIframelyUrl.split('/')[4] === 'status'
    if (isTweet) {
      element.innerHTML = `<a href="${alisIframelyUrl}" data-iframely-url></a>`
    } else {
      const { data: profileInfo } = await axios.get(
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
