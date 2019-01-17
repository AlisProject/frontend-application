<template>
  <div class="modal-body">
    <div class="wrapper">
      <p class="description">
        あなたのいいねが<span class="br"/>みんなのやる気を支えます。<br>
        次はあなたが記事を投稿し、<span class="br"/>いいねを獲得してみませんか？
      </p>
      <p class="description-sp">
        スマートフォンでの記事作成機能は<span class="br-small"/>近日リリースいたします<br>
        パソコンで記事を作成してください
      </p>
      <app-button class="submit" @click="submit">
        記事を作成する
      </app-button>
      <app-button class="close" @click="close">
        閉じる
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  mounted() {
    this.putFirstProcessLikedArticle()
  },
  methods: {
    submit() {
      location.href = '/me/articles/new'
    },
    close() {
      this.setFirstProcessModal({ isShow: false })
      this.setFirstProcessLikedArticleModal({ isShow: false })
    },
    ...mapActions('user', [
      'setFirstProcessModal',
      'setFirstProcessLikedArticleModal',
      'putFirstProcessLikedArticle'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;
  display: flex;
}

.wrapper {
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: url('~assets/images/pc/bg/first-process-liked-article.png') no-repeat;
  background-size: auto 280px;
  background-position-x: center;
  margin: -50px -30px 0;
  height: 100%;

  .description {
    color: #030303;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1.37px;
    line-height: 1.5;
    margin: 310px 0 0;
    padding: 0 30px;
  }

  .description-sp {
    display: none;
  }

  .submit {
    margin: 40px 0 0;
  }

  .close {
    margin: 20px 0 60px;
    background: #fff;
    border: 1px solid #0086cc;
    color: #0086cc;
    font-weight: bold;
    box-shadow: none;

    &:hover,
    &:focus {
      background: #fff;
    }
  }
}

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .wrapper {
    background-size: auto 320px;

    .description {
      font-size: 20px;
      margin: 340px 0 0;
      padding: 0;
    }

    .description-sp {
      color: #6e6e6e;
      display: block;
      font-size: 12px;
      line-height: 1.5;
      margin: 30px 0 0;
      text-align: center;
    }

    .submit {
      display: none;
    }
  }
}

@media screen and (max-width: 320px) {
  .br-small {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .wrapper {
    background-size: auto 240px;

    .description {
      font-size: 18px;
      margin: 260px 0 0;
    }
  }
}
</style>
