<template>
  <a :href="href" target="_blank" class="iframely-embed-card">
    <div class="title" :class="{'without-space': !hasThumbnail}">{{title}}</div>
    <div class="description" :class="{'without-space': !hasThumbnail}">{{description}}</div>
    <img class="thumbnail" :src=src v-if="hasThumbnail" />
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
      site: null,
      href: null,
      hasThumbnail: false
    }
  },
  async mounted() {
    this.href = encodeURIComponent(this.$route.query.url)
    const response = await this.$axios.$get(
      `https://iframe.ly/api/iframely?api_key=${
        process.env.IFRAMELY_API_KEY
      }&url=${this.href}&omit_script=1&omit_css=1`
    )
    this.title = response.meta.title
    this.description = response.meta.description
    this.site = response.url.split('/')[2]
    const links = response.links
    this.src = (links.thumbnail && links.thumbnail[0].href) || (links.icon && links.icon[0].href)
    this.hasThumbnail = Boolean(this.src)
  }
}
</script>

<style lang="scss">
.iframely-embed-card {
  border-radius: 4px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  height: 140px;
  padding: 20px;
  position: relative;
  text-decoration: none;
  width: 100%;

  .title {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    color: #030303;
    display: -webkit-box;
    font-size: 16px;
    font-weight: 500;
    height: 22px;
    letter-spacing: 0.8px;
    line-height: 1.5;
    margin: 0 120px 10px 0;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    word-break: break-word;

    &.without-space {
      margin: 0 0 10px 0;
    }
  }

  .description {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #6e6e6e;
    display: -webkit-box;
    font-size: 14px;
    font-weight: 500;
    height: 42px;
    letter-spacing: 0.7px;
    line-height: 1.6;
    margin: 0 120px 10px 0;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    word-break: break-word;

    &.without-space {
      margin: 0 0 10px 0;
    }
  }

  .thumbnail {
    height: 100px;
    object-fit: cover;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 100px;
  }

  .site {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
  }
}
</style>
