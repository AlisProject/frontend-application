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
  }
}
