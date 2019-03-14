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

const PAYPART_WORDING = 'このラインより上のエリアが無料で表示されます'

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
    this.addArea()
    if (isMobile()) {
      this.handleAddPaypartOnSp()
    } else {
      this.handleAddPaypartOnPc()
    }
  },
  methods: {
    addArea() {
      const [firstElement] = document.querySelectorAll('.area-content > *')
      const p = document.createElement('p')
      p.innerText = PAYPART_WORDING
      p.classList.add('area')
      document.querySelector('.area-content').insertBefore(p, firstElement.nextSibling)
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
            const p = document.createElement('p')
            p.innerText = PAYPART_WORDING
            p.classList.add('area')
            const areaBefore = document.querySelector('.areaBefore')
            areaBefore.parentNode.removeChild(areaBefore)
            document.querySelector('.area-content').insertBefore(p, element.nextSibling)
          })
          if (
            e.target.nextElementSibling &&
            e.target.nextElementSibling.classList &&
            Array.from(e.target.nextElementSibling.classList).includes('area')
          ) {
            return
          }
          pb.classList.add('areaBefore')
          pb.innerText = 'ラインをこの場所に変更'
          document.querySelector('.area-content').insertBefore(pb, element.nextSibling)
        })
        element.addEventListener('click', (e) => {
          const area = document.querySelector('.area')
          if (area) area.parentNode.removeChild(area)
          const areaBefore = document.querySelector('.areaBefore')
          if (areaBefore) areaBefore.parentNode.removeChild(areaBefore)
          const p = document.createElement('p')
          p.innerText = PAYPART_WORDING
          p.classList.add('area')
          document.querySelector('.area-content').insertBefore(p, element.nextSibling)
        })
      })
    },
    handleAddPaypartOnSp() {
      Array.from(document.querySelectorAll('.area-content > *'), (elm) => {
        elm.addEventListener('touchstart', (element) => {
          const area = document.querySelector('.area')
          if (area) area.parentNode.removeChild(area)
          const p = document.createElement('p')
          p.innerText = PAYPART_WORDING
          p.classList.add('area')
          document.querySelector('.area-content').insertBefore(p, elm)
        })
      })
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
