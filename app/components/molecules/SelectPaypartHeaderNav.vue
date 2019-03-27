<template>
  <nav class="area-nav" :class="{ 'is-fixed': isFixed }">
    <div class="area-nav-inner">
      <app-button class="area-post-article" @click="publish">
        公開する
      </app-button>
    </div>
  </nav>
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
  data() {
    return {
      isFixed: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
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
        const price = formattedPrice.multipliedBy(FORMAT_NUMBER)
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
      } catch (error) {
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

<style lang="scss" scoped>
.area-nav {
  background: #fff;
  display: grid;
  grid-area: nav;
  height: 74px;
  text-align: center;
  transition: box-shadow 400ms ease;
  width: 100%;
  z-index: 2001;
  /* prettier-ignore */
  grid-template-areas:
    "nav-inner";

  .area-nav-inner {
    display: grid;
    grid-area: nav-inner;
    grid-template-columns: 1fr min-content;
    margin: auto;
    width: 640px;
    /* prettier-ignore */
    grid-template-areas:
      "... post-article";

    .area-post-article {
      grid-area: post-article;
      border-radius: 4px;
      border-radius: 4px;
      box-shadow: none;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 100;
      height: 34px;
      line-height: 2.5;
      text-align: center;
      width: 96px;

      &:hover,
      &:focus {
        background: #0086cc;
      }

      &.disable {
        cursor: not-allowed;
      }
    }
  }

  &.is-fixed {
    box-shadow: 0 12px 12px -12px rgba(192, 192, 192, 0.7);
    left: 0;
    position: fixed;
    right: 0;
  }
}

@media screen and (max-height: 414px) {
  .area-nav {
    &.is-fixed {
      position: static;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-nav {
    background: #fff;
    display: grid;
    grid-area: nav;
    height: 74px;
    text-align: center;
    transition: box-shadow 400ms ease;
    width: 100%;
    z-index: 2001;
    /* prettier-ignore */
    grid-template-areas:
      "nav-inner";

    .area-nav-inner {
      display: grid;
      grid-area: nav-inner;
      grid-template-columns: 1fr min-content 12px;
      margin: auto;
      width: 100%;
      /* prettier-ignore */
      grid-template-areas:
        "... post-article ...";
    }
  }
}
</style>
