<template>
  <div class="area-tags">
    <span class="tag" v-for="tag in tags" :key="tag.name">
      {{ tag.name }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['tags']
}
</script>

<style lang="scss" scoped>
.area-tags {
  grid-area: tags;
}

.tag {
  background: #eee;
  border-radius: 4px;
  color: #4c4c4c;
  display: inline-block;
  font-size: 14px;
  line-height: 12px;
  margin: 0.2em;
  padding: 0.4em 1.5em;
}
</style>
