<template>
  <nuxt-link v-if="user" class="d-inline-flex align-items-center" :to="`/profil/view/${user.uid}`"
    :class="{'pe-none' : !link }"
  >
    <el-avatar
    :src="user.photoURL"
    class="me-3"
    ></el-avatar>
    <span class="fw-bold text-blue">{{ user.displayName }}</span>
  </nuxt-link>
  <el-skeleton variant="circle" :rows="1" v-else />
</template>

<script>
import { db } from '~/plugins/firebase'
import {
  doc,
  getDoc
} from 'firebase/firestore'
  export default{
  methods: {
  },
    name: 'VuiUser',

    props:{
      userUid:{
        type: String,
        required: false,
      },
      link:{
        type: Boolean,
        required: false,
        default: false,
      }
    },


   data(){
      return{
         user: null
      }
   },

   async mounted(){
      await this.getUser()
   },

   methods:{
      async getUser() {
      let userReference = doc(db, 'users', this.userUid)
      let userDocument = await getDoc(userReference)
      if(userReference){
         this.user = userDocument.data()
      }
    },
   }

  }
</script>

<style lang="scss" scoped>

</style>