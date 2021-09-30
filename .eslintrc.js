module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  plugins: ['prettier'],
  extends: [
    'standard',
    // resolve conflicts between prettier and eslint
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {}
}
