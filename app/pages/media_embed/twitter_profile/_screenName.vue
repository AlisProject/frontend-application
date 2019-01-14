<template>
    <a href="aaa" target="_blank" class="twitter-profile-card">
      <div class="title">{{title}}</div>
      <div class="description">{{description}}</div>
      <div class="site">twitter.com</div>
    </a>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      title: null,
      description: null,
      profileName: null
    }
  },
  async mounted() {
    const API_KEY = '518401c27d170fda5a9fbc'
    console.log(this.$route.params.screenName)
    const twitterProfileName = this.$route.params.screenName
    this.profileName = twitterProfileName
    const response = await axios.get(
      `https://iframe.ly/api/oembed?api_key=${API_KEY}&url=${encodeURIComponent(`twitter.com/${twitterProfileName}`)}&omit_script=1&omit_css=1`
    )
    console.log(response)
    this.title = response.data.title
    this.description = response.data.description
  }
}
</script>
