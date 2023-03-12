<template>
  <b-container class="d-flex align-items-center justify-content-center mt-5">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>Connexion</span>
      </div>
      <div class="card_button">
        <el-alert v-if="errorAuth">{{ errorAuth }}</el-alert>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" class="my-2">
            <el-button @click="handleGoogleLogin" class="w-100" type="danger"
              >Se connecter avec google</el-button
            >
          </el-col>
          <el-col :xs="24" :sm="12" class="my-2">
            <el-button
              @click="handleFacebookLogin"
              class="ms-0 w-100"
              type="primary"
            >
              Se connecter avec Facebook</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  doc,
  setDoc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  GeoPoint,
  updateDoc,
} from 'firebase/firestore'

export default {
  components: {},

  computed: {
    ...mapGetters('auth', { errorAuth: 'getErrorMessage' }),
  },

  methods: {
    ...mapActions('auth', {
      googleAuth: 'connectWithGoogle',
      facebookAuth: 'connectWithFacebook',
    }),

    async handleGoogleLogin() {
      try {
        var provider = new this.$fireModule.auth.GoogleAuthProvider()
        const authCurrent = await this.$fire.auth.signInWithPopup(provider)

        let userReference = this.$fire.firestore
          .collection('users')
          .doc(authCurrent.user.uid)

        const user = authCurrent.user.toJSON()

        await userReference.set({
          ...user,
          phoneNumber: user.phoneNumber ? user.phoneNumber : null,
          tenantId: user.tenantId ? user.tenantId : null,
          _redirectEventId :  null,
          providerUserInfo: user.providerData[0],
        })
        window.location.href = '/'
      } catch (error) {
        console.log(error)
      }
    },

    async handleFacebookLogin() {
      var provider = new this.$fireModule.auth.FacebookAuthProvider()
      const authCurrent = await this.$fire.auth.signInWithPopup(provider)

       let userReference = this.$fire.firestore
          .collection('users')
          .doc(authCurrent.user.uid)

        const user = authCurrent.user.toJSON()

        await userReference.set({
          ...user,
          phoneNumber: user.phoneNumber ? user.phoneNumber : null,
          tenantId: user.tenantId ? user.tenantId : null,
          _redirectEventId :  null,
          providerUserInfo: user.providerData[0],
        })
      window.location.href = '/'
    },
  },
}
</script>

<style lang="scss" scoped>
.card-header {
  background-color: $blue-principal !important;
}

.box-card {
  width: 500px;
  max-width: 100%;
}
</style>
