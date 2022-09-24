module.exports = {
    // publicPath: process.env.NODE_ENV === PRODUCTION ? PROD_PATH : DEV_PATH,
    chainWebpack: config => {
        // 让 babel 转码一些最新的 js API
        // config.entry('main').add('babel-polyfill')
        config.module
            .rule('image')
            .test(/\.ico$/)
            .use('url-loader')
            .loader('url-loader')
    },
    css: {
        sourceMap: true
    },
    // 不需要生产环境的 source map
    // productionSourceMap: false,
    // 开发环境下的服务端配置
    devServer: {
        proxy: 'http://http://10.112.224.111:8900/',
    },
}
