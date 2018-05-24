<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      記事の編集はスマートフォンサイズの画面ではご利用になれません
    </p>
    <p class="confirm-description">
      スマートフォンのブラウザではALISの提供する
      書き心地を提供することができないため記事の
      作成・編集を行うことができません。大変恐縮
      ですが、PCをご利用ください。また、アプリの
      開発をお待ち頂けると幸いです。
    </p>
    <button class="back-button" @click="closeModal">
      公開済み記事一覧に戻る
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    closeModal() {
      this.setRestrictEditArticleModal({ showRestrictEditArticleModal: false })
      document.querySelector('html,body').style.overflow = ''
      this.$router.push('/me/articles/public')
    },
    ...mapActions('user', ['setRestrictEditArticleModal'])
  }
}
</script>

<style lang="scss" scoped>
.confirm-text {
  color: #030303;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  padding: 50px 30px 0;
  display: block;
}

.confirm-description {
  @include default-text();
  text-align: center;
  padding: 1em 30px;
  display: block;
}

.back-button {
  @include default-button();
  margin: 60px auto;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 30vh 0 0;
  }
}
</style>
