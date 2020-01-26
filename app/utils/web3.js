/* global Web3 */

// MetaMaskがインストール済みか判定する
export function isMetaMaskInstalled() {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
}

// ネットワークの向き先が正しいか判定する
export async function isCorrectNetworkSelected() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }
  const web3 = createWeb3Object()
  const networkType = await web3.eth.net.getNetworkType()
  const isProduction = process.env.ALIS_APP_ID === 'alis'
  const targetNetworkType = isProduction ? 'main' : 'ropsten'
  return networkType === targetNetworkType
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
export function createWeb3Object() {
  if (window.ethereum) {
    // MetaMaskがインストールされている場合
    return new Web3(window.ethereum)
  } else {
    // MetaMaskがインストールされていない場合
    return new Web3(new Web3.providers.HttpProvider(process.env.PUBLIC_CHAIN_OPERATION_URL))
  }
}

// Contractオブジェクトを生成する
export function createContractObject(abi, address) {
  const web3 = createWeb3Object()
  return new web3.eth.Contract(abi, address)
}

// MetaMaskのウォレットアドレスを取得する
export function getWalletAddress() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed')
  }
  return window.ethereum.selectedAddress()
}

// 署名を生成する
export async function generateSignature(data) {
  if (!isMetaMaskInstalled) {
    throw new Error('MetaMask is not installed')
  }
  const web3 = createWeb3Object()
  const accountAddress = getWalletAddress()
  return web3.eth.personal.sign(data, accountAddress)
}
