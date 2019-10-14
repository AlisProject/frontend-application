import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk/global'
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'

export default class CognitoSDK {
  constructor() {
    this.poolData = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_APP_CLIENT_ID
    }
    this.userPool = new CognitoUserPool(this.poolData)
    AWS.config.region = process.env.REGION
  }

  getUserSession() {
    this.cognitoUser = this.userPool.getCurrentUser()

    return new Promise((resolve, reject) => {
      if (!this.cognitoUser) {
        reject(new Error('There is no cognito User'))
        return
      }

      this.cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
          return
        }
        const { username: userId } = session.accessToken.payload
        const {
          email_verified: emailVerified,
          phone_number_verified: phoneNumberVerified,
          'custom:private_eth_address': privateEthAddress
        } = session.idToken.payload
        const jwtToken = session.idToken.jwtToken
        resolve({ userId, emailVerified, phoneNumberVerified, privateEthAddress, jwtToken })
      })
    })
  }

  refreshUserSession() {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.LastAuthUser`
    )
    const refreshToken = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.${currentUser}.refreshToken`
    )
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken })
    this.cognitoUser = this.userPool.getCurrentUser()
    return new Promise((resolve, reject) => {
      this.cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          reject(err)
          return
        }
        resolve(session)
      })
    })
  }

  register({ userId, email, password }) {
    const attributeList = []
    const attributeEmail = new CognitoUserAttribute({ Name: 'email', Value: email })
    attributeList.push(attributeEmail)

    return new Promise((resolve, reject) => {
      this.userPool.signUp(userId, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  confirmEmail({ user, code }) {
    this.cognitoUser = this.getCognitoUser(user)
    return new Promise((resolve, reject) => {
      this.cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  login({ userId, password }) {
    const authenticationData = {
      Username: userId,
      Password: password
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)
    this.cognitoUser = this.getCognitoUser(userId)
    return new Promise((resolve, reject) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const { username: userId } = result.accessToken.payload
          const {
            email_verified: emailVerified,
            phone_number_verified: phoneNumberVerified
          } = result.idToken.payload
          resolve({ userId, emailVerified, phoneNumberVerified })
        },
        onFailure: (err) => {
          reject(err)
        }
      })
    })
  }

  updatePhoneNumber({ userId, phoneNumber }) {
    const attributeList = []
    const attributePhoneNumber = new CognitoUserAttribute({
      Name: 'phone_number',
      Value: phoneNumber
    })
    attributeList.push(attributePhoneNumber)
    return new Promise((resolve, reject) => {
      this.cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  sendConfirm() {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.${currentUser}.accessToken`
    )
    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider()
    const params = {
      AccessToken: token,
      AttributeName: 'phone_number'
    }
    return new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.getUserAttributeVerificationCode(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  verifySMSCode({ code }) {
    const currentUser = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.LastAuthUser`
    )
    const token = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.poolData.ClientId}.${currentUser}.accessToken`
    )
    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider()
    const params = {
      AccessToken: token,
      AttributeName: 'phone_number',
      Code: code
    }
    return new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.verifyUserAttribute(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  logoutUser({ userId }) {
    this.cognitoUser = this.getCognitoUser(userId)
    return this.cognitoUser.signOut()
  }

  getUserData() {
    return new Promise((resolve, reject) => {
      this.cognitoUser.getUserAttributes((err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result.find((item) => item.Name === 'email').Value)
      })
    })
  }

  forgotPassword({ userId }) {
    const cognitoUser = this.getCognitoUser(userId)
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result)
        },
        onFailure: (err) => {
          let errorMessage = ''
          switch (err.code) {
            case 'UserNotFoundException':
              errorMessage = '存在しないユーザーです。入力内容をご確認ください'
              break
            case 'LimitExceededException':
              errorMessage =
                'パスワード再設定の試行回数が上限に達しました。時間を置いて再度お試しください'
              break
            case 'UserLambdaValidationException':
              const pattern = /^.*external provider's user can not execute\.$/
              if (pattern.test(err.message)) {
                errorMessage =
                  'このユーザーは Twitter、Facebook 等の他サービスと連携しており、' +
                  '当サービスではパスワード忘れの対応を行うことができません。' +
                  '連携頂いている該当サービスよりご対応ください'
              } else {
                errorMessage = 'エラーが発生しました。入力内容をご確認ください'
              }
              break
            default:
              errorMessage = 'エラーが発生しました。入力内容をご確認ください'
              break
          }
          alert(errorMessage)
          reject(err)
        },
        inputVerificationCode: () => {
          const verificationCode = prompt(
            'メールもしくはSMSに届いた認証コードを入力してください（数字6文字）',
            ''
          )
          if (isNaN(verificationCode) || verificationCode.length !== 6) {
            const errorMessage = '認証コードは数字6文字で入力してください'
            alert(errorMessage)
            reject(new Error(errorMessage))
            return
          }
          const newPassword = prompt('パスワードを入力してください（半角英数字8文字以上）', '')
          cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: (result) => {
              resolve(result)
            },
            onFailure: (err) => {
              let errorMessage = ''
              switch (err.code) {
                case 'InvalidParameterException':
                  errorMessage = 'パスワードの形式が正しくありません'
                  break
                case 'CodeMismatchException':
                  errorMessage = '認証コードが正しくありません'
                  break
                default:
                  errorMessage = 'エラーが発生しました。入力内容をご確認ください'
                  break
              }
              alert(errorMessage)
              reject(err)
            }
          })
        }
      })
    })
  }

  confirmPassword({ Username, code, password }) {
    this.cognitoUser = this.getCognitoUser(Username)
    return new Promise((resolve, reject) => {
      this.cognitoUser.confirmPassword(code, password, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err)
      })
    })
  }

  getCognitoUser(Username) {
    const userPool = new CognitoUserPool(this.poolData)
    const userData = {
      Username,
      Pool: userPool
    }
    return new CognitoUser(userData)
  }
}
