<template>
  <div class="area-user-info-container" :class="{ 'is-current-user': isCurrentUser }">
    <div class="area-profile-icon">
      <img
        v-if="user.icon_image_url !== undefined"
        class="profile-icon"
        alt="profile-icon"
        :src="user.icon_image_url"
      >
      <img
        v-else
        class="profile-icon"
        alt="profile-icon"
        src="~assets/images/pc/common/icon_user_noimg.png"
      >
    </div>
    <div class="area-user-display-name">
      <p class="user-display-name">
        {{ decodedUserDisplayName }}
      </p>
    </div>
    <no-ssr>
      <div v-if="isCurrentUser && loggedIn" class="menu" @click="toggleMenuPopup">
        <div v-show="isMenuPopupShown" class="menu-popup-current-user">
          <div class="menu-option" @click="showProfileSettingsModal">
            プロフィールを編集
          </div>
          <nuxt-link class="menu-option" to="/me/settings/mute_users">
            ミュートしたユーザー
          </nuxt-link>
        </div>
      </div>
    </no-ssr>
    <no-ssr>
      <div v-if="!isCurrentUser && loggedIn" class="menu" @click="toggleMenuPopup">
        <div v-show="isMenuPopupShown" class="menu-popup">
          <span class="menu-option" @click="showUserReportModal">
            報告する
          </span>
          <span class="menu-option" @click="addMuteUser">
            ミュートする
          </span>
        </div>
      </div>
    </no-ssr>
    <div class="area-user-id">
      <p class="user-id">
        @{{ user.user_id }}
      </p>
    </div>
    <div class="area-self-introduction">
      <p class="self-introduction">
        {{ decodedSelfIntroduction }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { htmlDecode } from '~/utils/article'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isMenuPopupShown: false
    }
  },
  async mounted() {
    await this.$nextTick()
    const menuElement = this.$el.querySelector('.menu')
    this.listen(window, 'click', (event) => {
      if (menuElement && !menuElement.contains(event.target)) {
        this.closeMenuPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (menuElement && !menuElement.contains(event.target)) {
        this.closeMenuPopup()
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
    decodedUserDisplayName() {
      return htmlDecode(this.user.user_display_name)
    },
    decodedSelfIntroduction() {
      if (!this.hasSelfIntroduction) return ''
      return htmlDecode(this.user.self_introduction)
    },
    hasSelfIntroduction() {
      const { self_introduction: selfIntroduction } = this.user

      if (selfIntroduction === undefined || selfIntroduction === null) {
        return false
      }
      if (selfIntroduction.trim() === '') return false

      return true
    },
    isCurrentUser() {
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    ...mapGetters('user', ['loggedIn', 'currentUser'])
  },
  methods: {
    toggleMenuPopup() {
      this.isMenuPopupShown = !this.isMenuPopupShown
    },
    closeMenuPopup() {
      this.isMenuPopupShown = false
    },
    showProfileSettingsModal() {
      this.setProfileSettingsModal({ showProfileSettingsModal: true })
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
    showUserReportModal() {
      this.setUserReportModal({ isShow: true })
      this.setUserReportSelectReasonModal({ isShow: true })
    },
    async addMuteUser() {
      try {
        await this.setMuteUser({ muteUserId: this.user.user_id })
        this.sendNotification({
          text: '登録に成功しました。該当ユーザの記事は一覧から表示されなくなります',
          dismissAfter: 7000
        })
      } catch (error) {
        this.sendNotification({
          text: '登録に失敗しました。しばらく時間を置いて再度お試しください',
          type: 'warning',
          dismissAfter: 7000
        })
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', ['setProfileSettingsModal', 'setMuteUser']),
    ...mapActions('report', ['setUserReportModal', 'setUserReportSelectReasonModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-user-info-container {
  display: grid;
  grid-area: user-info;
  grid-template-rows: 40px 30px auto;
  grid-template-columns: 80px 0 min-content 40px auto;
  grid-column-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "profile-icon ... user-display-name user-display-name sub-icon         "
    "profile-icon ... user-id           user-id           ...              "
    "...          ... self-introduction self-introduction self-introduction";
  padding-bottom: 60px;
}

.area-profile-icon {
  grid-area: profile-icon;
  position: relative;

  .profile-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.area-user-display-name {
  grid-area: user-display-name;
  display: flex;
  padding-top: 4px;

  .user-display-name {
    color: #333;
    display: block;
    font-size: 28px;
    letter-spacing: 1.6px;
    margin: 0;
    max-width: 530px;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.menu {
  grid-area: sub-icon;
  background-image: url('~assets/images/pc/common/icon_draftcassette_active.png');
  background-position: 10px;
  background-repeat: no-repeat;
  background-size: 20px;
  cursor: pointer;
  position: relative;
  width: 40px;

  .menu-popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(192, 192, 192, 0.5);
    cursor: default;
    box-sizing: border-box;
    font-size: 14px;
    position: absolute;
    top: 40px;
    width: 110px;
    z-index: 1;

    .menu-option {
      display: block;
      margin: 12px;
      color: #6e6e6e;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
    }
  }

  .menu-popup-current-user {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(192, 192, 192, 0.5);
    cursor: default;
    box-sizing: border-box;
    font-size: 14px;
    position: absolute;
    top: 40px;
    width: 166px;
    z-index: 1;

    .menu-option {
      display: block;
      margin: 12px;
      color: #6e6e6e;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
    }
  }
}

.area-user-id {
  grid-area: user-id;
  padding-top: 4px;

  .user-id {
    color: #6e6e6e;
    font-size: 12px;
    margin: 0;
  }
}

.area-self-introduction {
  grid-area: self-introduction;

  .self-introduction {
    color: #6e6e6e;
    font-size: 12px;
    line-height: 1.75;
    margin: 0;
    word-break: break-word;
  }
}

@media screen and (max-width: 920px) {
  .area-user-display-name {
    .user-display-name {
      max-width: 160px;
    }
  }

  .menu {
    height: 40px;

    .menu-popup {
      left: -79px;

      .menu-option {
        margin: 24px 12px;
      }
    }

    .menu-popup-current-user {
      left: -134px;

      .menu-option {
        margin: 24px 12px;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .area-user-info-container {
    grid-column-gap: 20px;
    grid-template-rows: 20px 20px 20px 20px auto;
    grid-template-columns: 80px auto 40px;
    /* prettier-ignore */
    grid-template-areas:
      "profile-icon      ...               ...        "
      "profile-icon      user-display-name menu"
      "profile-icon      user-id           menu"
      "profile-icon      ...               ...        "
      "self-introduction self-introduction self-introduction";
    padding: 0 12px;

    &.is-current-user {
      grid-column-gap: 20px;
      grid-template-rows: 20px 20px 16px auto;
      grid-template-columns: 80px auto 40px;
      /* prettier-ignore */
      grid-template-areas:
        "profile-icon      user-display-name ...              "
        "profile-icon      user-id           menu             "
        "profile-icon      ...               ...              "
        "self-introduction self-introduction self-introduction";
      padding: 0 12px;
    }
  }

  .area-user-id {
    .user-id {
      padding-top: 2px;
    }
  }

  .menu {
    grid-area: menu;
  }

  .area-user-display-name {
    .user-display-name {
      font-size: 14px;
      color: #030303;
      letter-spacing: 0.8px;
      // 12px - padding of .area-user-info-container
      // 80px - width   of .profile-icon
      // 20px - gap     of .area-user-info-container
      // 40px - width   of .menu
      max-width: calc(100vw - 12px - 80px - 20px - 40px - 20px - 12px);
    }
  }

  .area-self-introduction {
    margin: 20px 0 0;
  }
}
</style>
