<template>
  <textarea
    class="area-title"
    type="text"
    placeholder="タイトル"
    spellcheck="false"
    maxlength="255"
    :value="value"
    @input="handleInput"
    wrap="soft"
  ></textarea>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
      type: String
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-title {
  color: #040404;
  font-size: 24px;
  font-weight: bold;
  grid-area: title;
  letter-spacing: 0.1em;
  line-height: 1.5;
  border: 0;
  padding: 8px;
  margin-top: 16px;
  font-family: 'YuGothic', 'Yu Gothic';
  flex: 1;
  resize: none;

  &:placeholder-shown {
    color: #898989;
  }

  &:focus {
    outline: 0;
  }
}
</style>
