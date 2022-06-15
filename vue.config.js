const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  pwa: {
    name: 'MTLKMS',
    themeColor: '#ff907f'
  }
})
