<template>
  <div class="area-article-comments" :class="{ 'without-top-space': !showTopSpace }">
    <article-comment v-for="comment in comments" :comment="comment" :key="comment.id"/>
    <button class="read-more-button">もっと見る</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleComment from '../atoms/ArticleComment'

export default {
  components: {
    ArticleComment
  },
  data() {
    return {
      showTopSpace: false
    }
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.showTopSpace = !this.loggedIn
  },
  computed: {
    ...mapGetters('user', ['loggedIn'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-comments {
  background-color: rgba(35, 37, 56, 0.05);
  display: grid;
  grid-area: article-comments;
  grid-gap: 8px;
  padding: 40px calc(50% - 324px) 8px;

  &.without-top-space {
    padding-top: 0;
  }
}

.read-more-button {
  background-color: #4f5160;
  border-radius: 19px;
  border: none;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: YuGothic sans-serif;
  font-size: 14px;
  margin: 40px auto;
  outline: none;
  padding: 11px;
  width: 255px;
}

@media screen and (max-width: 640px) {
  .area-article-comments {
    padding: 40px 10px 8px;
  }
}
</style>
