<template>
  <div class="distributed-tokens">
    <app-header />
    <nav class="area-nav">
      <div class="nav-content">
        獲得ALIS
      </div>
    </nav>
    <div class="area-distributed-tokens">
      <div class="doughnut-chart-box">
        <doughnut-chart :data="doughnutChartData" :options="doughnutChartOptions" class="doughnut-chart"/>
        <span class="amount">{{ addDigitSeparator(totalAmount) }}</span>
        <span class="unit">ALIS</span>
        <span class="aggregation-date">※2019/1/1より集計</span>
      </div>
      <div class="distributed-token-detail-box">
        <ul class="distributed-token-detail-box-ul">
          <li class="distributed-token-detail-content">
            <div class="list-mark article"/>
            <span class="kind">記事執筆</span>
            <span class="amount">{{ addDigitSeparator(distributedTokens.article) }}</span>
            <span class="unit">ALIS</span>
            <span class="rate">({{ rate.article }}%)</span>
          </li>
          <li class="distributed-token-detail-content">
            <div class="list-mark like"/>
            <span class="kind">いいね</span>
            <span class="amount">{{ addDigitSeparator(distributedTokens.like) }}</span>
            <span class="unit">ALIS</span>
            <span class="rate">({{ rate.like }}%)</span>
          </li>
          <li class="distributed-token-detail-content">
            <div class="list-mark tip"/>
            <span class="kind">投げ銭</span>
            <span class="amount">{{ addDigitSeparator(distributedTokens.tip) }}</span>
            <span class="unit">ALIS</span>
            <span class="rate">({{ rate.tip }}%)</span>
          </li>
          <li class="distributed-token-detail-content">
            <div class="list-mark bonus"/>
            <span class="kind">保有ボーナス</span>
            <span class="amount">{{ addDigitSeparator(distributedTokens.bonus) }}</span>
            <span class="unit">ALIS</span>
            <span class="rate">({{ rate.bonus }}%)</span>
          </li>
        </ul>
        <span class="minimum-description">※0.001ALIS未満は表示されません</span>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chart from 'chart.js'
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'
import DoughnutChart from '~/utils/doughnut-chart'

export default {
  components: {
    AppHeader,
    AppFooter,
    DoughnutChart
  },
  mounted() {
    Chart.plugins.register({
      afterRender(chartInstance, easing) {
        const ctx = chartInstance.chart.ctx
        chartInstance.data.datasets.forEach((dataset, i) => {
          const meta = chartInstance.getDatasetMeta(i)
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              ctx.fillStyle = 'white'
              const fontSize = 18
              const fontStyle = 'bold'
              const fontFamily = `'Yu Gothic', YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
                                  'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
                                  'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif`
              ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily)
              const rateString = dataset.rate[index].toString()
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              const position = element.tooltipPosition()
              if (rateString !== '0') {
                ctx.fillText(`${rateString}%`, position.x, position.y)
              }
            })
          }
        })
      },
      beforeDatasetsDraw(chartInstance) {
        const x = chartInstance.chart.canvas.clientWidth / 2
        const y = chartInstance.chart.canvas.clientHeight / 2
        const ctx = chartInstance.chart.ctx

        ctx.beginPath()
        ctx.arc(x, y, chartInstance.outerRadius - chartInstance.radiusLength / 2, 0, 2 * Math.PI)
        ctx.lineWidth = chartInstance.radiusLength
        ctx.strokeStyle = '#e4f4ff'
        ctx.stroke()
      }
    })
  },
  computed: {
    doughnutChartData() {
      const { article, like, tip, bonus } = this.distributedTokens

      return {
        datasets: [
          {
            data: [article, like, tip, bonus],
            backgroundColor: ['#0086cc', '#00c5ff', '#76ddfb', '#dbecf8'],
            rate: Object.values(this.rate)
          }
        ],
        labels: ['記事執筆', 'いいね', '投げ銭', '保有ボーナス']
      }
    },
    doughnutChartOptions() {
      return {
        legend: { display: false },
        events: [],
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        cutoutPercentage: 62
      }
    },
    rate() {
      const { article, like, tip, bonus } = this.distributedTokens

      return {
        article: this.getRate(article, this.totalAmount),
        like: this.getRate(like, this.totalAmount),
        tip: this.getRate(tip, this.totalAmount),
        bonus: this.getRate(bonus, this.totalAmount)
      }
    },
    totalAmount() {
      return Math.floor(
        Object.values(this.distributedTokens).reduce((acc, crr) => Number(acc) + Number(crr), 0)
      )
    },
    ...mapGetters('user', ['distributedTokens'])
  },
  methods: {
    addDigitSeparator(str) {
      let num = String(str).replace(/,/g, '')
      let tmpNum = ''
      while (num !== tmpNum) {
        tmpNum = num
        num = num.replace(/^(-?\d+)(\d{3})/, '$1,$2')
      }
      return num
    },
    getRate(num, totalAmount) {
      return Math.floor(num / totalAmount * 100) || 0
    }
  }
}
</script>

