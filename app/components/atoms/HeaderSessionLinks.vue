<template>
  <div class="session">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    </nuxt-link>
    <span class="session-link sign-up" @click="showSignUpModal">Sign up</span>
    <span class="divider">/</span>
    <span class="session-link login" @click="showLoginModal">Login</span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    resetSearchStates() {
      this.resetSearchArticles()
      this.resetSearchArticlesPage()
      this.resetSearchUsers()
      this.resetSearchUsersPage()
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
      'resetSearchUsersPage'
    ]),
    ...mapActions('article', ['resetSearchArticles', 'resetSearchArticlesPage'])
  }
}
</script>


<style lang="scss" scoped>
.session {
  border-top: 6px solid #858dda;
  padding-top: 38px;
  position: fixed;
  right: -49px;
  text-align: right;
  top: 170px;
  transform: rotate(90deg);
  width: 160px;

  .search-icon {
    float: left;
    padding-right: 4px;
    transform: rotate(-90deg);
    width: 16px;
    cursor: pointer;
  }

  .session-link {
    color: #6e6e6e;
    text-decoration: none;
    cursor: pointer;
  }

  .divider {
    color: #6e6e6e;
    margin: 0 4px;
  }
}

@media screen and (max-width: 920px) {
  .article-container {
    .session {
      border: none;
      grid-area: session;
      padding: 0;
      position: static;
      right: -46px;
      transform: rotate(0);
      width: 100%;

      .search-icon {
        padding: 2px 4px;
        transform: rotate(0);
      }

      .session-link {
        font-size: 12px;
      }

      .divider {
        font-size: 12px;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .session {
    border: none;
    grid-area: session;
    padding: 0;
    position: static;
    right: -46px;
    transform: rotate(0);
    width: 100%;
    display: flex;
    align-items: center;

    .search-icon {
      transform: rotate(0);
    }

    .session-link {
      font-size: 12px;
    }

    .divider {
      font-size: 12px;
    }
  }
}
</style>
