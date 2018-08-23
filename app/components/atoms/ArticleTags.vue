<template>
  <div class="area-tags">
    <span class="tag" v-for="tag in tags" :key="tag">
      {{ tag }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-tags {
  grid-area: tags;
  margin-bottom: -10px;
}

.tag {
  background-color: rgba(133, 141, 218, 0.05);
  border-radius: 4px;
  color: #858dda;
  display: inline-block;
  font-size: 12px;
  margin: 0 20px 20px 0;
  padding: 6px 8px;
}

@media screen and (max-width: 640px) {
  .area-tags {
    margin-bottom: 0;
  }

  .tag {
    margin: 0 10px 10px 0;
  }
}
</style>
