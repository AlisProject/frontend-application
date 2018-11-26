<template>
  <div class="logged-in">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png">
    </nuxt-link>
    <span class="notification-link" @click="moveToNotificationPage">
      <img
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification_mark.png"
        v-if="unreadNotification">
      <img
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification.png"
        v-else>
    </span>
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
        <p class="alis-token-amount">{{ formattedAlisToken }} ALIS</p>
      </div>
      <ul class="menu-links">
        <li class="menu-link">
          <nuxt-link class="reset-link-style" to="/me/articles/new" event="">
            <span class="menu-link-inner" @click="moveToNewArticlePage">
              新規記事作成
            </span>
          </nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link class="reset-link-style" to="/me/articles/public" event="">
            <span class="menu-link-inner" @click="moveToPublicArticlesPage">
              記事一覧
            </span>
          </nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link class="menu-link-inner" :to="`/users/${currentUserInfo.user_id}`">マイページ</nuxt-link>
        </li>
        <li class="menu-link" @click="showProfileSettingsModal">
          <span class="menu-link-inner">
            ユーザー設定
          </span>
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
import { BigNumber } from 'bignumber.js'

export default {
  data() {
    return {
      isMenuShown: false
    }
  },
  async mounted() {
    try {
      await Promise.all([
        this.setCurrentUserInfo(),
        this.getUnreadNotification(),
        this.getUsersAlisToken()
      ])
    } catch (error) {
      console.error(error)
    }
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
    formattedAlisToken() {
      return new BigNumber(this.alisToken).toFixed(3, 1)
    },
    ...mapGetters('user', ['currentUserInfo', 'alisToken', 'unreadNotification', 'currentUser'])
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
    toggleMenu() {
      if (!this.isMenuShown) {
        this.getUsersAlisToken()
      }
      this.isMenuShown = !this.isMenuShown
    },
    closeMenu() {
      this.isMenuShown = false
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
        location.href = '/'
        this.sendNotification({ text: 'ログアウトしました。' })
      } catch (error) {
        this.sendNotification({ text: 'ログアウトに失敗しました。', type: 'warning' })
        console.error(error)
      }
    },
    showProfileSettingsModal() {
      this.closeMenu()
      this.setProfileSettingsModal({ showProfileSettingsModal: true })
    },
    moveToNotificationPage() {
      this.resetNotificationData()
      this.getNotifications()
      this.$router.push('/me/notifications')
    },
    moveToNewArticlePage() {
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCreate' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      location.href = '/me/articles/new'
    },
    moveToPublicArticlesPage() {
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'viewPublicArticles' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      this.$router.push('/me/articles/public')
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'logout',
      'setProfileSettingsModal',
      'setCurrentUserInfo',
      'getUsersAlisToken',
      'getUnreadNotification',
      'resetSearchUsers',
      'resetSearchUsersPage',
      'resetSearchUsersIsLastPage',
      'resetNotificationData',
      'getNotifications',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
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
.logged-in {
  grid-area: session;
  display: flex;
  align-items: center;
  position: relative;

  .notification-link {
    cursor: pointer;
  }

  .search-icon {
    width: 24px;
    margin: 0 40px 0 88px;
  }

  .notification-icon {
    width: 24px;
    margin-right: 40px;
  }

  .profile-icon {
    border-radius: 50%;
    cursor: pointer;
    height: 40px;
    width: 40px;
  }
}

.menu {
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000000;
  filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.5));
  padding: 24px 0 20px;
  position: absolute;
  right: 0;
  top: 80px;
  width: 224px;

  .image-box {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 180px;
    margin: -24px 0 0 0;
    text-align: center;

    .profile-image {
      border-radius: 50%;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      height: 60px;
      margin-top: 40px;
      object-fit: cover;
      width: 60px;
    }

    .alis-token-amount {
      color: #fff;
      font-size: 20px;
      font-weight: 500;
      margin-top: 10px;
    }
  }

  .menu-links {
    list-style: none;
    margin: 20px 0;
    padding: 0;

    .menu-link {
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 1px;
      white-space: nowrap;

      &:hover {
        background-color: rgba(131, 139, 215, 0.2);
      }

      .reset-link-style {
        color: #000;
        text-decoration: none;

        &:visited {
          color: #000;
        }
      }

      .menu-link-inner {
        color: #000;
        display: block;
        height: 24px;
        line-height: 24px;
        padding: 10px 64px;
        text-decoration: none;

        &:visited {
          color: #000;
        }
      }
    }
  }

  .logout {
    color: #000;
    cursor: pointer;
    display: block;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    padding: 10px 64px;
    text-decoration: none;

    &:visited {
      color: #000;
    }

    &:hover {
      background-color: rgba(131, 139, 215, 0.2);
    }
  }
}

@media screen and (max-width: 1080px) {
  .menu {
    right: 34px;
  }
}

@mixin spStyles() {
  .logged-in {
    .search-icon,
    .notification-icon {
      width: 16px;
      margin-right: 24px;
    }

    .profile-icon {
      height: 32px;
      width: 32px;
    }
  }

  .menu {
    border-radius: 0;
    filter: none;
    height: 100vh;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;

    &:before {
      display: none;
    }

    .image-box {
      background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
      border-radius: 0;
      height: 180px;
      overflow: hidden;
      text-align: center;
    }
  }

  .cover {
    background: black;
    box-sizing: border-box;
    color: #000000;
    height: 100vh;
    opacity: 0.5;
    position: fixed;
    right: 0;
    top: 0;
    width: 100vw;
  }
}

@media screen and (max-width: 920px) and (min-width: 551px) {
  .article-container {
    @include spStyles();
  }
}

@media screen and (max-width: 550px) {
  @include spStyles();
}
</style>
