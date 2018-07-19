/* eslint-disable no-undef */
import axios from './axios'

export function createInsertPluginTemplateFromUrl(url) {
  // This method returns DOM string like this.
  //
  // `<div class="medium-insert-images">
  //   <figure contenteditable="false">
  //     <img src="${url}" alt="">
  //   </figure>
  // </div>`

  const wrapperElement = document.createElement('div')
  wrapperElement.classList.add('medium-insert-images')

  const figureElement = document.createElement('figure')
  figureElement.setAttribute('contenteditable', 'false')

  const imageElement = document.createElement('img')
  imageElement.setAttribute('src', url)
  imageElement.setAttribute('alt', '')

  figureElement.appendChild(imageElement)
  wrapperElement.appendChild(figureElement)

  const div = document.createElement('div')

  div.appendChild(wrapperElement)

  return div.innerHTML
}

export function getThumbnails(images) {
  return images
    .filter((img) => !img.src.includes('data:') || img.src.includes(process.env.DOMAIN))
    .map((img) => img.src)
}

export function getIframelyUrlTemplate(url) {
  // This method returns DOM string like this.
  //
  // `<br>
  // <div data-alis-iframely-url="${url}" contenteditable="false">
  //   <a href="${url}" data-iframely-url></a>
  // </div>
  // <br>`

  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('data-alis-iframely-url', url)
  wrapperElement.setAttribute('contenteditable', 'false')

  const anchorElement = document.createElement('a')
  anchorElement.setAttribute('href', url)
  anchorElement.setAttribute('data-iframely-url', '')

  wrapperElement.appendChild(anchorElement)

  const div = document.createElement('div')

  div.appendChild(document.createElement('br'))
  div.appendChild(wrapperElement)
  div.appendChild(document.createElement('br'))

  return div.innerHTML
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

export function getIframelyEmbedTemplate({ url, meta, links }) {
  // This method returns DOM string like this.
  //
  // `<div data-alis-iframely-url="${url}" contenteditable="false">
  //   <a href="${url}" target="_blank" class="iframely-embed-card">
  //     <div class="title">${meta.title || ''}</div>
  //     <div class="description">${meta.description || ''}</div>
  //     <img class="thumbnail" src="${(links.thumbnail && links.thumbnail[0].href) ||
  //       (links.icon && links.icon[0].href)}"> <!-- if hasThumbnail returns true -->
  //     <div class="site">${domain}</div>
  //   </a>
  // </div>`

  const domain = url.split('/')[2]
  const thumbnail =
    (links.thumbnail && links.thumbnail[0].href) || (links.icon && links.icon[0].href)
  const hasThumbnail = Boolean(thumbnail)

  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('data-alis-iframely-url', url)
  wrapperElement.setAttribute('contenteditable', 'false')

  const anchorElement = document.createElement('a')
  anchorElement.setAttribute('href', url)
  anchorElement.setAttribute('target', '_blank')
  anchorElement.classList.add('iframely-embed-card')

  const titleElement = document.createElement('div')
  titleElement.classList.add('title')
  if (!hasThumbnail) titleElement.classList.add('without-space')
  titleElement.appendChild(document.createTextNode(meta.title || ''))

  const descriptionElement = document.createElement('div')
  descriptionElement.classList.add('description')
  if (!hasThumbnail) descriptionElement.classList.add('without-space')
  descriptionElement.appendChild(document.createTextNode(meta.description || ''))

  let thumbnailElement
  if (hasThumbnail) {
    thumbnailElement = document.createElement('img')
    thumbnailElement.setAttribute('src', thumbnail)
    thumbnailElement.classList.add('thumbnail')
  }

  const siteElement = document.createElement('div')
  siteElement.classList.add('site')
  siteElement.appendChild(document.createTextNode(domain))

  anchorElement.appendChild(titleElement)
  anchorElement.appendChild(descriptionElement)
  if (hasThumbnail) anchorElement.appendChild(thumbnailElement)
  anchorElement.appendChild(siteElement)

  wrapperElement.appendChild(anchorElement)

  const div = document.createElement('div')
  div.appendChild(wrapperElement)

  return div.innerHTML
}

export function showEmbedTweet() {
  document.querySelectorAll('[data-alis-iframely-url]').forEach(async (element) => {
    const { alisIframelyUrl } = element.dataset
    if (
      alisIframelyUrl === 'https://twitter.com' ||
      alisIframelyUrl.startsWith('https://twitter.com/')
    ) {
      const isTweet = alisIframelyUrl.split('/')[4] === 'status'
      if (isTweet) {
        const anchorElement = document.createElement('a')
        anchorElement.setAttribute('href', alisIframelyUrl)
        anchorElement.setAttribute('data-iframely-url', '')

        const div = document.createElement('div')
        div.appendChild(anchorElement)

        element.innerHTML = div.innerHTML
      } else {
        const { data: profileInfo } = await axios.get(
          `https://iframe.ly/api/oembed?api_key=${
            process.env.IFRAMELY_API_KEY
          }&url=${encodeURIComponent(alisIframelyUrl)}`
        )
        const { title, description } = profileInfo
        const hasTitleOrDescription = title !== undefined || description !== undefined
        if (!hasTitleOrDescription) return

        element.innerHTML = `
      ${getTwitterProfileTemplate({ ...profileInfo })}
      <br>`
      }
    } else {
      const { data: result } = await axios.get(
        `https://iframe.ly/api/iframely?api_key=${
          process.env.IFRAMELY_API_KEY
        }&url=${encodeURIComponent(alisIframelyUrl)}`
      )
      const { title, description } = result.meta
      const hasTitleOrDescription = title !== undefined || description !== undefined
      if (!hasTitleOrDescription) return

      element.innerHTML = `
      ${getIframelyEmbedTemplate({ ...result })}
      <br>`
    }
    iframely.load()
  })
}
