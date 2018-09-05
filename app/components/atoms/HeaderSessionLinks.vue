<template>
  <div class="session">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    </nuxt-link>
    <span class="login" @click="showLoginModal">ログイン</span>
    <span class="sign-up" @click="showSignUpModal">新規登録</span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
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
    background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
    border-radius: 4px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 100;
    height: 34px;
    line-height: 2.5;
    text-align: center;
    width: 96px;
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
      background: none;
      box-shadow: none;
      color: #6e6e6e;
      font-size: 12px;
      height: auto;
      width: auto;
    }
  }
}
</style>
