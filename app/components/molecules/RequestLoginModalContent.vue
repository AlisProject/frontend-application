<template>
  <div class="report-modal-content">
    <p class="confirm-text">
      記事の作成・評価にはログインが必要です
    </p>
    <p class="for-not-submitted-user">
      β版未登録の方
    </p>
    <p class="description">
      β版の登録がお済みでない方は大変恐縮です
      が、ウェイティングリストへのご登録をお願い
      致しております。ご登録の上、利用開始メール
      送付までお待ち下さい。
    </p>
    <a
      href="http://eepurl.com/drM0Jr"
      target="_blank"
      rel="noopener noreferrer nofollow"
      class="submit-button">
      ウェイティングリストに登録する
    </a>
  </div>
</template>

<style lang="scss" scoped>
.confirm-text {
  color: #030303;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 21px;
  text-align: center;
  padding: 30px 0 0;
}

.for-not-submitted-user {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.17px;
  line-height: 21px;
  text-align: center;
  margin: 60px 0 0;
}

.description {
  width: 255px;
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  margin: 20px auto 0;
}

.submit-button {
  background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
  border-radius: 18px;
  border: none;
  box-shadow: 0 0 10px gray;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  margin: 60px auto;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 265px;
}

@media screen and (max-width: 550px) {
  .confirm-text {
    padding: 20vh 0 0;
  }
}
</style>
