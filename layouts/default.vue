<template>
  <div>
    <template v-if="!busy">
      <navigation-bar :user="currentUser" />
      <Nuxt class="mb-4">
        <template #loading>
          <loading-page />
        </template>
      </Nuxt>
    </template>
    <loading-page v-else />
  </div>
</template>

<script>
  import { auth } from '~/plugins/firebase'
  import { mapActions, mapGetters } from 'vuex'
  import NavigationBar from '~/pages/components/NavigationBar'
  import LoadingPage from '~/pages/components/LoadingPage'


  export default {
    name: "layout",
    components: { NavigationBar, LoadingPage },

    data() {
      const store = this.$store
      return {
        busy: false
      }
    },

    async created() {
      await this.initApp()
    },

    computed: {

      currentUser() {
        return auth && auth.currentUser
      },
    },

    methods: {
      // ...mapActions('auth', ['logout', 'setIsLogged']),
      ...mapActions('app', [
        'loadCities',
        'loadCategories'
      ]),

      async initApp() {
        try {
          this.busy = true
          await Promise.all([
            this.loadCities(),
            this.loadCategories()
          ])
          // if (this.currentUser) {
          //   await this.loadCarnet(this.currentUser.uid)
          // }
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