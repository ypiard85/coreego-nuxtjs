import path from 'path'
import fs from 'fs'
require('dotenv').config()

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode

  //Envoyer des notifications
  // https://yuhanna.medium.com/how-to-add-push-notification-to-your-nuxt-js-web-app-using-firebase-abf12f19a67b
  ssr: false,

  meta: { layout: 'layoutApp' },

  store: '~/store/authentification.store.js',

  env:{
    NODE_ENV: process.env.NODE_ENV,
    KAKAO_API_KEY: process.env.KAKAO_API_KEY,
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY
  },

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
    },
    port: 8000, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false,
  },

  serverMiddleware: {
    '/api': '~/api',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  //https://nuxtjs.org/docs/features/meta-tags-seo/
  head: {
    title: 'coreego-nuxtjs-vuejs',
    script: [
      {
        src: `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}`,
      },
      { src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js' },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=yes' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css'],

  styleResources: {
    scss: ['./css/variables.scss', './css/style.scss'],
    hoistUseStatements: true,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/element-ui.js' },
    { src: '~/plugins/firebase.js' },
    { src: '~/plugins/bootstrap-vue.js', mode: 'client' },
  ],

  auth: {
    persistence: 'local', // default
    initialize: {
      onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
      onAuthStateChangedAction: 'onAuthStateChangedAction',
      subscribeManually: true,
    },
    ssr: false, // default
    emulatorPort: process.env.NODE_ENV === 'development' ? 8000 : undefined,
    emulatorHost: 'localhost',
  },

  firestore: {
    memoryOnly: false, // default
    chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
    enablePersistence: true,
    emulatorPort: 8000,
    emulatorHost: 'localhost',
    settings: {
      // Firestore Settings - currently only works in SPA mode
    },
    enablePersistence: {
      synchronizeTabs: true
    }
  },

  storage: true,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/style-resources'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    'nuxt-sass-resources-loader',
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyBpuxuwhUGwVjuQZwZwkekjE2hDqRNqhas',
          authDomain: 'coreego-35f6d.firebaseapp.com',
          projectId: 'coreego-35f6d',
          storageBucket: 'coreego-35f6d.appspot.com',
          messagingSenderId: '103070451813',
          appId: '1:103070451813:web:70e2cde72ca106cd0ede8c',
          measurementId: 'G-TVMSF7H7NP',
        },
        services: {
          auth: true,
          firestore: true,
          storage: true,
        },
      },
    ],
  ],

  bootstrapVue: {
    bootstrapCSS: true, // Or `css: false`
    bootstrapVueCSS: true, // Or `bvCSS: false`
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'fr',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['element-ui'],
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(css|js)$/,
        loader: 'file-loader',
        include: path.resolve(__dirname, 'css/swiper'),
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
  },

  render: {
    bundleRenderer: {
      runInNewContext: false,
    },
  },
}
