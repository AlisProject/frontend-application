<template>
  <div class="area-article-comments">
    <template v-for="comment in comments">
      <article-comment :comment="comment" :key="comment.id"/>
    </template>
    <button class="read-more">もっと見る</button>
  </div>
</template>

<script>
import ArticleComment from '../atoms/ArticleComment'

export default {
  components: {
    ArticleComment
  },
  props: ['comments']
}
</script>

<style lang="scss" scoped>
.area-article-comments {
  display: grid;
  grid-area: article-comments;
  grid-gap: 20px;
}

.read-more {
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid rgba(192, 192, 192, 0.5);
  box-sizing: border-box;
  color: #5b5b5b;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  margin-bottom: 40px;
  padding: 10px;
}
</style>
