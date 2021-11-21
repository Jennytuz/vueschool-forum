module.export = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  "parserOptions": {
    "parser": "@babel/eslint-parser",
    "sourceType": "module",
    "ecmaVersion": 6,
  },
  "rules": {
    "no-unused-vars": process.env.NODE_ENV === 'production'? 'error': 'warn'
  }
}