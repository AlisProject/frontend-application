<template>
  <div class="modal-body">
    <div class="wrapper">
      <p class="description">
        はじめてのALIS獲得<span class="br"/>おめでとうございます！<br>
        ALISでの新たな出会いを<span class="br"/>お楽しみください。
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
    this.putFirstProcessGotToken()
  },
  methods: {
    submit() {
      location.href = '/me/articles/new'
    },
    close() {
      this.setFirstProcessModal({ isShow: false })
      this.setFirstProcessGotTokeneModal({ isShow: false })
    },
    ...mapActions('user', [
      'setFirstProcessModal',
      'setFirstProcessGotTokeneModal',
      'putFirstProcessGotToken'
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
  background: url('~assets/images/pc/bg/first-process-got-token.png') no-repeat;
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
    padding: 0 40px;
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

    .submit {
      margin: 30px auto 0;
    }
  }
}

@media screen and (max-width: 320px) {
  .wrapper {
    background-size: auto 240px;

    .description {
      font-size: 18px;
      margin: 260px 0 0;
    }
  }
}
</style>
