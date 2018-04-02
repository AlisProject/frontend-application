<template>
  <div class="area-footer-actions">
    <div class="action like">
      <span class="likes-count">{{ likesCount }}</span>
    </div>
    <div class="action etc" @click="toggleEtcPopup">
      <div class="etc-popup" v-show="isEtcPopupShown">
        <span class="report" @click="showPopupReportModal">
          通報する
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      isEtcPopupShown: false
    }
  },
  props: {
    likesCount: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeEtcPopup()
      }
    })
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    ...mapGetters('user', ['showReportModal'])
  },
  methods: {
    toggleEtcPopup() {
      this.isEtcPopupShown = !this.isEtcPopupShown
    },
    closeEtcPopup() {
      this.isEtcPopupShown = false
    },
    showPopupReportModal() {
      this.setReportModal({ showReportModal: true })
      window.scrollTo(0, 0)
      document.querySelector('html,body').style.overflow = 'hidden'
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    ...mapActions('user', ['setReportModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-footer-actions {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 70px;
  grid-template-columns: repeat(4, 60px);
  justify-content: right;

  .action {
    width: 60px;
    height: 60px;
  }

  .etc {
    background: url('~assets/images/pc/article/btn_etc.png') no-repeat;
    background-size: 54px;
    position: relative;
    cursor: pointer;

    .etc-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 16px;
      position: absolute;
      right: 12px;
      top: 52px;
      width: 90px;
      z-index: 1;

      .report {
        cursor: pointer;
      }
    }
  }

  .like {
    background: url('~assets/images/pc/article/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 20px;
    background-position: 10px 14px;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;

    .likes-count {
      color: #585858;
      font-size: 14px;
      position: absolute;
      top: -18px;
      left: 5px;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    position: relative;

    &:after {
      bottom: 48px;
      box-shadow: 0 15px 10px -10px rgba(192, 192, 192, 0.5);
      content: '';
      height: 100px;
      opacity: 0.5;
      position: absolute;
      width: 100%;
    }

    .action {
      z-index: 1;
    }
  }
}
</style>
