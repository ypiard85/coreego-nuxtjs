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
  import { mapActions, mapGetters } from 'vuex'
  import NavigationBar from '~/pages/components/NavigationBar'
  import LoadingPage from '~/pages/components/LoadingPage'

  import {
    doc,
    setDoc,
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    GeoPoint,
    updateDoc,
  } from "firebase/firestore";

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
      await this.initApp()
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

        try {
          this.busy = true

          const doccumentRef = collection(db, 'lieux')

          let documentSnapshots = await getDocs(doccumentRef);
          console.log(documentSnapshots.docs.length)
          for (let i = 0; i < 30; i++) {
            let randomCategory = Math.floor(Math.random() * 6) + 1
            let randomCity = Math.floor(Math.random() * 10) + 1

            // await deleteDoc(doc(db, 'lieux', documentSnapshots.docs[i].id ))

            // await addDoc(collection(db, "lieux"), {
            //   category: randomCategory,
            //   city: randomCity,
            //   created_at: new Date(),
            //   updated_at: new Date(),
            //   user: this.currentUser.uid,
            //   description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            //   geopoint: new GeoPoint('37.514677', '126.952704'),
            //   images: [
            //     {
            //       name: 'image1',
            //       url: "https://fakeimg.pl/1200x500/?text=World&font=lobster",
            //     },
            //     {
            //       name: 'image2',
            //       url: "https://fakeimg.pl/1200x500/?text=World&font&secondimage=lobster",
            //     },
            //     {
            //       name: 'image3',
            //       url: "https://fakeimg.pl/1200x500/?text=World&font&firthimage=lobster",
            //     },
            //   ],
            //   premium: false,
            //   status: false,
            //   thumbnail: {
            //     name: 'image1',
            //     url: "https://fakeimg.pl/1200x500/?text=World&font=lobster",
            //   },
            //   title: 'Titre numéro - ' + i ,

            // })


            i++
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