<template>
  <div class="logged-in">
    <img
      class="profile-icon"
      :src="currentUserInfo.icon_image_url"
      @click="toggleMenu"
      v-if="currentUserInfo.icon_image_url !== undefined">
    <img
      class="profile-icon"
      src="~assets/images/pc/common/icon_user_noimg.png"
      @click="toggleMenu"
      v-else>
    <img class="notification-icon" src="~assets/images/pc/common/icon_notification_none.png">
    <img class="search-icon" src="~assets/images/pc/common/icon_search_none.png">
    <div class="menu" v-if="isMenuShown">
      <div class="image-box">
        <img
          :src="currentUserInfo.icon_image_url"
          class="profile-image"
          v-if="currentUserInfo.icon_image_url !== undefined">
        <img
          src="~assets/images/pc/common/icon_user_noimg.png"
          class="profile-image"
          v-else>
      </div>
      <div class="token-amount">
        <p class="alis-hold-amount">ALIS保有数</p>
        <p class="alis-token-amount">0 <span class="token-unit">ALIS</span></p>
      </div>
      <ul class="menu-links">
        <li class="menu-link">
          <a href="/me/articles/new">新規記事作成</a>
        </li>
        <li class="menu-link">
          <nuxt-link to="/me/articles/public">記事一覧</nuxt-link>
        </li>
        <li class="menu-link" @click="showProfileSettingsModal">
          ユーザー設定
        </li>
      </ul>
      <span class="logout" @click="logoutUser">ログアウト</span>
    </div>
    <div class="cover" v-show="isMenuShown" @click="closeMenu"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      isMenuShown: false
    }
  },
  mounted() {
    this.setCurrentUserInfo()
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeMenu()
      }
    })
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    ...mapGetters('user', ['currentUserInfo'])
  },
  methods: {
    toggleMenu() {
      if (!this.isMenuShown) {
        this.forbidScroll()
      } else {
        this.resetScroll()
      }
      this.isMenuShown = !this.isMenuShown
    },
    closeMenu() {
      this.isMenuShown = false
      this.resetScroll()
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    logoutUser() {
      try {
        this.logout()
        this.$router.push('/')
        this.sendNotification({ text: 'ログアウトしました' })
      } catch (error) {
        console.error(error)
      }
    },
    showProfileSettingsModal() {
      window.scrollTo(0, 0)
      this.setProfileSettingsModal({ showProfileSettingsModal: true })
      this.forbidScroll()
    },
    forbidScroll() {
      if (window.innerWidth <= 550) {
        window.scrollTo(0, 0)
      }
      if (window.innerWidth <= 920) {
        if (document.querySelector('[class$=-article-list-container]')) {
          document.querySelector('[class$=-article-list-container]').style.overflowY = 'visible'
        }
        document.querySelector('html,body').style.overflow = 'hidden'
        window.addEventListener('touchmove', this.scrollOff, false)
      }
    },
    resetScroll() {
      if (window.innerWidth <= 920) {
        if (document.querySelector('[class$=-article-list-container]')) {
          document.querySelector('[class$=-article-list-container]').style.overflowY = 'auto'
        }
        document.querySelector('html,body').style.overflow = ''
        window.removeEventListener('touchmove', this.scrollOff, false)
      }
    },
    scrollOf(e) {
      e.preventDefault()
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['logout', 'setProfileSettingsModal', 'setCurrentUserInfo'])
  }
}
</script>

<style lang="scss" scoped>
.logged-in {
  border-top: 6px solid #858dda;
  padding-top: 10px;
  position: fixed;
  right: -28.5px;
  top: 340px;
  transform: rotate(90deg);
  width: 134px;

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    float: left;
    height: 60px;
    transform: rotate(-90deg);
    width: 60px;
  }

  .notification-icon {
    float: left;
    margin: 20px 10px 0 16px;
    transform: rotate(-90deg);
    width: 16px;
    cursor: not-allowed;
  }

  .search-icon {
    float: left;
    margin: 20px 10px 0 5px;
    transform: rotate(-90deg);
    width: 16px;
    cursor: not-allowed;
  }
}

