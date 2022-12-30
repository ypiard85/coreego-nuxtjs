export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  meta: {"layout":"layoutApp"},

  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  //https://nuxtjs.org/docs/features/meta-tags-seo/
  head: {
    title: 'coreego-nuxtjs-vuejs',
    script:[ {src: 'http://dapi.kakao.com/v2/maps/sdk.js?appkey=138cf5e41b9fe087d4b159aae861026b'}],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=yes' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },


  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [ 'element-ui/lib/theme-chalk/index.css'],

  styleResources: {
    scss:[
      './css/variables.scss',
      './css/style.scss',
    ],
    hoistUseStatements: true
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/element-ui.js'},
    {src: '~/plugins/firebase.js'},

  ],

  auth: {
    persistence: 'local', // default
    initialize: {
      onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
      onAuthStateChangedAction: 'onAuthStateChangedAction',
      subscribeManually: false
    },
    ssr: false, // default
    emulatorPort: process.env.NODE_ENV === 'development' ? 8000 : undefined,
    emulatorHost: 'http://192.168.1.29',
  },

  firestore: {
    memoryOnly: false, // default
    chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]', // default
    enablePersistence: true,
    emulatorPort: 8000,
    emulatorHost: 'http://192.168.1.29',
    settings: {
      // Firestore Settings - currently only works in SPA mode
    }
  },

  storage: true,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/style-resources',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    'nuxt-sass-resources-loader',
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  modules: ['bootstrap-vue/nuxt'],

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
    vendor: ['element-ui']
  },


  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },

}
