<template>
  <div v-if="ready" class="area-category-ranking-container">
    <nuxt-link class="header-link first-item" to="/">
      TOP /
    </nuxt-link>
    <nuxt-link class="header-link" to="/articles/popular?topic=game">
      ゲーム /
    </nuxt-link>
    <span class="header-link">NFTゲームランキング</span>
    <item-label :labelName="rankingLabel" :addLink="addLink" :addText="addText" />
    <ve-table
      :columns="columns"
      :table-data="rankingData"
      :sort-option="sortOption"
      :scroll-width="1078"
      :cell-style-option="cellStyleOption"
      :event-custom-option="eventCustomOption"
      class="ranking-table"
    />
    <div class="table-pagination">
      <ve-pagination
        :total="totalCount"
        :page-index="pageIndex"
        :page-size="pageSize"
        :layout="['prev', 'pager', 'next']"
        @on-page-number-change="pageNumberChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>
    <item-label :labelName="`NFTゲームとは`" :addLink="addLink" :addText="addText" />
    <div class="description">
      <p>
        NFTゲームとは、NFT（非代替性トークン）と暗号資産を含む、ブロックチェーン技術を利用したゲームを指します。
        ブロックチェーンゲーム、GameFiとも呼ばれることもあり、特に遊ぶことで稼ぐことができるゲームは
        Play-to-Earnゲームとも呼ばれます。
      </p>
      <p>
        NFTゲームは2017年リリースのCrypto
        Kittiesを初とし、今ではスクエア・エニックスやUbisoftといった大手ゲーム企業も参入し、多くのゲームがパソコンやスマホで遊べるようになっています。
        ブロックチェーン技術がどのように活用されるかはゲームによって異なり、新しい活用法も次々と発明されます。
        よく見かけるNFTゲームの特徴としては、ゲームアイテムやゲーム通貨のデータがゲームサーバーではなく、ブロックチェーン上に存在することを挙げられます。
      </p>
      <p>
        カードゲームを例にすると、通常オンラインカードゲームでは、プレイヤーが持っているカードはあくまでも企業のゲームサーバー上に存在し、
        オフラインカードゲームのようにプレイヤーが自由にカードを交換したり、販売することはできません。
        NFTゲームではゲームデータがブロックチェーン上に存在することで、これらを容易に実現可能となっています。
      </p>
    </div>
    <item-label :labelName="`NFTがもらえるゲーム一覧`" :addLink="addLink" :addText="addText" />
    <div class="area-contents">
      <div v-for="item in campaigns" class="campaign">
        <nuxt-link :to="item.articleUrl" class="campaign-link">
          <img class="image" :src="`/d/nuxt/dist/img/static/campaigns/${item.imageSrc}`">
          <div class="description">
            {{ item.description }}
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="footer-text">
      <p>
        ※
        掲載している情報の正確性については万全を期しておりますが、その内容を保証するものではありません。
      </p>
      <p>※ 掲載情報に基づいて被ったいかなる損害についても運営者は一切の責任を負いません。</p>
      <p>※ より正確な情報はFootprint Analytics（https://www.footprint.network/）をご確認ください</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemLabel from '../atoms/ItemLabel'

