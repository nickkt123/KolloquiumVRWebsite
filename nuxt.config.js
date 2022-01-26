export default {
  // Nuxt target see https://nuxtjs.org/api/configuration-target
  target: 'server',

// Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'KolloquiumVR',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

// Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http',
    [
      "@nuxtjs/axios",
      {
        baseURL: process.env.BASE_URL || "http://localhost:3000"
      }
    ]
  ],

  /*
  ** For deployment you might want to edit host and port
  */
  // server: {
  //  port: 8000, // default: 3000
  //  host: '0.0.0.0' // default: localhost
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  
  
  // Server Middleware
  serverMiddleware: {
    '/api': '~/api'
  },
}
  