<template>
  <button class="create-new-article-button" @click="callback($event)">
    記事作成
  </button>
</template>

<script>
export default {
  methods: {
    callback(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.create-new-article-button {
  appearance: none;
  background: #0086cc url('~assets/images/pc/common/icon_writing.png') no-repeat;
  background-position-x: 20px;
  background-position-y: 10px;
  background-size: 24px;
  border-radius: 50%;
  border: none;
  box-shadow: 0 1px 16px 0 rgba(0, 134, 204, 0.5);
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  height: 64px;
  letter-spacing: 0.5px;
  outline: none;
  padding-top: 28px;
  width: 64px;
}
</style>
