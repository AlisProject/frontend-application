<template>
  <div class="form-group">
    <label class="label">{{ label }}</label>
    <input
      class="input"
      :class="{ error: hasError }"
      v-bind="inputAttrs"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
    <p v-if="hasError" class="error-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    },
    inputAttrs: {
      type: Object
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e)
    },
    handleBlur(e) {
      this.$emit('blur', e)
    },
    handleFocus(e) {
      this.$emit('focus', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  position: relative;
}

.label {
  color: #030303;
  font-size: 14px;
  line-height: 2.4;
}

.input {
  appearance: none;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  border: none;
  border-radius: 0;
  box-sizing: border-box;
  margin-bottom: 40px;
  padding: 12px;
  width: 100%;

  &::-webkit-input-placeholder {
    padding: 3px;
    color: #cecece;
    font-size: 14px;
    letter-spacing: 0.05em;
  }

  &:focus {
    outline: 0;
  }

  &.error {
    box-shadow: 0 0 8px 0 rgba(240, 98, 115, 0.5);
  }
}

.error-message {
  bottom: 20px;
  margin: 0;
  color: #f06273;
  font-size: 12px;
  position: absolute;
  width: 100%;
  text-align: right;
}

/* for SignUpModalForm */
.user-id-form {
  .input {
    margin-bottom: 60px;
  }
}
</style>
