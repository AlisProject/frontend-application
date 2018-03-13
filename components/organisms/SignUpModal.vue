<template>
  <transition name="modal">
    <div class="modal-mask" @click="closeModalIfModalWrapperClicked">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <span class="modal-default-button" @click="closeModal">
              ✕
            </span>
          </div>
          <div class="modal-body">
            <h2 class="title">
              SIGN UP
            </h2>
            <form class="signup-form">
              <label class="signup-form-label">ALIS ID</label>
              <input class="signup-form-input" type="text" placeholder="alis">
              <label class="signup-form-label">メールアドレス</label>
              <input class="signup-form-input" type="email" placeholder="yamada@alismedia.com">
              <label class="signup-form-label">パスワード</label>
              <input class="signup-form-input" type="password" placeholder="●●●●●●●">
            </form>
            <p class="signup-form-description">
              現在、新規の登録はβ版登録ユーザーのみに限らせていただいています。
              登録希望の方は<a href="#">ウェイティングリスト</a>にご登録ください。
            </p>
          </div>
          <div class="modal-footer">
            <p class="agreement-confirmation">
              <nuxt-link to="#">利用規約</nuxt-link>、<nuxt-link to="#">プライバシーポリシー</nuxt-link>に同意して
            </p>
            <nuxt-link to="#" class="registration-button">
              登録する
            </nuxt-link>
            <p class="for-login-user">
              ログインされる方は<nuxt-link to="#">こちら</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    closeModal() {
      this.setSignUpModal({ showSignUpModal: false })
    },
    closeModalIfModalWrapperClicked() {
      if (event.target.className === 'modal-wrapper') {
        this.closeModal()
      }
    },
    ...mapActions('user', ['setSignUpModal'])
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  background-color: rgba(0, 0, 0, 0.8);
  display: table;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  transition: opacity 0.3s ease;
  width: 100%;
  z-index: 9998;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  margin: 10px auto;
  max-width: 800px;
  padding: 20px 30px;
  transition: all 0.3s ease;
  width: 80%;

  .title {
    color: #030303;
    font-family: Times;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.2em;
    line-height: 24px;
    margin: 50px 20px 0;
    text-align: center;
  }
}

.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 60px auto 0;
    max-width: 400px;
    width: 80%;

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 20px;
    }

    &-input {
      border: none;
      border-bottom: 1px dotted #232538;
      margin-bottom: 30px;
      padding: 5px 0;
      width: 100%;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
      }

      &:focus {
        outline: 0;
      }
    }

    &-description {
      color: #6e6e6e;
      font-size: 12px;
      line-height: 18px;
      margin: 0 auto;
      max-width: 400px;
      width: 80%;

      a {
        color: #858dda;
        text-decoration: none;
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 90px auto 40px;

  .agreement-confirmation {
    height: 14px;
    color: #6e6e6e;
    font-size: 12px;
    line-height: 18px;
    text-align: center;

    a {
      color: #858dda;
      text-decoration: none;
    }
  }

  .registration-button {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    box-shadow: 0 0 10px gray;
    color: #fff;
    display: block;
    font-size: 13px;
    margin: 20px auto 0;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 255px;
  }

  .for-login-user {
    color: #6e6e6e;
    font-size: 12px;
    height: 14px;
    line-height: 18px;
    text-align: right;

    a {
      color: #858dda;
      text-decoration: none;
    }
  }
}

.modal-default-button {
  color: #6e6e6e;
  cursor: pointer;
  float: right;
  font-size: 26px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>
