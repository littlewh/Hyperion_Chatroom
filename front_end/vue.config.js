const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

// cdn链接
const cdn = {

  js: [
    // vue
    'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js',
    // vue-router
    'https://cdn.bootcdn.net/ajax/libs/vue-router/3.1.3/vue-router.min.js',
    // vuex
    'https://cdn.bootcdn.net/ajax/libs/vuex/3.1.2/vuex.min.js',
    // axios
    'https://cdn.bootcdn.net/ajax/libs/axios/0.18.0/axios.min.js',
    // moment
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.min.js',
    // lodash
    'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js',
  ],
};

const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  chainWebpack: (config) => {
    // eslint-disable-next-line global-require
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);

    // cdn引入
    if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_CDN === 'true') {
      const externals = {
        vue: 'Vue',
        axios: 'axios',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        moment: 'moment',
        lodash: '_',
      };
      config.externals(externals);
      // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
      config.plugin('html').tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].cdn = cdn;
        return args;
      });
    }
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#09b955',
            // 'link-color': '#1DA57A',
            // 'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
      sass: {
        prependData: "@import '@/styles/index.scss';",
      },
    },
  },
  // webSocket本身不存在跨域问题，所以我们可以利用webSocket来进行非同源之间的通信。
  publicPath: './',
  devServer: {
    port: 1997,
  },
  productionSourceMap: false,
};
