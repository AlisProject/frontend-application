<template>
  <div class="tip-supporters-container">
    <app-header />
    <div class="area-supporters">
      <h1 class="title">
        サポーター一覧
      </h1>
      <nuxt-link
        v-for="(supporter, i) in supporters"
        :key="supporter.user_id"
        :to="`/users/${supporter.user_id}`"
        class="supporter"
      >
        <img
          v-if="supporter.icon_image_url"
          :class="`user-icon rank${i + 1}`"
          :src="supporter.icon_image_url | addOptimizeParamToImageUrl('48x48')"
          alt="Supporter profile icon"
        >
        <img
          v-else
          :class="`user-icon rank${i + 1}`"
          src="~assets/images/pc/common/icon_user_noimg.png"
          alt="Supporter profile icon"
        >
        <div class="name">
          {{ supporter.user_display_name | htmlDecode }}
        </div>
        <div class="user-id">
          @{{ supporter.user_id }}
        </div>
      </nuxt-link>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'
import { htmlDecode, addOptimizeParamToImageUrl } from '~/utils/article'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  computed: {
    ...mapGetters('article', ['supporters'])
  },
  filters: {
    htmlDecode,
    addOptimizeParamToImageUrl
  }
}
</script>

<style lang="scss" scoped>
.tip-supporters-container {
  display: grid;
  grid-row-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header app-header"
    "...        supporters ...       "
    "app-footer app-footer app-footer";
  grid-template-columns: minmax(0, 1fr) 400px minmax(0, 1fr);
  grid-template-rows: 100px auto minmax(75px, min-content);
  min-height: 100vh;
}

.area-supporters {
  grid-area: supporters;
  display: flex;
  flex-direction: column;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
  margin: 0 0 40px;
}

.supporter {
  position: relative;
  padding: 5px;
  margin-bottom: 16px;
  height: 30px;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;

  &.rank1 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #efdd52;
  }

  &.rank2 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #b5b5b5;
  }

  &.rank3 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #ffc16e;
  }
}

.name,
.user-id {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 350px;
}

.name {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  top: 2px;
  left: 46px;
}

.user-id {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.8px;
  bottom: 2px;
  left: 46px;
}

@media screen and (max-width: 550px) {
  .tip-supporters-container {
    grid-template-rows: 66px auto min-content;
    grid-template-columns: minmax(0, 1fr) 258px minmax(0, 1fr);
  }

  .name,
  .user-id {
    width: 208px;
  }
}
</style>
