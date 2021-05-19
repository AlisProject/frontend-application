<template>
  <div class="coin-ranking-board">
    <table class="coin-ranking-table">
      <colgroup>
        <col class="coin-colindex">
        <col class="coin-colname">
        <col class="coin-colsymbol">
        <col class="coin-colprice">
        <col class="coin-colchange">
        <col class="coin-colcap">
      </colgroup>
      <thead>
        <tr class="coin-ranking-head">
          <th>#</th>
          <th class="coin-name-head">
            仮想通貨
          </th>
          <th class="coin-tag-head">
            タグ
          </th>
          <th>価格</th>
          <th>変動(1d)</th>
          <th class="market-cap-head">
            時価総額
          </th>
        </tr>
      </thead>
      <!--画面のちらつきを抑えるため、先に表示領域を確保-->
      <tbody v-if="cryptoRankingInfo.length < 1" class="coin-ranking-body">
        <tr v-for="index of indexCount" :key="index">
          <td />
        </tr>
      </tbody>
      <tbody v-else class="coin-ranking-body">
        <tr
          v-for="(cryptoInfo, index) in cryptoRankingInfo"
          :key="cryptoInfo.symbol"
          @click="toTag(`/tag/${cryptoInfo.symbol.toUpperCase()}`)"
        >
          <td class="coin-index">
            {{ index + 1 }}
          </td>
          <td class="coin-name">
            <img :src="cryptoInfo.image" class="coin-image">
            <span>{{ cryptoInfo.name }}</span>
          </td>
          <td class="coin-tag">
            <span class="coin-tag-link">
              {{ cryptoInfo.symbol.toUpperCase() }}
            </span>
          </td>
          <td>¥{{ cryptoInfo.current_price | priceLocaleString }}</td>
          <td :class="[cryptoInfo.price_change_percentage_24h < 0 ? 'minus-text' : 'puls-text']">
            {{ cryptoInfo.price_change_percentage_24h.toFixed(2) }}%
          </td>
          <td class="market-cap-body">
            ¥{{ cryptoInfo.market_cap | priceLocaleString }}
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
  computed: {
    ...mapGetters('article', ['cryptoRankingInfo'])
  },
  mounted() {
    this.getCryptoRankingInfo({ limit: this.indexCount })
  },
  beforeDestroy() {
    this.resetCryptoRankingInfo()
  },
  methods: {
    toTag(tagLink) {
      this.$router.push(tagLink)
    },
    ...mapActions('article', ['getCryptoRankingInfo', 'resetCryptoRankingInfo'])
  },
  filters: {
    priceLocaleString(price) {
      return price.toLocaleString()
    }
  }
}
</script>

<style scoped>
.coin-ranking-board {
  box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
  border-radius: 4px;
  position: relative;
  text-decoration: none;
  padding: 7px 10px 3px 10px;
}
.coin-ranking-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  padding: 10px 10px 10px 10px;
}

.coin-ranking-head {
  font-size: 12px;
  height: 21px;
  text-align: right;
}
.coin-ranking-table tbody:before {
  line-height: 4px;
  content: '\200C';
  display: block;
}
.coin-ranking-head th {
  font-weight: normal;
  border-bottom: 1px solid #cecece;
}
.coin-name-head {
  padding-left: 3px;
  text-align: left;
}
.coin-tag-head {
  text-align: center;
}
.coin-ranking-body {
  font-size: 12px;
  text-align: right;
}

.coin-ranking-body tr {
  height: 30px;
}
.coin-ranking-body tr:hover {
  cursor: pointer;
}
.coin-colindex {
  width: 10px;
}
.coin-colname {
  width: 100px;
}
.coin-colsymbol {
  width: 100px;
}
.coin-colprice {
  width: 100px;
}
.coin-colchange {
  width: 100px;
}
.coin-colcap {
  width: 100px;
}

.coin-image {
  width: 10px;
  height: 10px;
  margin-left: 3px;
}
.coin-name {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coin-tag {
  text-align: center;
}
.coin-tag-link {
  background-color: rgba(0, 134, 204, 0.05);
  border-radius: 2px;
  color: #0086cc;
  display: inline-block;
  font-size: 11px;
  line-height: 15px;
  white-space: nowrap;
  padding: 1px 4px;
  text-decoration: none;
}

.puls-text {
  color: #00d756;
}
.minus-text {
  color: #c00000;
}

@media screen and (max-width: 920px) {
  .coin-colindex {
    width: 15px;
  }
  .coin-colname {
    width: 90px;
  }
  .coin-colsymbol {
    width: 70px;
  }
  .coin-colprice {
    width: 70px;
  }
  .coin-colchange {
    width: 75px;
  }
  .coin-colcap {
    width: 0;
  }
  .market-cap-head {
    display: none;
  }
  .market-cap-body {
    display: none;
  }
}

@media screen and (max-width: 320px) {
  .coin-colindex {
    width: 12px;
  }
  .coin-colname {
    width: 72px;
  }
  .coin-colsymbol {
    width: 60px;
  }
  .coin-colprice {
    width: 65px;
  }
  .coin-colchange {
    width: 73px;
  }
}
</style>
