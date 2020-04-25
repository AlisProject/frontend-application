/* global Web3 */
const Common = require('ethereumjs-common').default
const Tx = require('ethereumjs-tx').Transaction

// MetaMaskがインストール済みか判定する
export function isMetaMaskInstalled() {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
}

// ネットワークの向き先が正しいか判定する
export async function isCorrectNetworkSelected() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }
  const web3 = createWeb3Object(true)
  const networkType = await web3.eth.net.getNetworkType()
  const isProduction = process.env.ALIS_APP_ID === 'alis'
  if (isProduction) {
    return networkType === 'main'
  } else {
    return networkType === 'ropsten' || networkType === 'rinkeby'
  }
}

// MetaMaskを有効化する
// MetaMaskがインストールされていない場合は例外が発生する
// MetaMaskの承認要求を許可した場合はtrue, そうでなければfalseを返す
export async function enableMetaMask() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }
  try {
    await window.ethereum.enable()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Web3オブジェクトを生成する
export function createWeb3Object(isMetamask = false) {
  if (isMetamask) {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed')
    }
    // MetaMaskがインストールされている場合
    return new Web3(window.ethereum)
  } else {
    // MetaMaskがインストールされていない場合
    return new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_OPERATION_URL))
  }
}

// Contractオブジェクトを生成する
export function createContractObject(abi, address, isMetamask = false) {
  const web3 = createWeb3Object(isMetamask)
  return new web3.eth.Contract(abi, address)
}

// MetaMaskのウォレットアドレスを取得する
export function getWalletAddress() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }
  if (!window.ethereum.selectedAddress) {
    throw new Error('MetaMask is not enabled')
  }

  return window.ethereum.selectedAddress
}

// 署名を生成する
export async function generateSignature(data) {
  if (!isMetaMaskInstalled) {
    throw new Error('MetaMask is not installed')
  }
  const web3 = createWeb3Object(true)
  const walletAddress = getWalletAddress()
  return web3.eth.personal.sign(data, walletAddress)
}

// web3ライブラリにて署名を生成する
export async function generateSignatureWeb3(message, privateKey) {
  const web3 = createWeb3Object(false)
  return web3.eth.accounts.sign(message, privateKey)
}

// アカウント情報（address、privatekey）を作成し返却
export async function createAccount() {
  const web3 = new Web3()
  const walletAddress = web3.eth.accounts.create()
  return {
    address: walletAddress.address,
    privateKey: walletAddress.privateKey
  }
}

export function getErc20TransferData(to, value) {
  const toAddress = to.slice(0, 2) === '0x' ? to.slice(2) : to
  return (
    '0xa9059cbb' + '0'.repeat(24) + toAddress + ('0'.repeat(64) + value.toString(16)).slice(-64)
  )
}

export function getErc20ApproveData(to, value) {
  const toAddress = to.slice(0, 2) === '0x' ? to.slice(2) : to
  return (
    '0x095ea7b3' + '0'.repeat(24) + toAddress + ('0'.repeat(64) + value.toString(16)).slice(-64)
  )
}

export function getErc20RelayDate(to, value) {
  const toAddress = to.slice(0, 2) === '0x' ? to.slice(2) : to
  return (
    '0xeeec0e24' + '0'.repeat(24) + toAddress + ('0'.repeat(64) + value.toString(16)).slice(-64)
  )
}

// 引数を元に作成された、署名付きの RawTransaction を返却
export async function getSignedRawTransaction(nonce, to, data, key) {
  const web3 = new Web3()
  // トランザクションパラメータを定義
  const rawTx = {
    nonce: nonce,
    gasPrice: web3.utils.toHex(0),
    gasLimit: web3.utils.toHex(100000),
    to: to,
    value: web3.utils.toHex(0),
    data: data
  }
  // カスタムチェイン情報を定義
  const customCommon = Common.forCustomChain(
    'mainnet', // Tx 作成には不要だが、必須パラメータのため設定
    {
      name: 'alis',
      chainId: '0x2323' // ALIS の chainId
    },
    'byzantium' // Tx 作成には不要だが、必須パラメータのため設定
  )
  // トランザクションパラメータとカスタムチェイン情報を元にトランザクションオブジェクトを作成
  const tx = new Tx(rawTx, { common: customCommon })

  // トランザクションに署名を付与
  const hexKey = Buffer.from(key.slice(2), 'hex')
  tx.sign(hexKey)
  // シリアライズし返却
  return '0x' + tx.serialize().toString('hex')
}
