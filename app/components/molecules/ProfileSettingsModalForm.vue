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
            <img class="btn-pic" src="~assets/images/pc/common/icon_profile_img.png" alt="upload">
            <input class="upload-img-input" type="file" accept="image/*" @change="onFileChange">
          </label>
        </div>
        <div class="signup-form-group" :class="{ 'error': hasUserDisplayNameError }">
          <label class="signup-form-label">ユーザー名</label>
          <input
            class="signup-form-input"
            type="text"
            minlength="1"
            maxlength="30"
            placeholder="田中太郎"
            v-model="userDisplayName"
            @input="setUserDisplayName($event.target.value)"
            @blur="showError('userDisplayName')"
            @focus="resetError('userDisplayName')">
          <label class="signup-form-label">自己紹介</label>
        </div>
        <div class="signup-form-group">
          <textarea
            class="signup-form-textarea"
            type="text"
            placeholder="100文字以内でご入力ください"
            maxlength="100"
            v-model="selfIntroduction"
            @input="setSelfIntroduction($event.target.value)"/>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <app-button class="submit-button" :disabled="invalidSubmit" @click="onSubmit">
        完了する
      </app-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import AppButton from '../atoms/AppButton'
import { htmlDecode } from '~/utils/article'

export default {
  data() {
    return {
      userDisplayName: '',
      selfIntroduction: '',
      uploadedImage: ''
    }
  },
  components: {
    AppButton
  },
  async created() {
    await this.setCurrentUserInfo()
    this.userDisplayName =
      htmlDecode(this.currentUserInfo.user_display_name) || this.currentUser.userId
    this.selfIntroduction = htmlDecode(this.currentUserInfo.self_introduction) || ''
    this.setUserDisplayName(this.userDisplayName)
    this.setSelfIntroduction(this.selfIntroduction)
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
        alert('画像は4.5MBまでアップロード可能です')
        return
      }
      const reader = new FileReader()
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
          const toastMessage = document.querySelector('.toast')
          const modalMask = document.querySelector('.modal-mask')
          const modalMaskZIndex = Number(
            window.getComputedStyle(modalMask).getPropertyValue('z-index')
          )
          const originalToastZIndex = toastMessage.style.zIndex
          toastMessage.style.zIndex = modalMaskZIndex + 1
          this.sendNotification({
            text: '画像のアップロードに失敗しました',
            type: 'warning'
          })
          setTimeout(() => {
            toastMessage.style.zIndex = originalToastZIndex
          }, 2500)
          console.error(error)
        }
      }
      reader.readAsDataURL(file)
    },
    setUserDisplayName(userDisplayName) {
      this.setProfileSettingsUserDisplayName({ userDisplayName })
    },
    setSelfIntroduction(selfIntroduction) {
      this.setProfileSettingsSelfIntroduction({ selfIntroduction })
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
          this.setSignUpAuthFlowProfileSettingsModal({
            isSignUpAuthFlowProfileSettingsModal: false
          })
          if (this.currentUser.phoneNumberVerified) {
            this.setSignUpAuthFlowCompletedPhoneNumberAuthModal({ isShow: true })
          } else {
            this.setSignUpAuthFlowNotCompletedPhoneNumberAuthModal({ isShow: true })
          }
        } else {
          this.setProfileSettingsModal({
            showProfileSettingsModal: false
          })
          this.sendNotification({ text: 'プロフィールを変更しました' })
        }
      } catch (error) {
        this.sendNotification({ text: 'プロフィールを変更できませんでした', type: 'warning' })
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
      'setProfileSettingsModal',
      'putUserInfo',
      'postUserIcon',
      'setCurrentUserInfo',
      'setSignUpAuthFlowCompletedPhoneNumberAuthModal',
      'setSignUpAuthFlowNotCompletedPhoneNumberAuthModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.modal-body {
  margin: 0 auto;

  .signup-form {
    margin: 30px auto 0;
    max-width: 400px;
    width: 100%;

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
        background: #fff;
        border-radius: 50%;
        bottom: 0;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
        cursor: pointer;
        height: 40px;
        position: absolute;
        right: 0;
        width: 40px;

        .btn-pic {
          padding: 8px;
          width: 24px;
        }
      }

      .upload-img-input {
        display: none;
      }
    }

    &-label {
      color: #030303;
      font-size: 14px;
      line-height: 2.4;
    }

    &-input,
    &-textarea {
      appearance: none;
      border-radius: 0;
      border: none;
      box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
      box-sizing: border-box;
      margin-bottom: 30px;
      overflow: hidden;
      padding: 12px;
      resize: none;
      width: 100%;

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
      height: 6em;
    }

    .error {
      .signup-form {
        &-input {
          box-shadow: 0 0 16px 0 rgba(240, 98, 115, 0.5);
        }
      }
    }
  }
}

.modal-footer {
  width: 270px;
  margin: 30px auto 40px;

  .submit-button {
    margin: 20px auto 0;
  }

  .error-message {
    color: #f06273;
    font-size: 12px;
    width: 100%;
  }
}

@media screen and (max-width: 550px) {
  .modal-body {
    .signup-form {
      max-width: 256px;

      &-textarea {
        height: 8em;
      }
    }
  }

  .modal-footer {
    margin: 20px auto 60px;
  }
}

@media screen and (max-width: 320px) {
  .modal-footer {
    width: 250px;
    margin: 0;
  }
}
</style>
