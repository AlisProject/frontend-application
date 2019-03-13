<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      この記事はスマートフォンでは編集できません
    </p>
    <p class="confirm-description">
      モバイルエディタリリース前に作成された記事はスマートフォンでの編集を行うことができません。編集の際にはPCをご利用ください。
    </p>
    <app-button class="back-button" @click="closeModal">
      公開中記事一覧に戻る
    </app-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  methods: {
    closeModal() {
      this.setRestrictEditArticleModal({ showRestrictEditArticleModal: false })
      this.$router.push(`/users/${this.currentUserInfo.user_id}`)
    },
    ...mapActions('user', ['setRestrictEditArticleModal'])
  },
  computed: {
    ...mapGetters('user', ['currentUserInfo'])
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
  margin: 60px auto;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 30vh 0 0;
  }
}
</style>
