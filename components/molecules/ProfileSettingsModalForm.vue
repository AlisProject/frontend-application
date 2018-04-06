<template>
  <div>
    <div class="modal-body">
      <form class="signup-form" @submit.prevent>
        <div class="upload-img-section">
          <img class="upload-img" v-if="uploadedImage" :src="uploadedImage" />
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

export default {
  data() {
    return {
      userDisplayName: '',
      uploadedImage: ''
    }
  },
  created() {
    this.userDisplayName = this.currentUser.userId
    this.setSignUpAuthFlowProfileSettingsUserDisplayName({
      userDisplayName: this.currentUser.userId
    })
  },
  computed: {
    invalidSubmit() {
      return this.$v.signUpAuthFlowModal.profileSettings.formData.$invalid
    },
    hasUserDisplayNameError() {
      return (
        this.signUpAuthFlowModal.profileSettings.formError.userDisplayName &&
        this.$v.signUpAuthFlowModal.profileSettings.formData.userDisplayName.$error
      )
    },
    hasSelfIntroductionError() {
      return (
        this.signUpAuthFlowModal.profileSettings.formError.selfIntroduction &&
        this.$v.signUpAuthFlowModal.profileSettings.formData.selfIntroduction.$error
      )
    },
    ...mapGetters('user', ['currentUser', 'signUpAuthFlowModal'])
  },
  validations: {
    signUpAuthFlowModal: {
      profileSettings: {
        formData: {
          userDisplayName: {
            required
          },
          selfIntroduction: {
            required
          }
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
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    setUserDisplayName(e) {
      this.setSignUpAuthFlowProfileSettingsUserDisplayName({ userDisplayName: e.target.value })
    },
    setSelfIntroduction(e) {
      this.setSignUpAuthFlowProfileSettingsSelfIntroduction({ selfIntroduction: e.target.value })
    },
    showError(type) {
      this.$v.signUpAuthFlowModal.profileSettings.formData[type].$touch()
      this.showSignUpAuthFlowProfileSettingsError({ type })
    },
    resetError(type) {
      this.$v.signUpAuthFlowModal.profileSettings.formData[type].$reset()
      this.hideSignUpAuthFlowProfileSettingsError({ type })
    },
    async onSubmit() {
      if (this.invalidSubmit) return
      const {
        userDisplayName,
        selfIntroduction
      } = this.signUpAuthFlowModal.profileSettings.formData
      const formattedSelfIntroduction = selfIntroduction.replace(/\r?\n/g, '')
      try {
        await this.putUserInfo({ userDisplayName, selfIntroduction: formattedSelfIntroduction })

        document.querySelector('html,body').style.overflow = ''
        this.setSignUpAuthFlowModal({
          showSignUpAuthFlowModal: false
        })
        this.setSignUpAuthFlowProfileSettingsModal({
          isSignUpAuthFlowProfileSettingsModal: false
        })
      } catch (error) {
        console.error(error)
      }
    },
    ...mapActions('user', [
      'setSignUpAuthFlowProfileSettingsModal',
      'setSignUpAuthFlowProfileSettingsUserDisplayName',
      'setSignUpAuthFlowProfileSettingsSelfIntroduction',
      'showSignUpAuthFlowProfileSettingsError',
      'hideSignUpAuthFlowProfileSettingsError',
      'setSignUpAuthFlowModal',
      'setSignUpAuthFlowProfileSettingsModal',
      'putUserInfo'
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
