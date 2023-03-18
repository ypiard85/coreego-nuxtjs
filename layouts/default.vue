<template>
  <div>
    <template v-if="!busy">
      <navigation-bar :user="currentUser" />
      <Nuxt class="mb-4" />
    </template>
    <loading-page v-else />
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
      busy: false
    }
  },

  async created() {
    await this.initApp()
    if (this.currentUser) {
      this.setIsLogged(true)
      this.setUserLogged(this.currentUser.toJSON())
    } else {
      this.setIsLogged(false)
      this.setUserLogged(null)
    }
  },

  computed: {
    ...mapGetters('auth', {userLogged: 'getUserLogged'} ),

    currentUser() {
      return this.$fire.auth.currentUser ? this.$fire.auth.currentUser : null
    },
  },

  methods: {
    ...mapActions('auth', ['setIsLogged', 'setUserLogged']),
    ...mapActions('app', ['loadCities', 'loadCategories']),

    async initApp() {
      try {
        this.busy = true
        await Promise.all([this.loadCities(), this.loadCategories()])
      } catch (error) {
        console.log(error)
      } finally {
        this.busy = false
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
