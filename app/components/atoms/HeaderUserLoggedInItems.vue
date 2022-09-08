<template>
  <div class="logged-in">
    <nuxt-link
      class="search-icon-box"
      to="/search?context=article"
      @click.native="resetSearchStates"
    >
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png" alt="Search">
    </nuxt-link>
    <span class="notification-icon-box" @click="moveToNotificationPage">
      <img
        v-if="unreadNotification"
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification_mark.png"
        alt="Move to notification page"
      >
      <img
        v-else
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification.png"
        alt="Notification"
      >
    </span>
    <div
      v-if="currentUserInfo.icon_image_url !== undefined"
      class="profile-icon-box"
      @click="toggleMenu"
    >
      <img class="profile-icon" :src="currentUserInfo.icon_image_url" alt="Profile icon">
    </div>
    <div v-else class="profile-icon-box" @click="toggleMenu">
      <img
        class="profile-icon"
        src="~assets/images/pc/common/icon_user_noimg.png"
        alt="Profile icon"
      >
    </div>
    <div v-if="isMenuShown" class="menu">
      <template v-if="currentUserInfo.icon_image_url !== undefined">
        <div class="background-user-image-box">
          <img class="background-user-image" :src="currentUserInfo.icon_image_url" alt="">
        </div>
        <img :src="currentUserInfo.icon_image_url" class="profile-image" alt="Profile icon">
      </template>
      <template v-else>
        <div class="background-user-image-box">
          <img
            class="background-user-image"
            src="~assets/images/pc/common/icon_user_noimg.png"
            alt=""
          >
        </div>
        <img
          src="~assets/images/pc/common/icon_user_noimg.png"
          class="profile-image"
          alt="Profile icon"
        >
      </template>
      <p class="alis-token-amount">
        {{ formattedAlisToken }} ALIS
      </p>
      <ul class="menu-links">
        <li class="menu-link">
          <nuxt-link class="reset-link-style" to="/me/articles/new" event="">
            <span class="menu-link-inner" @click="moveToNewArticlePage">
              新規記事作成
            </span>
          </nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link class="menu-link-inner" :to="`/users/${currentUserInfo.user_id}`">
            マイページ
          </nuxt-link>
        </li>
        <li v-if="!isMobile()" class="menu-link">
          <nuxt-link class="menu-link-inner" to="/me/wallet/deposit">
            ウォレット
          </nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link class="menu-link-inner" to="/me/articles/purchased">
            購入した記事
          </nuxt-link>
        </li>
        <hr class="hr">
        <li class="menu-link">
          <nuxt-link class="menu-link-inner" to="/tag/ALIS参加募集企画">
            ALIS参加募集企画
          </nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link class="menu-link-inner" to="/me/settings/sessions">
            連携中のアプリケーション
          </nuxt-link>
        </li>
        <li v-if="!isMobile()" class="menu-link">
          <nuxt-link class="menu-link-inner" to="/me/settings/applications">
            登録中のアプリケーション
          </nuxt-link>
        </li>
        <hr class="hr">
        <li class="menu-link">
          <nuxt-link to="/ALIS-official/articles/3reY5BgBEZ8B" class="menu-link-inner">
            ALISの使い方
          </nuxt-link>
        </li>
        <li class="menu-link">
          <a
            href="https://intercom.help/alismedia"
            class="menu-link-inner"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            よくある質問・問い合わせ
          </a>
        </li>
        <li class="menu-link" @click="logoutUser">
          <span class="menu-link-inner">
            ログアウト
          </span>
        </li>
      </ul>
    </div>
    <div v-show="isMenuShown" class="cover" @click="closeMenu" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { BigNumber } from 'bignumber.js'
import { isMobile } from '~/utils/device'
import { removeOAuthParams } from '~/utils/oauth'

export default {
  data() {
    return {
      isMenuShown: false,
      isMobile
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
        removeOAuthParams()
        this.logout()
        location.href = '/'
        this.sendNotification({ text: 'ログアウトしました' })
      } catch (error) {
        this.sendNotification({ text: 'ログアウトに失敗しました', type: 'warning' })
        console.error(error)
      }
    },
    moveToNotificationPage() {
      this.resetNotificationData()
      this.getNotifications()
      this.$router.push('/me/notifications')
    },
    async moveToNewArticlePage() {
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCreate' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      const encryptInfo = await this.getWalletEncryptInfo()
      if (!encryptInfo.encrypted_secret_key) {
        this.setRequestWalletPasswordModal({ isShow: true })
        this.setRequestInputWalletPasswordModal({ isShow: true })
        return
      }
      this.$router.push('/me/articles/new')
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'logout',
      'setCurrentUserInfo',
      'getUsersAlisToken',
      'getUnreadNotification',
      'resetSearchUsers',
      'resetSearchUsersPage',
      'resetSearchUsersIsLastPage',
      'resetNotificationData',
      'getNotifications',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getWalletEncryptInfo',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal'
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

  .search-icon-box,
  .notification-icon-box,
  .profile-icon-box {
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    width: 40px;
  }

  .search-icon-box {
    margin-right: 22px;

    .search-icon {
      width: 24px;
    }
  }

  .notification-icon-box {
    margin-right: 32px;

    .notification-icon {
      width: 24px;
    }
  }

  .profile-icon-box .profile-icon {
    border-radius: 50%;
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
}

.menu {
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000;
  filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.5));
  position: absolute;
  right: 0;
  top: 48px;
  width: 250px;

  .background-user-image-box {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 70px;
    overflow: hidden;
    position: relative;
    text-align: center;
    width: 250px;

    .background-user-image {
      filter: blur(10px);
      height: auto;
      margin: -100px -10px 0 -10px;
      width: 270px;
    }
  }

  .profile-image {
    border-radius: 50%;
    box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
    height: 50px;
    object-fit: cover;
    position: absolute;
    right: 185px;
    top: 10px;
    width: 50px;
  }

  .alis-token-amount {
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    margin-top: 10px;
    position: absolute;
    right: 0;
    text-align: center;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    top: 14px;
    width: 180px;
  }

  .menu-links {
    list-style: none;
    margin: 10px 0;
    padding: 0;

    .menu-link {
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0;
      white-space: nowrap;

      &:hover {
        background-color: rgba(0, 135, 240, 0.2);
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
        padding: 8px 40px;
        text-decoration: none;

        &:visited {
          color: #000;
        }
      }
    }
  }

  .hr {
    border: none;
    height: 1px;
    background-color: #dedede;
  }
}

@media screen and (max-width: 1080px) {
  .menu {
    right: 34px;
  }
}

@mixin spStyles() {
  .logged-in {
    .search-icon-box {
      margin-right: 0;

      .search-icon {
        width: 16px;
      }
    }

    .notification-icon-box {
      margin-right: 0;

      .notification-icon {
        width: 16px;
      }
    }

    .profile-icon-box .profile-icon {
      height: 24px;
      width: 24px;
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

    .background-user-image-box {
      border-radius: 0;
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

@media screen and (max-width: 320px) {
  .menu {
    .menu-links {
      .menu-link {
        .menu-link-inner {
          padding: 8px 40px;
        }

        &:last-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
