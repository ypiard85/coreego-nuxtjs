<template>
  <div>
    <template v-if="!busy">
      <navigation-bar :user="currentUser" />
      <Nuxt />
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
  components: { NavigationBar, LoadingPage },

  data(){
    return{
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
    ...mapActions('auth', ['logout']),
    // ...mapActions("place", ["loadPlaces","loadCities", "loadCategories"]),
    ...mapActions('app', [
      'loadCities',
      'loadCategories',
      'loadUsers',
      'loadPlaces',
      'loadCarnet',
    ]),

    async loadApp() {
      this.busy = true
      await Promise.all([
        this.loadCities(),
        this.loadCategories(),
        this.loadUsers(),
        this.loadPlaces(),
        this.loadCarnet(),
      ])
        .then(() => {
          this.busy = false
        })
        .catch((e) => console.log(e))
    },
  },
}
</script>

<style scoped lang="scss"></style>
