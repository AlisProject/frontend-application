module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^~/(.*)$': '<rootDir>/app/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,vue}',
    '!./tests/**',
    '!app/layouts/error.vue',
    '!**/node_modules/**'
  ]
}
