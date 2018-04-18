<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @submit.prevent>
        <div class="upload-img-section">
          <img
            class="upload-img"
            v-if="currentUserInfo.icon_image_url !== undefined"
            :src="currentUserInfo.icon_image_url" />
          <img
            class="upload-img"
            v-else-if="uploadedImage"
            :src="uploadedImage" />
          <div class="upload-img-dammy" v-else />
          <label class="upload-btn">
            <img class="btn-pic" src="~/assets/images/pc/common/btn_pic.png" alt="upload">
            <input class="upload-img-input" type="file" accept="image/*" @change="onFileChange">
          </label>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasUserDisplayNameError }">
          <label class="signup-form-label">表示名</label>
          <input
            class="signup-form-input"
            type="text"
            minlength="1"
            maxlength="30"
            v-model="userDisplayName"
            @input="setUserDisplayName"
            @blur="showError('userDisplayName')"
            @focus="resetError('userDisplayName')">
          <label class="signup-form-label">自己紹介</label>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasSelfIntroductionError }">
          <textarea
            class="signup-form-textarea"
            type="text"
            placeholder="自己紹介を入力してください"
            maxlength="100"
            v-model="selfIntroduction"
            @input="setSelfIntroduction"
            @blur="showError('selfIntroduction')"
            @focus="resetError('selfIntroduction')"/>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="to-next-step-button" :class="{ disabled: invalidSubmit }" @click="onSubmit">
        完了する
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      userDisplayName: '',
      selfIntroduction: '',
      uploadedImage: ''
    }
  },
  created() {
    this.userDisplayName = this.currentUserInfo.user_display_name || this.currentUser.userId
    this.selfIntroduction = this.currentUserInfo.self_introduction || ''
    this.setProfileSettingsUserDisplayName({
      userDisplayName: this.currentUser.userId
    })
    const selfIntroduction = this.currentUserInfo.self_introduction || ''
    this.setProfileSettingsSelfIntroduction({ selfIntroduction })
  },
  computed: {
    invalidSubmit() {
      return this.$v.profileSettingsModal.formData.$invalid
    },
    hasUserDisplayNameError() {
      return (
        this.profileSettingsModal.formError.userDisplayName &&
        this.$v.profileSettingsModal.formData.userDisplayName.$error
      )
    },
    hasSelfIntroductionError() {
      return (
        this.profileSettingsModal.formError.selfIntroduction &&
        this.$v.profileSettingsModal.formData.selfIntroduction.$error
      )
    },
    ...mapGetters('user', [
      'currentUser',
      'signUpAuthFlowModal',
      'showSignUpAuthFlowModal',
      'profileSettingsModal',
      'currentUserInfo'
    ])
  },
  validations: {
    profileSettingsModal: {
      formData: {
        userDisplayName: {
          required
        },
        selfIntroduction: {
          required
        }
      }
    }
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files
      this.createImage(files[0])
    },
    createImage(file) {
      if (file.size > 4.5 * 1024 * 1024) {
        alert('アイコン画像は4.5MBまでアップロード可能です')
        return
      }
      const reader = new FileReader()
      /* eslint-disable space-before-function-paren */
      reader.onload = async (e) => {
        try {
          const base64Image = e.target.result
          const base64Hash = base64Image.substring(base64Image.match(',').index + 1)
          const imageContentType = base64Image.substring(
            base64Image.match(':').index + 1,
            base64Image.match(';').index
          )
          await this.postUserIcon({ iconImage: base64Hash, imageContentType })
          await this.setCurrentUserInfo()
          this.uploadedImage = base64Image
        } catch (error) {
          console.error(error)
        }
      }
      reader.readAsDataURL(file)
    },
    setUserDisplayName(e) {
      this.setProfileSettingsUserDisplayName({ userDisplayName: e.target.value })
    },
    setSelfIntroduction(e) {
      this.setProfileSettingsSelfIntroduction({ selfIntroduction: e.target.value })
    },
    showError(type) {
      this.$v.profileSettingsModal.formData[type].$touch()
      this.showProfileSettingsError({ type })
    },
    resetError(type) {
      this.$v.profileSettingsModal.formData[type].$reset()
      this.hideProfileSettingsError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const { userDisplayName, selfIntroduction } = this.profileSettingsModal.formData
      const formattedSelfIntroduction = selfIntroduction.replace(/\r?\n/g, '')
      try {
        await this.putUserInfo({ userDisplayName, selfIntroduction: formattedSelfIntroduction })
        await this.setCurrentUserInfo()

        document.querySelector('html,body').style.overflow = ''
        if (this.showSignUpAuthFlowModal) {
          this.setSignUpAuthFlowModal({
            showSignUpAuthFlowModal: false
          })
          this.setSignUpAuthFlowProfileSettingsModal({
            isSignUpAuthFlowProfileSettingsModal: false
          })
        } else {
          this.setProfileSettingsModal({
            showProfileSettingsModal: false
          })
        }
        this.sendNotification({ text: 'プロフィールを変更しました' })
        if (document.querySelector('.area-user-info-container')) {
          document.querySelector('.area-user-info-container').style.zIndex = 2
        }
      } catch (error) {
        console.error(error)
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'setSignUpAuthFlowProfileSettingsModal',
      'setProfileSettingsUserDisplayName',
      'setProfileSettingsSelfIntroduction',
      'showProfileSettingsError',
      'hideProfileSettingsError',
      'setSignUpAuthFlowModal',
      'setProfileSettingsModal',
      'putUserInfo',
      'postUserIcon',
      'setCurrentUserInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
@mixin default-text {
  height: 14px;
  color: #6e6e6e;
  font-size: 12px;
  line-height: 18px;

  a {
    border-bottom: solid 1px transparent;
    color: #858dda;
    text-decoration: none;
    transition: all 400ms ease;

    &:hover {
      border-bottom: solid 1px #858dda;
    }
  }
}

.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
    width: 80%;

    .upload-img-section {
      position: relative;
      width: 120px;
      margin: 0 auto 30px;

      .upload-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
      }

      .upload-img-dammy {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #d8d8d8;
      }

      .upload-btn {
        cursor: pointer;
        position: absolute;
        bottom: -20px;
        right: -20px;

        .btn-pic {
          width: 65px;
        }
      }

      .upload-img-input {
        display: none;
      }
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 20px;
    }

    &-input,
    &-textarea {
      border: none;
      border-radius: 0;
      border-bottom: 1px dotted #232538;
      font-family: YuGothic;
      margin-bottom: 30px;
      padding: 5px 0;
      width: 100%;
      resize: none;
      overflow: hidden;

      &::-webkit-input-placeholder {
        color: #cecece;
        font-size: 14px;
        letter-spacing: 0.05em;
      }

      &:focus {
        outline: 0;
      }
    }

    &-textarea {
      height: 4em;
    }

    .error {
      .signup-form {
        &-label {
          color: #f06273;
        }

        &-input {
          border-bottom: 1px dotted #f06273;
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 90px auto 40px;

  .to-next-step-button {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    border: none;
    box-shadow: 0 0 10px gray;
    color: #fff;
    cursor: pointer;
    display: block;
    font-size: 14px;
    margin: 20px auto 0;
    outline: none;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 265px;

    &:focus {
      opacity: 0.8;
    }

    &:target {
      display: block;
    }

    &.disabled {
      background: white;
      color: #6e6e6e;
      cursor: default;
    }
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }
}

@media screen and (max-width: 320px) {
  .modal-body {
    .signup-form {
      margin-top: 30px;

      &-input {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
