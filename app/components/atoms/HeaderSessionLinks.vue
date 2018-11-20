<template>
  <div class="session">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    </nuxt-link>
    <span class="login" @click="showLoginModal">ログイン</span>
    <app-button class="sign-up pc" @click="showSignUpModal">
      新規登録
    </app-button>
    <span class="sign-up sp" @click="showSignUpModal">
      新規登録
    </span>
  </div>
</template>

<script>
import AppButton from '../atoms/AppButton'
import { mapActions } from 'vuex'

export default {
  components: {
    AppButton
  },
  methods: {
    resetSearchStates() {
      this.resetSearchArticles()
      this.resetSearchArticlesPage()
      this.resetSearchArticlesIsLastPage()
      this.resetSearchUsers()
      this.resetSearchUsersPage()
      this.resetSearchUsersIsLastPage()
    },
    showSignUpModal() {
      this.setSignUpModal({ showSignUpModal: true })
      document.documentElement.scrollTop = 0
      if (window.innerWidth > 550) {
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    showLoginModal() {
      this.setLoginModal({ showLoginModal: true })
      document.documentElement.scrollTop = 0
      if (window.innerWidth > 550) {
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    ...mapActions('user', [
      'setSignUpModal',
      'setLoginModal',
      'resetSearchUsers',
      'resetSearchUsersPage',
      'resetSearchUsersIsLastPage'
    ]),
    ...mapActions('article', [
      'resetSearchArticles',
      'resetSearchArticlesPage',
      'resetSearchArticlesIsLastPage'
    ])
  }
}
</script>


<style lang="scss" scoped>
.session {
  grid-area: session;
  align-items: center;
  display: flex;

  .search-icon {
    cursor: pointer;
    margin-right: 40px;
    width: 24px;
  }

  .login {
    color: #6e6e6e;
    cursor: pointer;
    font-size: 14px;
    margin-right: 40px;
  }

  .sign-up {
    &.pc {
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: 100;
      height: 34px;
      line-height: 2.5;
      text-align: center;
      width: 96px;
      border-radius: 4px;
    }

    &.sp {
      display: none;
    }
  }
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    .session {
      .search-icon {
        width: 16px;
        margin-right: 20px;
      }

      .login {
        font-size: 12px;
        margin-right: 16px;

        &::after {
          content: '/';
          padding-left: 12px;
        }
      }

      .sign-up {
        &.pc {
          display: none;
        }

        &.sp {
          background: none;
          box-shadow: none;
          color: #6e6e6e;
          cursor: pointer;
          display: initial;
          font-size: 12px;
          height: auto;
          width: auto;
        }
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .session {
    .search-icon {
      width: 16px;
      margin-right: 20px;
    }

    .login {
      font-size: 12px;
      margin-right: 16px;

      &::after {
        content: '/';
        padding-left: 12px;
      }
    }

    .sign-up {
      &.pc {
        display: none;
      }

      &.sp {
        background: none;
        box-shadow: none;
        color: #6e6e6e;
        cursor: pointer;
        display: initial;
        font-size: 12px;
        height: auto;
        width: auto;
      }
    }
  }
}
</style>
