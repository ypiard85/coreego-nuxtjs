<template>
  <div>
    <loading-page v-if="isLoading" />
    <navigation-bar :user="user" />
    <Nuxt class="mb-4" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NavigationBar from '~/pages/components/NavigationBar'
import LoadingPage from '~/pages/components/LoadingPage'

export default {
  name: 'layout',
  components: { NavigationBar, LoadingPage },

  data() {
    return {
      isLoading: false,
      user: null,
    }
  },

  async created() {
        this.$router.app.$on('viewLoading', (value) => {
      this.isLoading = value
    })
    await this.initApp()

    await this.$fire.auth.onAuthStateChanged(() => {
      this.user = this.$fire.auth.currentUser
      if (this.user) {
        console.log('user logged')
        this.setIsLogged(true)
        this.setUserLogged(this.user)
      } else {
        console.log('user unlogged')
        this.setIsLogged(false)
        this.setUserLogged(null)
      }
    })
  },

  computed: {
    ...mapGetters('auth', { userLogged: 'getUserLogged' }),
  },

  methods: {
    ...mapActions('auth', ['setIsLogged', 'setUserLogged']),
    ...mapActions('app', ['loadCities', 'loadCategories']),

    async initApp() {
      try {
        this.isLoading = true
        await Promise.all([this.loadCities(), this.loadCategories()])
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },
  //mixin dans main.js
}
</script>

<style scoped lang="scss"></style>
