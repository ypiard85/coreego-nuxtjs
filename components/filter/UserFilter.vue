<template>
  <el-select
    ref="input-search"
    id="user"
    no-data-text="Aucun utilisateur trouvé"
    v-model="value"
    @clear="options = []"
    @change="$emit('change', $event)"
    clearable="clearable"
    filterable="filterable"
    remote="remote"
    reserve-keyword="reserve-keyword"
    placeholder="Selectionner un utilisateur"
    :remote-method="remoteMethod"
    :loading="loading"
  >
    <el-option
      style="height: 100%"
      class="filter_user_option"
      v-for="user in options"
      :key="user.uid"
      :label="user.displayName"
      :value="user.uid"
    >
      <el-avatar :src="user.photoURL" class="me-3" />
      <span>{{ user.displayName }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from '~/plugins/firebase.js'
import { collection, getDocs, query, where } from 'firebase/firestore'
export default {
  name: 'userFilter',

  props: {},

  data() {
    return {
      options: [],
      list: [],
      value: null,
      loading: false,
    }
  },

  computed: {
    ...mapGetters('app', { filters: 'getFilters' }),
  },

  async created() {
    await this.getUserDisplayName()
  },

  methods: {
    async getUserDisplayName() {
      if (this.filters && this.filters.user) {
        const userDocumentRef = await this.$fire.firestore
          .collection('users')
          .doc(this.filters.user)
          .get()
        if (userDocumentRef.exists) {
          this.value = userDocumentRef.data().displayName
        }
      }
    },

    async remoteMethod(searchQuery) {
      if (searchQuery !== '') {
        this.loading = true
        setTimeout(async () => {
          this.loading = false

          let documentRef = query(collection(db, 'users'))
          let documentSnapshots = await getDocs(documentRef)
          this.options = documentSnapshots.docs
            .filter((doc) =>
              doc
                .data()
                .displayName.toLowerCase()
                .split(' ')
                .includes(searchQuery.toLowerCase().trim())
            )
            .map((doc) => {
              return doc.data()
            })

          // this.list.filter((item) => {
          //   return (
          //     item.displayName.toLowerCase().indexOf(query.toLowerCase()) > -1
          //   )
          // })
        }, 200)
      } else {
        this.options = []
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.filter_user_option {
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
}
</style>
