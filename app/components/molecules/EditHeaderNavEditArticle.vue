<template>
  <div class="area-post-article">
    <span @click="unpublish" class="nav-link unpublish-article">
      下書きに戻す
    </span>
    <a :href="`/me/articles/public/${this.$route.params.articleId}/edit`" class="nav-link post-article">
      編集
    </a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  methods: {
    async unpublish() {
      const { articleId } = this.$route.params
      try {
        await this.unpublishPublicArticle({ articleId })
        this.$router.push('/me/articles/public')
        this.sendNotification({ text: '記事を下書きに戻しました' })
      } catch (e) {
        this.sendNotification({ text: '記事を下書きに戻せませんでした', type: 'warning' })
        console.error(e)
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['unpublishPublicArticle'])
  }
}
</script>


<style lang="scss" scoped>
.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #858dda;
}

.area-post-article {
  grid-area: post-article;

  .unpublish-article {
    cursor: pointer;
    margin-right: 32px;
  }

  .post-article {
    cursor: pointer;
    user-select: none;
    display: inline-block;

    &.disable {
      cursor: not-allowed;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-post-article {
    display: none;
  }
}
</style>
