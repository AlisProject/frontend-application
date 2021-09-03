module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^~/(.*)$': '<rootDir>/app/$1'
  },
  collectCoverageFrom: [
    'app/**/*.{js,vue}',
    '!./tests/**',
    '!app/layouts/error.vue',
    '!**/node_modules/**',
    '!**/.nuxt/**'
  ],
  testEnvironment: 'jsdom'
}
