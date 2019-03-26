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
      this.addPaypartAreaBeforeBetweenEachElement()
    } else {
      this.addPaypartArea()
      this.handleAddPaypartOnPc()
    }
  },
  methods: {
    addPaypartArea() {
      const [firstElement] = document.querySelectorAll('.area-content > *')
      this.insertPaywallAreaBeforeTargetElement(firstElement)
    },
    addPaypartAreaBeforeBetweenEachElement() {
      Array.from(document.querySelectorAll('.area-content > *'), (element) => {
        const pb = document.createElement('p')
        pb.addEventListener('touchstart', (event) => {
          const isAreaBefore =
            event.target.classList && Array.from(event.target.classList).includes('areaBefore')
          if (isAreaBefore) {
            const area = document.querySelector('.area')
            if (area) this.changeAreaToAreaBefore(area)
            this.changeAreaBeforeToArea(event.target)
          }
        })
        pb.classList.add('areaBefore')
        pb.innerText = 'ラインをこの場所に変更する'
        document.querySelector('.area-content').insertBefore(pb, element.nextSibling)
      })
      const [firstAreaBeforeElement] = document.querySelectorAll('.area-content > .areaBefore')
      this.changeAreaBeforeToArea(firstAreaBeforeElement)
    },
    handleAddPaypartOnPc() {
      Array.from(document.querySelectorAll('.area-content > *'), (element) => {
        element.addEventListener('mouseover', (e) => {
          if (e.target.nodeName === 'IMG') return
          const areaBefore = document.querySelector('.areaBefore')
          if (areaBefore) areaBefore.parentNode.removeChild(areaBefore)
          const pb = document.createElement('p')
          pb.addEventListener('click', () => {
            const area = document.querySelector('.area')
            if (area) area.parentNode.removeChild(area)
            const areaBefore = document.querySelector('.areaBefore')
            areaBefore.parentNode.removeChild(areaBefore)
            this.insertPaywallAreaBeforeTargetElement(element)
          })
          if (
            e.target.nextSibling &&
            e.target.nextSibling.classList &&
            Array.from(e.target.nextSibling.classList).includes('area')
          ) {
            return
          }
          pb.classList.add('areaBefore')
          pb.innerText = 'ラインをこの場所に変更する'
          document.querySelector('.area-content').insertBefore(pb, element.nextSibling)
        })
        element.addEventListener('click', (e) => {
          const area = document.querySelector('.area')
          if (area) area.parentNode.removeChild(area)
          const areaBefore = document.querySelector('.areaBefore')
          if (areaBefore) areaBefore.parentNode.removeChild(areaBefore)
          this.insertPaywallAreaBeforeTargetElement(element)
        })
      })
    },
    changeAreaToAreaBefore(element) {
      element.classList.remove('area')
      element.classList.add('areaBefore')
      element.innerText = 'ラインをこの場所に変更する'
    },
    changeAreaBeforeToArea(element) {
      element.classList.remove('areaBefore')
      element.classList.add('area')
      element.innerText = 'このラインより上のエリアが無料で表示'
    },
    createPaywallArea() {
      const p = document.createElement('p')
      p.innerText = 'このラインより上のエリアが無料で表示'
      p.classList.add('area')
      return p
    },
    insertPaywallAreaBeforeTargetElement(element) {
      document
        .querySelector('.area-content')
        .insertBefore(this.createPaywallArea(), element.nextSibling)
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
