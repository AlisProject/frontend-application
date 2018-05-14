/* eslint-disable no-undef */
export default ({ $axios }) => {
  document.querySelectorAll('[data-alis-iframely-url]').forEach(async (element) => {
    const { alisIframelyUrl } = element.dataset
    const isTweet = alisIframelyUrl.split('/')[4] === 'status'
    if (isTweet) {
      element.innerHTML = `<a href="${alisIframelyUrl}" data-iframely-url></a>`
    } else {
      const result = await $axios.$get(
        `https://iframe.ly/api/oembed?api_key=${process.env.IFRAMELY_API_KEY}&url=${alisIframelyUrl}`
      )
      element.innerHTML = `
      <div data-alis-iframely-url="${alisIframelyUrl}" contenteditable="false">
        <a href="${result.url}" target="_blank" class="twitter-profile-card">
          <div class="title">${result.title}</div>
          <div class="description">${result.description}</div>
          <div class="site">twitter.com</div>
        </a>
      </div>
      <br>`
    }
    iframely.load()
  })
}
