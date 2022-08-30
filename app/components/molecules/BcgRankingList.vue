<template>
  <div class="bcg-ranking-board">
    <table class="bcg-ranking-table">
      <colgroup>
        <col class="bcg-col-index">
        <col class="bcg-col-name">
        <col class="bcg-col-tag">
        <col class="bcg-col-count">
      </colgroup>
      <thead>
        <tr class="bcg-ranking-head">
          <th />
          <th class="bcg-name-head">
            タイトル
          </th>
          <th class="bcg-tag-head">
            タグ
          </th>
          <th class="bcg-count-head">
            記事数
          </th>
        </tr>
      </thead>
      <!--画面のちらつきを抑えるため、先に表示領域を確保-->
      <tbody v-if="rankingInfo.length < 1" class="bcg-ranking-body">
        <tr v-for="index of indexCount" :key="index">
          <td />
        </tr>
      </tbody>
      <tbody v-else class="bcg-ranking-body">
        <tr v-for="(bcgInfo, index) in rankingInfo" :key="bcgInfo.key">
          <td class="bcg-index" @click="toTag(`/tag/${bcgInfo.tag_name}`)">
            <span v-if="index === 0" class="bcg-ranking-pr">PR</span>
            <span v-else>{{ index }}</span>
          </td>
          <td class="bcg-name" @click="toTag(`/tag/${bcgInfo.tag_name}`)">
            <img
              :src="`/d/nuxt/dist/img/static/bcg_ranking/icon/${bcgInfo.key}.png`"
              class="bcg-image"
            >
            <span class="name-text">{{ bcgInfo.name }}</span>
          </td>
          <td class="bcg-tag" @click="toTag(`/tag/${bcgInfo.tag_name}`)">
            <span class="bcg-tag-link">
              {{ bcgInfo.tag_name }}
            </span>
          </td>
          <td v-if="bcgInfo.count > 0" class="bcg-count">
            {{ bcgInfo.count }}
          </td>
          <td v-else class="bcg-count" @click="moveToNewArticlePage">
            <span class="new-article-text">
              <i class="fas fa-pen" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    indexCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      prGameKey: 'wizardia'
    }
  },
  computed: {
    sortedRankingInfo() {
      const prItem = this.bcgRankingInfo.filter((item) => item.key === this.prGameKey)
      const tmpItems = this.bcgRankingInfo.filter((item) => item.key !== this.prGameKey)
      if (prItem.length === 1) {
        tmpItems.unshift(prItem[0])
        return tmpItems
      }
      return this.bcgRankingInfo
    },
    rankingInfo() {
      return this.sortedRankingInfo.slice(0, this.indexCount)
    },
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('article', ['bcgRankingInfo'])
  },
  mounted() {
    this.getBcgRankingInfo({ limit: this.indexCount })
  },
  beforeDestroy() {
    this.resetBcgRankingInfo()
  },
  methods: {
    toTag(tagLink) {
      this.$router.push(tagLink)
    },
    async moveToNewArticlePage() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleCreate' })
        return
      }
      if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCreate' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      const encryptInfo = await this.getWalletEncryptInfo()
      if (!encryptInfo.encrypted_secret_key) {
        this.setRequestWalletPasswordModal({ isShow: true })
        this.setRequestInputWalletPasswordModal({ isShow: true })
        return
      }
      this.$router.push('/me/articles/new')
    },
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'getWalletEncryptInfo',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal'
    ]),
    ...mapActions('article', ['getBcgRankingInfo', 'resetBcgRankingInfo'])
  }
}
</script>

<style scoped>
.bcg-ranking-board {
  box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
  border-radius: 4px;
  position: relative;
  text-decoration: none;
  padding: 7px 10px 3px 10px;
}
.bcg-ranking-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  padding: 10px 10px 10px 10px;
}

.bcg-ranking-head {
  font-size: 12px;
  height: 24px;
  padding-bottom: 5px;
  text-align: right;
}
.bcg-ranking-table tbody:before {
  line-height: 4px;
  content: '\200C';
  display: block;
}
.bcg-ranking-head th {
  font-weight: normal;
  border-bottom: 1px solid #cecece;
}
.bcg-name-head {
  padding-left: 3px;
  text-align: left;
}
.bcg-tag-head {
  text-align: left;
}
.bcg-count-head {
  text-align: right;
}
.bcg-ranking-body {
  font-size: 12px;
  text-align: right;
}

.bcg-ranking-body tr {
  height: 52px;
}
.bcg-ranking-body tr:hover {
  cursor: pointer;
}
.bcg-col-index {
  width: 30px;
}
.bcg-col-name {
  width: 430px;
}
.bcg-col-tag {
  width: 300px;
}
.bcg-col-count {
  width: 300px;
}

.bcg-index {
  text-align: center;
}

.bcg-ranking-pr {
  font-size: 10px;
}

.bcg-name {
  color: #333;
  text-align: left;
}
.bcg-image {
  display: inline-block;
  vertical-align: middle;
  width: 32px;
  height: 32px;
  margin-left: 3px;
}
.name-text {
  display: inline-block;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  width: 300px;
}
.bcg-tag {
  text-align: left;
}
.bcg-tag-link {
  background-color: rgba(0, 134, 204, 0.05);
  border-radius: 2px;
  color: #0086cc;
  display: inline-block;
  font-size: 11px;
  line-height: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1px 4px;
  text-decoration: none;
}
.bcg-count {
  padding-right: 5px;
}
.new-article {
  width: 72px;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  box-shadow: none;
  font-weight: 400;
  margin-left: auto;
}

.new-article-text {
  color: #6e6e6e;
  width: 72px;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  box-shadow: none;
  font-weight: 400;
  margin-left: auto;
}

@media screen and (max-width: 1296px) {
  .bcg-col-index {
    width: 15px;
  }
  .bcg-col-name {
    width: 300px;
  }
  .bcg-col-tag {
    width: 200px;
  }
  .bcg-col-count {
    width: 175px;
  }
  .name-text {
    font-size: 12px;
    width: 250px;
  }
}

@media screen and (max-width: 920px) {
  .bcg-col-index {
    width: 15px;
  }
  .bcg-col-name {
    width: 150px;
  }
  .bcg-col-tag {
    width: 80px;
  }
  .bcg-col-count {
    width: 70px;
  }
  .name-text {
    font-size: 12px;
    width: 105px;
  }
  .bcg-tag-link {
    max-width: 75px;
  }
}

@media screen and (max-width: 370px) {
  .bcg-col-index {
    width: 12px;
  }
  .bcg-col-name {
    width: 95px;
  }
  .bcg-col-tag {
    width: 75px;
  }
  .bcg-col-count {
    width: 60px;
  }
  .name-text {
    font-size: 12px;
    font-weight: normal;
    width: 65px;
  }
  .bcg-tag-link {
    max-width: 70px;
  }
  .bcg-count {
    padding-right: 0;
  }
}
</style>
