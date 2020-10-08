<template>
  <article>
    <!--
      v1 の記事は medium-editor に関連したライブラリを CDN 経由で取得する必要があるため、a タグを用いる必要がある
      v2 の記事に関しては nuxt-link を利用可能だがページ遷移時に store 内のデータ書き換えに伴い表示崩れが発生するため a タグを利用
    -->
    <a
      :href="`/${article.user_id}/articles/${article.article_id}`"
      class="user-article-popular-card"
    >
      <span class="area-title">{{ decodedTitle }}</span>
      <img
        class="area-like-image"
        src="~assets/images/pc/article/icon_article_like.png"
        alt="Like token"
      >
      <span class="area-alis-token"> {{ article.alisToken | formatTokenAmount }} ALIS </span>
      <img
        class="area-tip-image"
        src="~assets/images/pc/article/icon_article_tip.png"
        alt="Tip token"
      >
      <span class="area-tip-value"> {{ article.tip_value | formatTokenAmount }} ALIS </span>
      <img
        v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
        class="area-eye-catch-image"
        src="~assets/images/pc/common/thumbnail_noimg.png"
        alt="Eye catch"
      >
      <img
        v-else
        class="area-eye-catch-image lazyload"
        src="~assets/images/pc/common/thumbnail_blank.png"
        :data-src="`${article.eye_catch_url}?d=592x296`"
        alt="Eye catch"
      >
    </a>
  </article>
</template>

<script>
import { htmlDecode, formatTokenAmount } from '~/utils/article'
export default {
  props: {
    article: {
      type: Object,
      require: true
    }
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.article.title)
    },
    decodedUsername() {
      return htmlDecode(this.userInfo.user_display_name)
    }
  },
  filters: {
    formatTokenAmount
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.user-article-popular-card {
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "title      title      title     title     eye-catch-image"
    "like-image alis-token tip-image tip-value eye-catch-image";
  grid-template-columns: 20px 90px 20px auto 73px;
  grid-template-rows: min-content min-content;
  cursor: pointer;
  align-items: center;
}

.area-title {
  grid-area: title;
  color: #333;
  font-size: 16px;
  letter-spacing: 0.02em;
  line-height: 1.5;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
}

.area-like-image {
  width: 16px;
  height: 16px;
}

.area-alis-token {
  grid-area: alis-token;
  margin: 0 4px 0 0;
  font-size: 14px;
  color: #6e6e6e;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.area-tip-image {
  width: 16px;
  height: 16px;
  margin-bottom: 2px;
}

.area-tip-value {
  grid-area: tip-value;
  margin: 0 4px 0 0;
  font-size: 14px;
  color: #6e6e6e;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.area-user-name {
  grid-area: user-name;
  margin-right: 8px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.area-eye-catch-image {
  grid-area: eye-catch-image;
  overflow: hidden;
  width: 57px;
  height: 57px;
  margin-left: 16px;
  object-fit: cover;
}

.user-article-popular-card {
  width: 100%;
}
</style>
