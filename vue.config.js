const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/pld-progression-grouper/" : "/",
  pwa: {
    name: 'PLD-Progression Grouper',
    short_name: 'PLD-PG',
    start_url: './',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    themeColor: '#00bf7d',
  }
})
