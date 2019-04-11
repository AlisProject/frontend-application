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
