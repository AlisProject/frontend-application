<template>
  <div class="area-user-info-container" :class="{ 'with-bottom-space': !hasSelfIntroduction }">
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
      <no-ssr>
        <div class="profile-edit" @click="showProfileSettingsModal" v-if="isCurrentUser"/>
      </no-ssr>
      <no-ssr>
        <div class="report-user" @click="toggleReportPopup" v-if="!isCurrentUser && loggedIn">
          <div class="report-popup" v-show="isReportPopupShown">
            <span class="report" @click="showUserReportModal">
              通報する
            </span>
          </div>
        </div>
      </no-ssr>
    </div>
    <div class="area-user-display-name">
      <p class="user-display-name">
        {{ decodedUserDisplayName }}
      </p>
    </div>
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
  mounted() {
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
      document.documentElement.scrollTop = 0
      document.querySelector('html,body').style.overflow = 'hidden'
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
      document.documentElement.scrollTop = 0
      document.querySelector('html').style.overflow = 'hidden'
      document.querySelector('body').style.overflow = 'hidden'
    },
    ...mapActions('user', [
      'setProfileSettingsModal',
      'setUserReportModal',
      'setUserReportSelectReasonModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.area-user-info-container {
  display: grid;
  grid-area: user-info;
  grid-template-rows: 100px auto auto 1fr;
  grid-template-columns: 1fr 400px 1fr;
  grid-gap: 8px;
  /* prettier-ignore */
  grid-template-areas:
    "... profile-icon      ..."
    "... user-display-name ..."
    "... user-id           ..."
    "... self-introduction ...";
  text-align: center;
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

  .profile-edit {
    background-image: url('~/assets/images/sp/common/icon_editprofile.png');
    background-repeat: no-repeat;
    background-size: 20px;
    bottom: 20px;
    cursor: pointer;
    height: 22px;
    position: absolute;
    right: 100px;
    width: 22px;
  }

  .report-user {
    background-image: url('~/assets/images/pc/article/a_icon_menu.png');
    background-repeat: no-repeat;
    background-size: 20px;
    bottom: 20px;
    cursor: pointer;
    height: 22px;
    position: absolute;
    right: 100px;
    width: 22px;

    .report-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      position: absolute;
      right: 0;
      top: 20px;
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
}

.area-user-display-name {
  grid-area: user-display-name;

  .user-display-name {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.area-user-id {
  grid-area: user-id;

  .user-id {
    color: #6e6e6e;
    font-size: 12px;
    margin: 0;
  }
}

.area-self-introduction {
  grid-area: self-introduction;

  .self-introduction {
    color: #030303;
    font-size: 14px;
    line-height: 22px;
    margin: 0;
    text-align: left;
    word-wrap: break-word;
  }
}

@media screen and (max-width: 920px) {
  .area-user-info-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-column-gap: 0px;
  }
}

@media screen and (max-width: 550px) {
  .area-user-info-container {
    grid-column-gap: 20px;
    grid-row-gap: 8px;
    grid-template-columns: 1fr 60px 240px 10px 1fr;
    grid-template-rows: 16px 12px 1fr;
    /* prettier-ignore */
    grid-template-areas:
      "... profile-icon user-display-name ...               ..."
      "... profile-icon user-id           user-id           ..."
      "... ...          self-introduction self-introduction ...";
    text-align: left;
    padding: 5px 0;

    &.with-bottom-space {
      padding-bottom: 16px;
    }
  }

  .area-profile-icon {
    .profile-icon {
      width: 60px;
      height: 60px;
    }

    .profile-edit,
    .report-user {
      bottom: 10px;
      right: -290px;
      cursor: pointer;
    }
  }

  .area-self-introduction {
    grid-area: self-introduction;
    text-align: left;
  }
}

@media screen and (max-width: 375px) {
  .area-user-info-container {
    grid-template-columns: 1fr 60px 210px 20px 1fr;
  }

  .area-profile-icon {
    .profile-edit,
    .report-user {
      right: -260px;
    }
  }
}

@media screen and (max-width: 320px) {
  .area-user-info-container {
    grid-template-columns: 1fr 60px 170px 10px 1fr;
  }

  .area-profile-icon {
    .profile-edit,
    .report-user {
      right: -220px;
    }
  }
}
</style>
