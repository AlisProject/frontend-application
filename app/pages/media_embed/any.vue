<template>
  <a href="hoge" target="_blank" class="iframely-embed-card">
    <div class="title">{{title}}</div>
    <div class="description">{{description}}</div>
    <img class="thumbnail" :src=src />
    <div class="site">{{site}}</div>
  </a>
</template>

<script>
export default {
  data() {
    return {
      src: null,
      title: null,
      description: null,
      site: null
    }
  },
  async mounted() {
    const response = await this.$axios.$get(
      `https://iframe.ly/api/iframely?api_key=${process.env.IFRAMELY_API_KEY}&url=${encodeURIComponent(this.$route.query.url)}&omit_script=1&omit_css=1`
    )
    console.log(response)
    this.title = response.meta.title
    this.description = response.meta.description
    this.site = response.url.split('/')[2]
    const links = response.links
    this.src = (links.thumbnail && links.thumbnail[0].href) || (links.icon && links.icon[0].href)
  }
}
</script>

<style lang="scss">
.twitter-profile-card {
  border-radius: 4px;
  border: 1px solid #e2e8ed;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 20px;
  text-decoration: none;
  width: 100%;
  height: 120px;
  position: relative;

  .title {
    color: #030303;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .description {
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.7px;
    line-height: 1.5;
    margin-bottom: 8px;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-align: left;
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  .site {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
  }
}
</style>
