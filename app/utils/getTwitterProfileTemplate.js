export default ({ url, title, description }) => {
  return `<div data-alis-iframely-url="${url}" contenteditable="false">
    <a href="${url}" target="_blank" class="twitter-profile-card">
      <div class="title">${title}</div>
      <div class="description">${description}</div>
      <div class="site">twitter.com</div>
    </a>
  </div>`
}
