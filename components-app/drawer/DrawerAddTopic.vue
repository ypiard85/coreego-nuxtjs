<template>
  <div class="drawer-topic">
    <div class="drawer-topic-title">
      <h3 class="text-center m-0 text-white py-3">Ajouter un topic</h3>
    </div>
    <div class="d-flex drawer-topic-input-search">
      <el-input placeholder="Addresse, nom lieu..." v-model="searchQuery" />
      <el-button @click="handleSearch" icon="el-icon-search"></el-button>
    </div>
    <div class="drawer-topic-content">
      <div>
        <drawer-card
          v-for="(topic, index) in query"
          :key="index"
          :topic="topic"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { querySearch } from '@/utils/app.js'
import DrawerCard from './DrawerCard.vue'
export default {
  name: 'drawer-add-topic',

  components: { DrawerCard },

  props: {
    selectTopic: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      searchQuery: '충청북도 충주시 신니면 송암리 584-1번지',
      query: [],
    }
  },

  mounted() {},

  methods: {
    async handleSearch() {
      if (!this.searchQuery.replace(/^\s+|\s+$/g, '')) {
        console.log('message erreur')
        return false
      }
      // Kakao Maps API loaded
      // Use the `places` object here
      let ps = new kakao.maps.services.Places()
      console.log(ps)
      await ps.keywordSearch(this.searchQuery, this.placesSearchCB)
    },

    placesSearchCB(data, status, pagination) {
      const result = querySearch(data, status, pagination)
      if (result) {
        this.query = result
        this.$emit('query-result', this.query)
      }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .drawer-topic {
  &-title {
    h3 {
      background: $blue-principal;
    }
  }
  &-input-search {
    .el-button,
    .el-input__inner {
      border-radius: 0px;
    }
  }
  &-content {
    height: 500px;
    overflow-y: scroll;
    > div {
      height: 100%;
    }
  }
}
</style>
