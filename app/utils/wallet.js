import { BigNumber } from 'bignumber.js'
import CryptoJS from 'crypto-js'
import sjcl from 'sjcl'

export function showPaymentType(isDeposit) {
  return isDeposit ? '入金' : '出金'
}

export function showProcessType(isFinished) {
  return isFinished ? '完了' : '処理中'
}

export function showFormattedAmount(amount) {
  const formatNumber = 10 ** 18
  return new BigNumber(amount).div(formatNumber).toString(10)
}

export function addDigitSeparator(str) {
  let num = String(str).replace(/,/g, '')
  let tmpNum = ''
  while (num !== tmpNum) {
    tmpNum = num
    num = num.replace(/^(-?\d+)(\d{3})/, '$1,$2')
  }
  return num
}

export function isOverDecimalPoint(amount = '', decimalPoint = 0) {
  // 小数点以下の桁数が {decimalPoint} 桁を超えているか確認し、
  // 超えている場合は true を返す
  // 例）amount を 0.001、decimalPoint を 3 にすると false 、
  // amount を 0.0001、decimalPoint を 3 にすると true となる
  return amount && amount.includes('.') && amount.split('.')[1].length > decimalPoint
}

export function passwordToPbkdf2(password) {
  const salt = btoaFromUint8Array(window.crypto.getRandomValues(new Uint8Array(128)))
  return {
    key: getPbkdf2(password, salt),
    salt: salt
  }
}

export function getPbkdf2(targetString, salt) {
  return sjcl.codec.hex.fromBits(
    sjcl.misc.pbkdf2(targetString, salt, 100000, 512, sjcl.misc.sha512)
  )
}

export function btoaFromUint8Array(targetArray) {
  return window.btoa(String.fromCharCode(...targetArray))
}

export function encryptSecretKey(secretKey, pbkdf2Key) {
  return CryptoJS.AES.encrypt(secretKey, pbkdf2Key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

export function decryptSecretKey(encryptedString, pbkdf2Key) {
  const bytes = CryptoJS.AES.decrypt(encryptedString, pbkdf2Key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function setLocalStoragePbkdf2Key(pbkdf2Key) {
  // 期限は30日
  const now = new Date()
  const item = {
    expire: now.getTime() + 2592000000,
    value: pbkdf2Key
  }
  localStorage.setItem('alis.to.wallet.pbkdf2Key', JSON.stringify(item))
}

export function removeLocalStoragePbkdf2Key() {
  localStorage.removeItem('alis.to.wallet.pbkdf2Key')
}

export function getLocalStoragePbkdf2Key() {
  // SSR で実行された場合は null を返却
  if (typeof localStorage === 'undefined') {
    return null
  }
  const item = localStorage.getItem('alis.to.wallet.pbkdf2Key')
  if (!item) {
    return null
  }
  const now = new Date()
  if (item.expire < now.getTime()) {
    localStorage.removeItem('alis.to.wallet.pbkdf2Key')
    return null
  }
  return JSON.parse(item).value
}
