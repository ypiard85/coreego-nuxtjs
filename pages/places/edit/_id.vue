<template>
  <div>
    <!-- <Header title="Editer un lieu" icon="pencil" /> -->
    <form-place :isEditMode="true" :place="place" v-if="!isBusy" />
  </div>
</template>
<script>
//   import Header from "~/components/Header";
import FormPlace from './../../components/FormPlace'
import { auth } from '~/plugins/firebase'
import { mapGetters, mapActions } from 'vuex'
import Middleware from '~/pages/components/Middleware'

export default {
  name: 'placeEdit',
  // middleware: 'authenticated',
  components: { FormPlace, Middleware },

  data() {
    return {
      place: null,
      isBusy: false,
    }
  },

  async created() {
    await this.loadCurrentPlace()
  },

  methods: {
    async loadCurrentPlace() {
      try {
        this.isBusy = true
        const documentRef = await this.$fire.firestore
          .collection('lieux')
          .doc(this.$route.params.id)
          .get()

        if (documentRef) {
          this.place = documentRef.data()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isBusy = false
      }
    },
  },
}
</script>
<style lang="scss" scoped></style>
