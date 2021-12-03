<template>
  <div class="modal-body">
    <div class="article-delete-modal-content">
      <p class="confirm-text">
        本当に削除してもよろしいですか？
      </p>
      <p class="caution-text">
        ※ 削除した記事は元に戻せません。
      </p>
      <app-button class="report-button" :disabled="isProcessing" @click="deleteArticle">
        削除する
      </app-button>
      <app-button class="close-button" type="secondary" @click="closeModal">
        閉じる
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  data() {
    return {
      isProcessing: false
    }
  },
  computed: {
    ...mapGetters('article', ['articleId']),
    ...mapGetters('user', ['currentUserInfo'])
  },
  methods: {
    async deleteArticle() {
      try {
        if (this.isProcessing) return
        this.isProcessing = true
        await this.deleteArticleDraft({ articleId: this.articleId })
        this.setArticleDeleteModal({ isShow: false })
        this.$router.push(`/users/${this.currentUserInfo.user_id}/drafts`)
        this.sendNotification({ text: '該当記事を削除しました' })
      } catch (error) {
        this.setArticleDeleteModal({ isShow: false })
        const text = 'エラーが発生しました。しばらく時間を置いて再度お試しください'
        this.sendNotification({ text, type: 'warning' })
      } finally {
        this.isProcessing = false
      }
    },
    closeModal() {
      this.setArticleDeleteModal({ isShow: false })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('articleModals', ['setArticleDeleteModal']),
    ...mapActions('article', ['deleteArticleDraft'])
  }
}
</script>

<style lang="scss" scoped>
.confirm-text {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  padding: 50px 0 0;
  display: block;
}
.caution-text {
  color: red;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  display: block;
}

.report-button {
  margin: 60px auto 0;
}

.close-button {
  margin: 20px auto 100px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 20vh 0 0;
  }

  .close-button {
    margin: 20px auto 30vh;
  }
}
</style>