export default {
  components: {
    ItemLabel
  },
  data() {
    return {
      rankingLabel: 'NFTゲーム人気ランキング',
      addLink: '',
      addText: '',
      ready: false,
      // ve-table param
      loadingInstance: null,
      targetSortProps: [
        'tag_count',
        'active_users_today',
        'active_users_7days',
        'active_users_30days',
        'total_users'
      ],
      prevSort: 'tag_count',
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      eventCustomOption: {
        bodyRowEvents: ({ row, rowIndex }) => {
          return {
            click: (event) => {
              this.$router.push(`/tag/${row.tag_name}`)
            }
          }
        }
      },
      cellStyleOption: {
        headerCellClass: ({ column, rowIndex }) => {
          return 'table-header-cell-class'
        },
        bodyCellClass: ({ row, column, rowIndex }) => {
          let addClass = 'table-body-cell-class'
          if (column.field === 'name') {
            addClass += ' cell-name-class'
          } else if (column.field === 'tag_name') {
            addClass += ' cell-tag-name-class'
          }
          return addClass
        }
      },
      sortOption: {
        sortAlways: true,
        sortChange: (params) => {
          this.sortChange(params)
        }
      },
      columns: [
        {
          field: 'ranking',
          key: 'a',
          title: '#',
          width: 30,
          align: 'center',
          fixed: 'left',
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return ++rowIndex + (this.pageIndex - 1) * this.pageSize
          }
        },
        {
          field: 'icon',
          key: 'b',
          title: '',
          width: 55,
          align: 'center',
          fixed: 'left',
          renderBodyCell: ({ row }) => {
            const imgSrc = `/d/nuxt/dist/img/static/bcg_ranking/icon/${row.key}.png`
            return <img alt="logo" src={imgSrc} class="ranking-game-icon" />
          }
        },
        {
          field: 'name',
          key: 'c',
          title: 'ゲーム',
          width: 120,
          align: 'left'
        },
        {
          field: 'tag_count',
          key: 'd',
          title: '記事数',
          width: 65,
          align: 'right',
          sortBy: 'desc'
        },
        {
          field: 'active_users_today',
          key: 'e',
          title: 'ユーザー数(1日)',
          width: 120,
          align: 'right',
          sortBy: ''
        },
        {
          field: 'active_users_7days',
          key: 'f',
          title: 'ユーザー数(7日)',
          width: 120,
          align: 'right',
          sortBy: ''
        },
        {
          field: 'active_users_30days',
          key: 'g',
          title: 'ユーザー数(30日)',
          width: 120,
          align: 'right',
          sortBy: ''
        },
        {
          field: 'total_users',
          key: 'h',
          title: 'ユーザー数(合計)',
          width: 120,
          align: 'right',
          sortBy: ''
        },
        {
          field: 'tag_name',
          key: 'i',
          title: '記事タグ',
          width: 120,
          align: 'left'
        }
      ],
      campaigns: [
        {
          imageSrc: 'lok.png',
          articleUrl: '/ALIS-official/articles/365Rb1VZYWkw',
          description:
            '先着50名！League of Kingdomsの「Ready for Battle Pack」をゲットできるコラボ実施中！'
        },
        {
          imageSrc: 'splinterlands.png',
          articleUrl: '/ALIS-official/articles/3751dAZ9YDLP',
          description: '先着100名！Splinterlandsのカードパックをゲットできるコラボ実施中！'
        },
        {
          imageSrc: 'cryptospelles.png',
          articleUrl: '/ALIS-official/articles/KOwJdwy0xb9z',
          description: '先着200名！CryptoSpellsの「蒼炎の崇拝者」をゲットできるコラボ実施中！'
        }
      ]
    }
  },
  computed: {
    rankingData() {
      const { pageIndex, pageSize } = this
      return this.tableData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    },
    // total count
    totalCount() {
      return this.tableData.length
    },
    ...mapGetters('nftGames', ['nftGamesRankingInfo'])
  },
  async mounted() {
    this.loadingInstance = this.$veLoading({
      fullscreen: true,
      name: 'bounce',
      lock: true
    })
    this.loadingInstance.show()
    await this.getNftGamesRanking()
    this.tableData = this.nftGamesRankingInfo
    this.loadingInstance.close()
    this.ready = true
  },
  destroyed() {
    this.loadingInstance.destroy()
  },
  methods: {
    // page number change
    pageNumberChange(pageIndex) {
      this.pageIndex = pageIndex
    },
    // page size change
    pageSizeChange(pageSize) {
      this.pageIndex = 1
      this.pageSize = pageSize
    },
    show() {
      this.loadingInstance.show()
    },
    close() {
      this.loadingInstance.close()
    },
    sortChange(params) {
      this.targetSortProps.forEach((prop) => {
        if (params[prop]) {
          this.tableData.sort((a, b) => {
            if (params[prop] === 'asc') {
              if (a[prop] === undefined) return -1
              if (b[prop] === undefined) return 1
              return a[prop] - b[prop]
            } else if (params[prop] === 'desc') {
              if (a[prop] === undefined) return 1
              if (b[prop] === undefined) return -1
              return b[prop] - a[prop]
            } else {
              return 0
            }
          })
        }
      })
    },
    ...mapActions('nftGames', ['getNftGamesRanking'])
  }
}
</script>

<style lang="scss">
.area-category-ranking-container {
  grid-area: ranking;
  margin: 0 0 40px 0;
  .label-area {
    margin: 50px 0 30px 0;
    /*font-size: 24px !important;*/
  }
  .header-link {
    color: #6e6e6e;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    margin-right: 3px;
    height: 16px;
    white-space: nowrap;
  }
  .ranking-table {
    margin-top: 30px;
  }
  .table-header-cell-class {
    font: 600 12px / 16px Helvetica Neue, Arial, sans-serif !important;
    height: 37px !important;
    color: #6e6e6e !important;
  }
  .table-body-cell-class {
    font: 400 14px / 16px Roboto, sans-serif;
    height: 72px !important;
    color: #6e6e6e !important;
    &.cell-name-class {
      text-overflow: ellipsis;
    }
    &.cell-tag-name-class {
      font-size: 12px !important;
    }
    cursor: pointer !important;
  }
  .ranking-game-icon {
    height: 40px;
    width: 40px;
  }
  .table-pagination {
    margin: 20px 0 10px 0;
    text-align: right;
  }
  .description {
    color: #6e6e6e;
    font-size: 14px;
    text-decoration: none;
    letter-spacing: 0.05em;
    line-height: 1.5;
    margin: 0 0 20px 0;
  }
  .footer-text {
    color: #6e6e6e;
    font-size: 10px;
    text-decoration: none;
    margin: 100px 0 10px 0;
  }
  .area-contents {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;
  }
  .campaign {
    width: 500px;
    margin: 20px;
    .campaign-link {
      color: #6e6e6e;
      text-decoration: none;
    }
    .image {
      width: 500px;
      height: 280px;
    }
    .description {
      margin: 16px 0 0 0;
      height: 60px;
    }
  }

  @media screen and (max-width: 550px) {
    .table-pagination {
      margin: 20px 0 80px 0;
      text-align: center;
    }
    .header-link {
      &.first-item {
        content: '';
        margin-left: 15px;
      }
    }
    .label-area {
      margin: 40px 0 15px 15px;
    }
    .description {
      margin: 15px 15px 100px 15px;
    }
    .footer-text {
      margin: 100px 15px 10px 15px;
    }
    .area-content {
      width: 90vw;
    }
    .area-title {
      font-size: 18px;
      grid-area: title;
      letter-spacing: 0.1em;
    }
    .campaign {
      width: calc(100% - 20px);
      margin: 10px;

      .campaign-link {
        color: #6e6e6e;
        text-decoration: none;
      }
      .image {
        width: 100%;
        height: calc((100vw - 40px) / 16 * 9);
      }
    }
  }
}
</style>