<style lang="scss" scoped>
.distributed-tokens {
  display: grid;
  grid-row-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header         app-header"
    "...        nav                ...       "
    "...        distributed-tokens ..."
    "app-footer app-footer         app-footer";

  grid-template-columns: 1fr 710px 1fr;
  grid-template-rows: 100px 22px auto 75px;
  min-height: 100vh;
}

.area-nav {
  grid-area: nav;
  display: flex;
  border-bottom: 1px solid #e6e6e6;

  .nav-content {
    border-bottom: 1px solid #0086cc;
    color: #0086cc;
    font-size: 12px;
    height: 20px;
    letter-spacing: 1.2px;
    text-align: center;
  }
}

.area-distributed-tokens {
  grid-area: distributed-tokens;
  display: flex;
  padding: 60px 40px 0;
}

.doughnut-chart-box {
  position: relative;

  .doughnut-chart {
    width: 240px;
    height: 240px;
  }

  .amount {
    color: #030303;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1.33px;
    position: absolute;
    text-align: center;
    top: 108px;
    width: 100%;
  }

  .unit {
    color: #030303;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    position: absolute;
    text-align: center;
    top: 136px;
    width: 100%;
  }

  .aggregation-date {
    color: #6e6e6e;
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.8px;
    padding-top: 12px;
    text-align: center;
    width: 100%;
  }
}

.distributed-token-detail-box {
  margin: 60px 0 0 80px;
  width: 300px;

  .distributed-token-detail-box-ul {
    margin: 0;
    padding: 0;
  }

  .distributed-token-detail-content {
    align-items: center;
    display: flex;
    list-style: none;
    margin-bottom: 12px;
  }

  .list-mark {
    border-radius: 50%;
    display: inline-block;
    height: 10px;
    margin-right: 6px;
    width: 10px;
  }

  .article {
    background: #0086cc;
  }

  .like {
    background: #00c5ff;
  }

  .tip {
    background: #76ddfb;
  }

  .bonus {
    background: #dbecf8;
  }

  .kind {
    color: #485465;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: -0.07px;
    margin-right: auto;
  }

  .amount {
    color: #030303;
    float: right;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .unit {
    color: #030303;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-right: 6px;
    margin-top: 4px;
  }

  .rate {
    color: #6e6e6e;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-align: right;
    width: 44px;
  }

  .minimum-description {
    color: #6e6e6e;
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.8px;
    width: 100%;
    text-align: right;
  }
}

@media screen and (max-width: 640px) {
  .distributed-tokens {
    grid-template-columns: 1fr 300px 1fr;
    grid-template-rows: 66px 22px auto min-content;
  }

  .area-distributed-tokens {
    flex-direction: column;
    padding: 20px 0 0;
  }

  .doughnut-chart-box .doughnut-chart {
    margin: 0 auto;
  }

  .distributed-token-detail-box {
    margin: 40px auto;
    width: 290px;
  }
}

@media screen and (max-width: 550px) {
  .distributed-tokens {
    grid-row-gap: 0;
    /* prettier-ignore */
    grid-template-areas:
      "app-header app-header         app-header"
      "nav        nav                nav       "
      "...        distributed-tokens ..."
      "app-footer app-footer         app-footer";
    grid-template-columns: 1fr 350px 1fr;
  }

  .area-nav {
    box-shadow: 0 1px 16px 0 rgba(192, 192, 192, 0.5);
    padding-left: 20px;
  }

  .area-distributed-tokens {
    padding: 40px 0 0;
  }
}

@media screen and (max-width: 320px) {
  .distributed-tokens {
    grid-template-columns: 1fr 280px 1fr;
  }

  .distributed-token-detail-box {
    width: 260px;
  }
}
</style>
