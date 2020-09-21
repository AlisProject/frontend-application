module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  plugins: [
    '@babel'
  ],
  extends: '@nuxtjs',
  // add your custom rules here
  rules: {
    'arrow-parens': 'off',
    'no-console': 'off',
    'no-irregular-whitespace': 'off',
    'prefer-promise-reject-errors': 'off',
    'require-await': 'off',
    'space-before-function-paren': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-unused-component': 'off',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-v-for-key': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/valid-v-for': 'off'
  },
  globals: {
    describe: true,
    test: true,
    expect: true,
    beforeEach: true,
    afterEach: true,
    jest: true
  }
}
