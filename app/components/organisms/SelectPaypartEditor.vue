<template>
  <div class="area-select-paypart-editor-container">
    <span class="area-title">
      {{ decodedTitle }}
    </span>
    <div class="area-content ck-content area-body" v-html="selectPayment.body" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { htmlDecode, showEmbed } from '~/utils/article'
import { isMobile } from '~/utils/device'

export default {
  computed: {
    decodedTitle() {
      return htmlDecode(this.selectPayment.title)
    },
    ...mapGetters('user', ['selectPayment'])
  },
  async mounted() {
    showEmbed()
    await this.$nextTick()
    if (isMobile()) {
      this.addPaywallLineNextBetweenEachElement()
    } else {
      this.handleAddPaywallLineOnPc()
      this.addPaywallLine()
    }
  },
  methods: {
    addPaywallLine() {
      const [firstElement] = document.querySelectorAll('.area-content > *')
      this.insertPaywallLineBeforeTargetElement(firstElement)
    },
    addPaywallLineNextBetweenEachElement() {
      Array.from(document.querySelectorAll('.area-content > *'), (element) => {
        const p = document.createElement('p')
        // paywall-line-next をタップしたときに、既存の paywall-line を paywall-line-next に変更し
        // タップされた paywall-line-next を paywall-line に変更する
        p.addEventListener('touchstart', (event) => {
          const isPaywallLineNext =
            event.target.classList &&
            Array.from(event.target.classList).includes('paywall-line-next')
          if (isPaywallLineNext) {
            this.removePaywallLine()
            this.changePaywallLineNextToPaywall(event.target)
          }
        })
        p.classList.add('paywall-line-next')
        p.innerText = 'ラインをこの場所に変更する'
        document.querySelector('.area-content').insertBefore(p, element.nextSibling)
      })
      const [firstPaywallLineNextElement] = document.querySelectorAll(
        '.area-content > .paywall-line-next'
      )
      this.changePaywallLineNextToPaywall(firstPaywallLineNextElement)
    },
    handleAddPaywallLineOnPc() {
      Array.from(document.querySelectorAll('.area-content > *'), (element) => {
        element.addEventListener('mouseover', (e) => {
          if (e.target.nodeName === 'IMG') return
          this.removePaywallLineNext()
          const p = document.createElement('p')
          p.addEventListener('click', () => {
            this.removePaywallLine()
            this.removePaywallLineNext()
            this.insertPaywallLineBeforeTargetElement(element)
          })
          // マウスオーバーされている要素の次の要素のチェックし、paywall-line なら
          // 「ラインをこの場所に移動する」を表示しない
          if (
            e.target.nextSibling &&
            e.target.nextSibling.classList &&
            Array.from(e.target.nextSibling.classList).includes('paywall-line')
          ) {
            return
          }
          p.classList.add('paywall-line-next')
          p.innerText = 'ラインをこの場所に変更する'
          document.querySelector('.area-content').insertBefore(p, element.nextSibling)
        })
        element.addEventListener('click', (e) => {
          this.removePaywallLine()
          this.removePaywallLineNext()
          this.insertPaywallLineBeforeTargetElement(element)
        })
      })
    },
    changePaywallLineToPaywallLineNext(element) {
      element.classList.remove('paywall-line')
      element.classList.add('paywall-line-next')
      element.innerText = 'ラインをこの場所に変更する'
    },
    changePaywallLineNextToPaywall(element) {
      element.classList.remove('paywall-line-next')
      element.classList.add('paywall-line')
      element.innerText = 'このラインより上のエリアが無料で表示'
    },
    removePaywallLine() {
      const paywallLineElement = document.querySelector('.paywall-line')
      if (paywallLineElement) paywallLineElement.parentNode.removeChild(paywallLineElement)
    },
    removePaywallLineNext() {
      const paywallLineNextElement = document.querySelector('.paywall-line-next')
      if (paywallLineNextElement) {
        paywallLineNextElement.parentNode.removeChild(paywallLineNextElement)
      }
    },
    insertPaywallLineBeforeTargetElement(element) {
      document
        .querySelector('.area-content')
        .insertBefore(this.createPaywallArea(), element.nextSibling)
    },
    createPaywallArea() {
      const p = document.createElement('p')
      p.innerText = 'このラインより上のエリアが無料で表示'
      p.classList.add('paywall-line')
      return p
    }
  }
}
</script>

<style lang="scss" scoped>
.area-select-paypart-editor-container {
  display: grid;
  grid-area: editor;
  grid-template-rows: min-content min-content;
  grid-gap: 20px;
  grid-template-columns: 640px;
  /* prettier-ignore */
  grid-template-areas:
    "title"
    "body ";
}

.area-title {
  grid-area: title;
  border: 0;
  color: #333;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.02em;
  line-height: 1.5;
  resize: none;

  &:placeholder-shown {
    color: #898989;
  }

  &:focus {
    outline: 0;
  }
}

.area-body {
  grid-area: body;
  width: 100%;
  padding-bottom: 120px;
}

@media screen and (max-width: 640px) {
  .area-select-paypart-editor-container {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }

  .area-title {
    letter-spacing: 0.01em;
    padding: 2px 12px;
  }

  .area-body {
    padding-bottom: 0;
  }
}
</style>
