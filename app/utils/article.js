/* global iframely */
import { XmlEntities } from 'html-entities'
import { BigNumber } from 'bignumber.js'
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
    .filter((img) => !img.src.includes('data:') || img.src.includes(process.env.ALIS_APP_DOMAIN))
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

    const isTwitterResource =
      alisIframelyUrl === 'https://twitter.com' ||
      alisIframelyUrl.startsWith('https://twitter.com/')
    const isTweet = isTwitterResource && alisIframelyUrl.split('/')[4] === 'status'
    const isGistResource = alisIframelyUrl.startsWith('https://gist.github.com/')
    const isYouTubeResource = isYouTubeVideoURL(alisIframelyUrl)
    const isFacebookResource = isFacebookPostURL(alisIframelyUrl)
    const isInstagramResource = isInstagramURL(alisIframelyUrl)
    let result

    try {
      result = (await getResourceFromIframely(
        isTwitterResource ? 'oembed' : 'iframely',
        alisIframelyUrl
      )).data
    } catch (error) {
      console.error(error)
      return
    }

    if (
      isTweet ||
      isGistResource ||
      isYouTubeResource ||
      isFacebookResource ||
      isInstagramResource
    ) {
      const anchorElement = document.createElement('a')
      anchorElement.setAttribute('href', alisIframelyUrl)
      anchorElement.setAttribute('data-iframely-url', '')

      const div = document.createElement('div')
      div.appendChild(anchorElement)

      element.innerHTML = div.innerHTML
      iframely.load()
      return
    }

    if (isTwitterResource) {
      const { title, description } = result
      const hasTitleOrDescription = title !== undefined || description !== undefined
      if (!hasTitleOrDescription) return

      element.innerHTML = getTwitterProfileTemplate({ ...result })
    } else {
      const { title, description } = result.meta
      const hasTitleOrDescription = title !== undefined || description !== undefined
      if (!hasTitleOrDescription) return

      element.innerHTML = getIframelyEmbedTemplate({ ...result })
    }
  })
}

export function getResourceFromIframely(type, url) {
  if (!type || !url) {
    throw new TypeError('type and url must be string.')
  }
  if (!['oembed', 'iframely'].includes(type)) {
    throw new TypeError('type must be either "oembed", "iframely"')
  }
  return axios.get(
    `https://iframe.ly/api/${type}?api_key=${process.env.IFRAMELY_API_KEY}&url=${encodeURIComponent(
      url
    )}&omit_script=1&omit_css=1`
  )
}

export function preventDragAndDrop(element) {
  element.addEventListener(
    'drop',
    (e) => {
      e.preventDefault()
      e.stopPropagation()
    },
    false
  )
  element.addEventListener(
    'dragover',
    (e) => {
      e.preventDefault()
      e.stopPropagation()
    },
    false
  )
}

export function preventDropImageOnOGPContent() {
  Array.from(document.querySelectorAll('[data-alis-iframely-url]')).forEach((element) => {
    if (element.dataset.preventedDragAndDrop === 'true') return
    preventDragAndDrop(element)
    element.dataset.preventedDragAndDrop = true
  })
}

export function htmlDecode(text) {
  const entities = new XmlEntities()
  return entities.decode(text)
}

export function isYouTubeVideoURL(url) {
  // 参考：
  // https://github.com/itteco/iframely/blob/ef79303fdd8400ca958827a787a3f18bb9044073/plugins/domains/youtube.com/youtube.video.js
  const regexes = [
    /^https?:\/\/(?:www\.)?youtube\.com\/(?:tv#\/)?watch\/?\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/youtu.be\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/m\.youtube\.com\/#\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/v\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube\.com\/user\/[a-zA-Z0-9_-]+\/?\?v=([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/www\.youtube-nocookie\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/i
  ]
  const isYouTubeVideoURL = regexes.some((regex) => regex.test(url))

  return isYouTubeVideoURL
}

export function isFacebookPostURL(url) {
  // 参考：
  // https://github.com/itteco/iframely/blob/bba8b566dc7158e3ab8a59e4665a0b1d32805030/plugins/domains/facebook.com/facebook.post.js
  const regexes = [
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/(permalink|story)\.php\?[^/]+(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?fbid=(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9.-]+)\/(posts|activity)\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9.-]+)\/photos\/[^/]+\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/notes\/([a-zA-Z0-9.-]+)\/[^/]+\/(\d{10,})/i,
    /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^/]+(\d{10,})/i
  ]
  const isFacebookPostURL = regexes.some((regex) => regex.test(url))

  return isFacebookPostURL
}

