<template>
  <div class="article-type-select-box">
    <select required class="article-type-select" :value="value" @change="handleChangeTopicType">
      <option value='' disabled selected class="placeholder">選択してください</option>
      <option v-for="topic in topics" :key="topic.name" :value="topic.name">
        {{ topic.display_name }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    topics: {
      type: Array,
      required: true,
      default: [],
      validator(list) {
        return list.every(({ name, display_name: displayName }) => name && displayName)
      }
    },
    value: {
      type: String,
      required: false
    }
  },
  methods: {
    handleChangeTopicType({ target: { value } }) {
      this.$emit('change', this.topics.find((topic) => topic.name === value))
    }
  }
}
</script>

<style lang="scss" scoped>
.article-type-select-box {
  border-bottom: 1px dotted #232538;
  margin-bottom: 40px;
  padding: 6px 1px;
  position: relative;

  &::after,
  &::before {
    position: absolute;
    right: 0;
    width: 0;
    height: 0;
    padding: 0;
    content: '';
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    pointer-events: none;
  }

  &::after {
    top: 7px;
    border-bottom: 8px solid rgb(80, 81, 96);
  }

  &::before {
    top: 17px;
    border-top: 8px solid rgb(80, 81, 96);
  }

  .article-type-select {
    appearance: none;
    background-image: none;
    background: transparent;
    border: none;
    box-shadow: none;
    color: #cecece;
    cursor: pointer;
    font-size: 14px;
    outline: none;
    padding-right: 1em;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    width: 100%;

    .placeholder {
      display: none;
    }

    &::-ms-expand {
      display: none;
    }
  }
}

@-moz-document url-prefix() {
  .article-type-select-box {
    &::after {
      top: 15px !important;
    }

    &::before {
      top: 25px !important;
    }
  }
}
</style>
