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
  import { onAuthStateChanged } from '@firebase/auth'
  import { auth, db } from '~/plugins/firebase'
  import { doc, setDoc, getDoc } from 'firebase/firestore'
  import { mapActions, mapGetters } from 'vuex'
  import NavigationBar from '~/pages/components/NavigationBar'
  import LoadingPage from '~/pages/components/LoadingPage'
  export default {
    name: "layout",
    components: { NavigationBar, LoadingPage },

    data() {
      return {
        busy: false
      }
    },

    async created() {
      onAuthStateChanged(auth, (user) => {
        //notif test
        if (user) {
          console.log(user)
          setDoc(doc(db, 'users', user.uid), {
            ...user.reloadUserInfo,
            providerUserInfo: user.reloadUserInfo.providerUserInfo[0],
          })
          this.setIsLogged(true)
        } else {
          console.log('PAS USER')
        }
      })
      await this.loadApp()
    },

    computed: {

      currentUser() {
        return auth && auth.currentUser
      },
    },

    methods: {
      ...mapActions('auth', ['logout', 'setIsLogged']),
      ...mapActions('app', [
        'loadCities',
        'loadCategories',
        'loadCarnet',
        'loadUsers',
        'loadPlaces',
      ]),

      async loadApp() {
        try {
          this.busy = true
          await Promise.all([
            this.loadCities(),
            this.loadCategories(),
            this.loadUsers(),
            this.loadPlaces(),
          ])
          if (this.currentUser) {
            await this.loadCarnet(this.currentUser.uid)
          }
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