.menu {
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000000;
  filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.5));
  padding: 24px 41px;
  position: absolute;
  right: 108px;
  transform: rotate(-90deg);
  width: 240px;

  &:before {
    content: '';
    height: 0;
    position: absolute;
    right: 0;
    width: 0;
  }

  &:before {
    border-bottom: 20px solid transparent;
    border-left: 40px solid white;
    border-right: 0px solid transparent;
    border-top: 20px solid transparent;
    margin: -20px -20px 0 0;
    top: 340px;
  }

  .image-box {
    height: 160px;
    margin: -24px 0 0 -41px;
    overflow: hidden;
    width: 240px;

    .profile-image {
      object-fit: cover;
      width: 100%;
    }
  }

  .token-amount {
    color: #040404;

    .alis-hold-amount {
      background: url('~assets/images/pc/common/icon_alistoken.png') no-repeat;
      background-size: 18px;
      font-size: 14px;
      line-height: 18px;
      margin: 30px 20px 0;
      padding-left: 24px;
      width: 100px;
    }

    .alis-token-amount {
      font-size: 28px;
      font-weight: bold;
      margin-top: 10px;
      text-align: center;

      .token-unit {
        font-size: 14px;
      }
    }
  }

  .menu-links {
    list-style: none;
    padding: 0;

    .menu-link {
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      height: 24px;
      letter-spacing: 1px;
      line-height: 24px;
      margin-bottom: 12px;
      padding-left: 0.5em;
      width: 119px;

      a {
        display: block;
        text-decoration: none;
        color: #000;

        &:visited {
          color: #000;
        }
      }
    }
  }

  .logout {
    color: #000;
    cursor: pointer;
    font-size: 14px;
    line-height: 21px;
    margin-left: 6px;
    text-decoration: none;

    &:visited {
      color: #000;
    }
  }
}

@media screen and (max-width: 920px) {
  .article-container {
    .logged-in {
      border: none;
      grid-area: session;
      padding: 0;
      position: static;
      right: -46px;
      top: 340px;
      transform: rotate(0);
      width: 160px;

      .profile-icon {
        border-radius: 50%;
        float: right;
        height: 50px;
        transform: rotate(0);
        width: 50px;
        margin-top: -16px;
      }

      .notification-icon {
        float: right;
        margin: 2px 20px 0 0;
        transform: rotate(0);
      }

      .search-icon {
        float: right;
        margin: 4px 22px 0 0;
        transform: rotate(0);
      }
    }

    .menu {
      right: -16px;
      top: -26px;
      width: 280px;
      transform: rotate(0);

      &:before {
        display: none;
      }

      .image-box {
        height: 160px;
        width: 280px;
      }

      .menu-links {
        list-style: none;
        padding: 0;
        margin-bottom: 40px;

        .menu-link {
          margin-bottom: 20px;
        }
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .logged-in {
    border: none;
    grid-area: session;
    padding: 0;
    position: static;
    right: -46px;
    top: 340px;
    transform: rotate(0);
    width: 160px;

    .profile-icon {
      border-radius: 50%;
      float: right;
      height: 50px;
      transform: rotate(0);
      width: 50px;
      margin-top: -16px;
    }

    .notification-icon {
      float: right;
      margin: 2px 20px 0 0;
      transform: rotate(0);
    }

    .search-icon {
      float: right;
      margin: 5px 22px 0 0;
      transform: rotate(0);
    }
  }

  .menu {
    right: -16px;
    top: -26px;
    width: 280px;
    transform: rotate(0);
    z-index: 1;
    height: 101vh;

    &:before {
      display: none;
    }

    .image-box {
      height: 160px;
      width: 280px;
    }

    .menu-links {
      list-style: none;
      padding: 0;
      margin-bottom: 40px;

      .menu-link {
        margin-bottom: 20px;
      }
    }
  }

  .cover {
    background: black;
    border-radius: 4px;
    box-sizing: border-box;
    color: #000000;
    filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.5));
    height: 4000px;
    opacity: 0.5;
    position: absolute;
    right: -16px;
    top: -26px;
    transform: rotate(-90deg);
    transform: rotate(0);
    width: 100vw;
    z-index: -1;
  }
}
</style>
