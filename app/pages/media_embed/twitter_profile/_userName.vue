<template>
  <a :href=href target="_blank" class="twitter-profile-card">
    <div class="title">{{title}}</div>
    <div class="description">{{description}}</div>
    <div class="site">twitter.com</div>
  </a>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      description: null,
      profileName: null,
      href: null
    }
  },
  async mounted() {
    const twitterProfileName = this.$route.params.userName
    this.href = encodeURI(`https://twitter.com/${twitterProfileName}`)
    this.profileName = twitterProfileName
    const response = await this.$axios.$get(
      `https://iframe.ly/api/oembed?api_key=${
        process.env.IFRAMELY_API_KEY
      }&url=${encodeURIComponent(`twitter.com/${twitterProfileName}`)}&omit_script=1&omit_css=1`
    )
    this.title = response.title
    this.description = response.description
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
  height: 140px;
  padding: 20px;
  text-decoration: none;
  width: 100%;

  .title {
    color: #030303;
    font-size: 16px;
    font-weight: 500;
    height: 22px;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .description {
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
    height: 42px;
    letter-spacing: 0.7px;
    line-height: 1.6;
    margin: 0 10px 10px 0;
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
