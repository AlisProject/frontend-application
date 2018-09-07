<template>
  <div class="logged-in">
    <nuxt-link to="/search?context=article" @click.native="resetSearchStates">
      <img class="search-icon" src="~assets/images/pc/common/icon_search.png">
    </nuxt-link>
    <nuxt-link to="/me/notifications">
      <img
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification_mark.png"
        v-if="unreadNotification">
      <img
        class="notification-icon"
        src="~assets/images/pc/common/icon_notification.png"
        v-else>
    </nuxt-link>
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
        <p class="alis-token-amount">{{ alisToken }} ALIS</p>
      </div>
      <ul class="menu-links">
        <li class="menu-link">
          <a href="/me/articles/new">新規記事作成</a>
        </li>
        <li class="menu-link">
          <nuxt-link to="/me/articles/public">記事一覧</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link :to="`/users/${currentUserInfo.user_id}`">マイページ</nuxt-link>
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
    ...mapGetters('user', ['currentUserInfo', 'alisToken', 'unreadNotification'])
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
    async toggleMenu() {
      if (!this.isMenuShown) {
        await this.getUsersAlisToken()
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
      this.setProfileSettingsModal({ showProfileSettingsModal: true })
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
.logged-in {
  grid-area: session;
  display: flex;
  align-items: center;
  position: relative;

  .search-icon,
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
  padding: 24px 92px 50px;
  position: absolute;
  right: 0;
  top: 80px;
  width: 280px;

  .image-box {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 180px;
    margin: -24px -92px 0 -92px;
    text-align: center;
    width: 280px;

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
    padding: 0;
    margin: 50px 0;

    .menu-link {
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      height: 24px;
      letter-spacing: 1px;
      line-height: 24px;
      margin-bottom: 40px;
      white-space: nowrap;

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
    display: block;
    font-size: 14px;
    margin-top: 80px;
    text-decoration: none;

    &:visited {
      color: #000;
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
      margin: -24px -92px 0 -92px;
      overflow: hidden;
      text-align: center;
      width: 280px;
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
