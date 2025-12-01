const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          }
        }
      }
    }
  },
  
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'TaskMaster - Aplikasi Manajemen Tugas'
      args[0].meta = {
        description: 'Aplikasi manajemen tugas sederhana dan powerful dengan kategori dan statistik',
        keywords: 'task manager, todo list, productivity, vue.js'
      }
      return args
    })
  }
})