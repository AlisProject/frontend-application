<template>
  <div
    class="area-user-info-container"
    :class="{ 'is-current-user': isCurrentUser }">
    <div class="area-profile-icon">
      <img
        class="profile-icon"
        alt="profile-icon"
        :src="user.icon_image_url"
        v-if="user.icon_image_url !== undefined">
      <img
        class="profile-icon"
        alt="profile-icon"
        src="~assets/images/pc/common/icon_user_noimg.png"
        v-else>
    </div>
    <div class="area-user-display-name">
      <p class="user-display-name">
        {{ decodedUserDisplayName }}
      </p>
    </div>
    <no-ssr>
      <div class="profile-edit" @click="showProfileSettingsModal" v-if="isCurrentUser"/>
    </no-ssr>
    <no-ssr>
      <div class="sp-profile-edit" @click="showProfileSettingsModal" v-if="isCurrentUser">
        プロフィールを編集
      </div>
    </no-ssr>
    <no-ssr>
      <div class="report-user" @click="toggleReportPopup" v-if="!isCurrentUser && loggedIn">
        <div class="report-popup" v-show="isReportPopupShown">
          <span class="report" @click="showUserReportModal">
            報告する
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

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isReportPopupShown: false
    }
  },
  async mounted() {
    await this.$nextTick()
    const reportUserElement = this.$el.querySelector('.report-user')
    this.listen(window, 'click', (event) => {
      if (reportUserElement && !reportUserElement.contains(event.target)) {
        this.closeReportPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (reportUserElement && !reportUserElement.contains(event.target)) {
        this.closeReportPopup()
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
    toggleReportPopup() {
      this.isReportPopupShown = !this.isReportPopupShown
    },
    closeReportPopup() {
      this.isReportPopupShown = false
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
    ...mapActions('user', ['setProfileSettingsModal']),
    ...mapActions('report', ['setUserReportModal', 'setUserReportSelectReasonModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-user-info-container {
  display: grid;
  grid-area: user-info;
  grid-template-rows: 40px 40px auto;
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

.profile-edit {
  grid-area: sub-icon;
  background-image: url('~/assets/images/sp/common/icon_editprofile.png');
  background-position: 10px;
  background-repeat: no-repeat;
  background-size: 20px;
  cursor: pointer;
}

.sp-profile-edit {
  display: none;
}

.report-user {
  grid-area: sub-icon;
  background-image: url('~/assets/images/pc/common/icon_draftcassette_active.png');
  background-position: 10px;
  background-repeat: no-repeat;
  background-size: 20px;
  cursor: pointer;
  position: relative;

  .report-popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(192, 192, 192, 0.5);
    cursor: default;
    box-sizing: border-box;
    font-size: 14px;
    position: absolute;
    left: -58px;
    top: 40px;
    width: 90px;
    z-index: 1;

    &::after {
      border-bottom: 8px solid #fff;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      content: '';
      height: 0;
      padding: 0;
      position: absolute;
      right: 0;
      right: 6px;
      top: -4px;
      width: 0;
    }

    .report {
      display: block;
      padding: 12px;
      color: #6e6e6e;
      cursor: pointer;
      user-select: none;
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
}

@media screen and (max-width: 550px) {
  .area-user-info-container {
    grid-column-gap: 20px;
    grid-template-rows: 20px 20px 20px 20px auto;
    grid-template-columns: 80px auto 40px;
    /* prettier-ignore */
    grid-template-areas:
      "profile-icon      ...               ...        "
      "profile-icon      user-display-name report-user"
      "profile-icon      user-id           report-user"
      "profile-icon      ...               ...        "
      "self-introduction self-introduction self-introduction";
    padding: 0 12px;

    &.is-current-user {
      grid-column-gap: 20px;
      grid-template-rows: 20px 20px 16px 24px auto;
      grid-template-columns: 80px auto 40px;
      /* prettier-ignore */
      grid-template-areas:
        "profile-icon      user-display-name ...              "
        "profile-icon      user-id           ...              "
        "profile-icon      ...               ...              "
        "profile-icon      profile-edit      profile-edit     "
        "self-introduction self-introduction self-introduction";
      padding: 0 12px;
    }
  }

  .area-user-id {
    .user-id {
      padding-top: 2px;
    }
  }

  .sp-profile-edit {
    grid-area: profile-edit;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #cecece;
    color: #6e6e6e;
    cursor: pointer;
    display: block;
    font-size: 12px;
    font-weight: bold;
    height: 22px;
    line-height: 22px;
    text-align: center;
    // 12px - padding of .area-user-info-container
    // 80px - width   of .profile-icon
    // 20px - gap     of .area-user-info-container
    width: calc(100vw - 12px - 80px - 20px - 12px);
  }

  .report-user {
    grid-area: report-user;
  }

  .area-user-display-name {
    .user-display-name {
      font-size: 14px;
      color: #030303;
      letter-spacing: 0.8px;
      // 12px - padding of .area-user-info-container
      // 80px - width   of .profile-icon
      // 20px - gap     of .area-user-info-container
      // 40px - width   of .report-user
      max-width: calc(100vw - 12px - 80px - 20px - 40px - 20px - 12px);
    }
  }

  .area-self-introduction {
    margin: 20px 0;
  }
}
</style>
