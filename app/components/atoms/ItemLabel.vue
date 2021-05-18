<template>
  <div class="label-area">
    <div class="label">
      {{ labelName }}
    </div>
    <nuxt-link v-if="addLink !== null" :to="addLink" class="more-link-pc">
      {{ addText }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    labelName: String,
    addLink: String,
    addText: String
  }
}
</script>

<style lang="scss" scoped>
.label-area {
  border-bottom: 1px solid rgba(#cecece, 0.3);
  display: flex;
  justify-content: space-between;
}
.label {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #6e6e6e;
}
.more-link-pc {
  color: #6e6e6e;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
}
</style>
