<template>
  <app-button @click="publish">
    公開する
  </app-button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { BigNumber } from 'bignumber.js'
import AppButton from '../atoms/AppButton'

const FORMAT_NUMBER = 10 ** 18

export default {
  components: {
    AppButton
  },
  computed: {
    ...mapGetters('article', [
      'articleId',
      'title',
      'thumbnail',
      'suggestedThumbnails',
      'topics',
      'topicType',
      'tags'
    ]),
    ...mapGetters('user', ['selectPayment', 'currentUserInfo'])
  },
  methods: {
    handleScroll() {
      this.isFixed = window.scrollY >= 100
    },
    async publish() {
      try {
        const { articleId, title, topicType } = this
        const body = this.getBody()
        const paidBody = this.getPaidBody()
        const formattedPrice = new BigNumber(this.selectPayment.price)
        const price = formattedPrice.multipliedBy(FORMAT_NUMBER).toString(10)
        const articleTitle = { title }
        const articleBody = { body }
        // タグのデータ形式をAPIに適するように整形
        const tags = this.tags.map((tag) => tag.text)

        if (location.href.includes('/me/articles/draft')) {
          await this.putDraftArticleTitle({ articleTitle, articleId })
          await this.putDraftArticleBody({ articleBody, articleId })
          await this.publishDraftArticleWithHeader({
            articleId,
            topic: topicType,
            tags,
            eyeCatchUrl: this.thumbnail,
            price,
            paidBody
          })
        } else if (location.href.includes('/me/articles/public')) {
          await this.putPublicArticleTitle({ articleTitle, articleId })
          await this.putPublicArticleBody({ articleBody, articleId })
          await this.republishPublicArticleWithHeader({
            articleId,
            topic: topicType,
            tags,
            eyeCatchUrl: this.thumbnail,
            price,
            paidBody
          })
        }
        this.$router.push(`/${this.currentUserInfo.user_id}/articles/${articleId}`)
        this.sendNotification({ text: '記事を公開しました' })
        this.resetArticleTopic()

        if (!this.currentUserInfo.is_created_article) {
          this.setFirstProcessModal({ isShow: true })
          this.setFirstProcessCreatedArticleModal({ isShow: true })
        }
      } catch (e) {
        this.sendNotification({ text: '記事の公開に失敗しました', type: 'warning' })
        console.error(e)
      }
    },
    getBody() {
      let body = ''

      Array.from(document.querySelectorAll('.area-content > *')).some((elm) => {
        if (Array.from(elm.classList).includes('paywall-line')) return true
        if (Array.from(elm.classList).includes('paywall-line-next')) return
        body += this.getTargetElementInnerHTML(elm)
      })
      return body
    },
    getPaidBody() {
      let paidBpdy = ''

      Array.from(document.querySelectorAll('.area-content > *'), (elm) => {
        if (Array.from(elm.classList).includes('paywall-line-next')) return
        paidBpdy += this.getTargetElementInnerHTML(elm)
      })
      return paidBpdy
    },
    getTargetElementInnerHTML(element) {
      const div = document.createElement('div')
      const tmpElement = element.cloneNode(true)
      if (
        tmpElement.children &&
        tmpElement.children[0] &&
        tmpElement.children[0].nodeName === 'OEMBED'
      ) {
        tmpElement.children[0].innerHTML = ''
      }
      div.appendChild(tmpElement)
      return div.innerHTML
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', [
      'updateThumbnail',
      'publishDraftArticleWithHeader',
      'republishPublicArticleWithHeader',
      'putDraftArticleTitle',
      'putDraftArticleBody',
      'putPublicArticleTitle',
      'putPublicArticleBody',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'updateBody',
      'setIsSaving',
      'getTopics',
      'resetArticleTopic',
      'setArticleTopic'
    ]),
    ...mapActions('user', ['setFirstProcessModal', 'setFirstProcessCreatedArticleModal'])
  }
}
</script>

<style lang="scss" scoped></style>
