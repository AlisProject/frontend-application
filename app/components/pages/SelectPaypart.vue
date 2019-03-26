<template>
  <div :class="`select-paypart-container ${deviceType}`">
    <app-header v-if="deviceType === 'pc'" />
    <select-paypart-header v-else />
    <select-paypart-header-nav v-if="deviceType === 'pc'" />
    <select-paypart-editor />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import SelectPaypartHeader from '../organisms/SelectPaypartHeader'
import SelectPaypartHeaderNav from '../molecules/SelectPaypartHeaderNav'
import SelectPaypartEditor from '../organisms/SelectPaypartEditor'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    AppHeader,
    SelectPaypartHeader,
    SelectPaypartHeaderNav,
    SelectPaypartEditor
  },
  data() {
    return {
      deviceType: 'pc'
    }
  },
  mounted() {
    if (isIOS()) {
      this.deviceType = 'ios'
      return
    }
    if (isAndroid()) this.deviceType = 'android'
  }
}
</script>

<style lang="scss" scoped>
.select-paypart-container.pc {
  display: grid;
  grid-template-rows: 100px 74px 50px 650px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header app-header app-header'
    'nav        nav        nav       '
    '...        ...        ...       '
    '...        editor     ...       '
    '...        ...        ...       ';
}

.select-paypart-container.ios,
.select-paypart-container.android {
  display: grid;
  grid-template-columns: 1fr 640px 1fr;
  grid-template-rows: 66px min-content min-content min-content;
  /* prettier-ignore */
  grid-template-areas:
    'app-header app-header app-header'
    '...        ...        ...       '
    '...        editor     ...       '
    '...        ...        ...       ';
}

@media screen and (max-width: 640px) {
  .select-paypart-container.ios,
  .select-paypart-container.android {
    display: grid;
    grid-template-rows: 66px min-content min-content min-content;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
      'app-header app-header app-header'
      '...        ...        ...       '
      '...        editor     ...       '
      '...        ...        ...       ';
  }
}
</style>