export function isInstagramURL(url) {
  // 参考：
  // https://github.com/itteco/iframely/blob/245043afd1698d88f1ed05c6b7b075148aca1841/plugins/domains/instagram.com.js
  const regexes = [
    /^https?:\/\/(?:www.)?instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)\/?/i,
    /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
    /^https?:\/\/instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:p|tv)\/([a-zA-Z0-9_-]+)$/i
  ]
  const isInstagramURL = regexes.some((regex) => regex.test(url))

  return isInstagramURL
}

export function resizeTextarea({ targetElement, height, lineHeight, defaultHeight = 0 }) {
  const textarea = targetElement
  textarea.style.height = height
  textarea.style.lineHeight = lineHeight

  textarea.addEventListener('input', (event) => {
    if (event.target.scrollHeight > event.target.offsetHeight) {
      event.target.style.height = `${event.target.scrollHeight}px`
      return
    }
    let height, lineHeight
    while (true) {
      if (defaultHeight >= event.target.scrollHeight) return
      height = Number(event.target.style.height.split('px')[0])
      lineHeight = Number(event.target.style.lineHeight.split('px')[0])
      event.target.style.height = `${height - lineHeight}px`
      if (event.target.scrollHeight > event.target.offsetHeight) {
        event.target.style.height = `${event.target.scrollHeight}px`
        break
      }
    }
  })
}

export function isV2(article = {}) {
  if (article.version === undefined) return false
  const isV2 = article.version >= 2 && article.version < 3
  return isV2
}

export function showEmbed() {
  document.querySelectorAll('oembed[url]').forEach(async (element) => {
    const url = element.attributes.url.value

    const isTwitterResource =
      url === 'https://twitter.com' || url.startsWith('https://twitter.com/')
    const isTweet = isTwitterResource && url.split('/')[4] === 'status'
    const isGistResource = url.startsWith('https://gist.github.com/')
    const isYouTubeResource = isYouTubeVideoURL(url)
    const isFacebookResource = isFacebookPostURL(url)
    const isInstagramResource = isInstagramURL(url)
    let result

    try {
      result = (await getResourceFromIframely(isTwitterResource ? 'oembed' : 'iframely', url)).data
    } catch (error) {
      console.error(error)
      return
    }

    if (
      isTweet ||
      isGistResource ||
      isYouTubeResource ||
      isFacebookResource ||
      isInstagramResource
    ) {
      iframely.load(element, url)
      return
    }

    if (isTwitterResource) {
      const { title, description } = result
      const hasTitleOrDescription = title !== undefined || description !== undefined
      if (!hasTitleOrDescription) return

      element.innerHTML = getTwitterProfileTemplate({ ...result })
    } else {
      const { title, description } = result.meta
      const hasTitleOrDescription = title !== undefined || description !== undefined
      if (!hasTitleOrDescription) return

      element.innerHTML = getIframelyEmbedTemplate({ ...result })
    }
  })
}

export function getBodyAfterImageTagOptimization(body, domain, userId, articleId) {
  // 画像タグに以下の最適化を実施
  // ・alt属性の追加
  // ・サイズの指定
  // ・遅延ローディングの適用
  const imgTagPattern = String.raw`<img( alt="")? src="(https:\/\/${domain}\/d\/api\/articles_images\/${userId}\/${articleId}\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(jpeg|jpg|png))">`
  const imgTagRegexp = new RegExp(imgTagPattern, 'g')
  const blankImage = require('~/assets/images/pc/article/article_image_blank.png')
  return body.replace(
    imgTagRegexp,
    `<img alt="Content image" class="lazyload" data-src="$2?d=800x2160" src="${blankImage}">`
  )
}

export function formatTokenAmount(tokenAmount = 0) {
  const stringTokenAmount = tokenAmount.toString()
  const formatNumber = 10 ** 18
  const alisToken = new BigNumber(stringTokenAmount).div(formatNumber)
  return alisToken > 999 ? (alisToken / 1000).toFixed(2, 1) + 'k' : alisToken.toFixed(2, 1)
}

export function addOptimizeParamToImageUrl(url = '', param = '200x200') {
  const targetImageTypes = ['png', 'jpg', 'jpeg']
  const isTargetImage = targetImageTypes.some((imageType) => url.endsWith(imageType))
  return isTargetImage ? `${url}?d=${param}` : url
}
