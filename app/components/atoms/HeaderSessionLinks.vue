<template>
  <div class="session">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    </nuxt-link>
    <span class="login" @click="showLoginModal">ログイン</span>
    <app-button class="sign-up" @click="showSignUpModal">新規登録</app-button>
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
    },
    showLoginModal() {
      this.setLoginModal({ showLoginModal: true })
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
    border-radius: 4px;
    box-shadow: none;
    font-size: 14px;
    font-weight: 100;
    height: 34px;
    line-height: 34px;
    width: 96px;

    &:hover,
    &:focus {
      background: #0086cc;
    }
  }
}

@mixin spStyles() {
  .session {
    .search-icon {
      display: block;
      margin-right: 20px;
      width: 16px;
    }

    .login {
      font-size: 12px;
      margin-right: 16px;
    }

    .sign-up {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      width: 72px;
    }
  }
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    @include spStyles();
  }
}

@media screen and (max-width: 690px) {
  .session {
    .search-icon {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  @include spStyles();
}
</style>
