<template>
  <div :class="`select-paypart-container ${deviceType}`">
    <app-header />
    <select-paypart-header-nav />
    <select-paypart-editor
      :title="decodedTitle"
      :update-article-title="updateArticleTitle"
      :put-article-body="putDraftArticleBody"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import SelectPaypartHeaderNav from '../molecules/SelectPaypartHeaderNav'
import SelectPaypartEditor from '../organisms/SelectPaypartEditor'
import { htmlDecode } from '~/utils/article'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    AppHeader,
    SelectPaypartHeaderNav,
    SelectPaypartEditor
  },
  data() {
    return {
      deviceType: 'pc'
    }
  },
  mounted() {
    if (isIOS()) {
      this.deviceType = 'ios'
      return
    }
    if (isAndroid()) this.deviceType = 'android'
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    },
    ...mapGetters('article', ['articleId', 'title', 'body'])
  },
  methods: {
    ...mapActions('article', ['putDraftArticleTitle', 'gotArticleData', 'putDraftArticleBody']),
    async updateArticleTitle() {
      if (!this.gotArticleData) return
      const { title, articleId } = this
      const articleTitle = { title }
      await this.putDraftArticleTitle({ articleTitle, articleId })
    }
  }
}
</script>

<style lang="scss" scoped>
.pc,
.ios,
.android {
  &.select-paypart-container {
    display: grid;
    grid-template-rows: 100px 74px 50px 650px 75px;
    grid-template-columns: 1fr 640px 1fr;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header app-header"
      "nav        nav        nav       "
      "...        ...        ...       "
      "...        editor     ...       "
      "...        ...        ...       ";
  }
}

@media screen and (max-width: 640px) {
  .select-paypart-container.ios,
  .select-paypart-container.android {
    grid-template-rows: 66px min-content min-content min-content min-content;
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
