import { BigNumber } from 'bignumber.js'

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
