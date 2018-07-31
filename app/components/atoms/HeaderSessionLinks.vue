<template>
  <div class="session">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="search">
    </nuxt-link>
    <span class="session-link sign-up" @click="showSignUpModal">Sign up</span>
    /
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
  top: 340px;
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
    color: #525256;
    text-decoration: none;
    cursor: pointer;
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
      top: 340px;
      transform: rotate(0);
      width: 160px;

      .search-icon {
        float: left;
        padding: 2px 4px;
        transform: rotate(0);
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
    top: 340px;
    transform: rotate(0);
    width: 160px;

    .search-icon {
      float: left;
      padding: 2px 4px;
      transform: rotate(0);
    }
  }
}
</style>
