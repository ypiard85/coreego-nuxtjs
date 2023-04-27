<template>
  <div class="drawer-topic">
    Ajout d'un topic
    <div class="d-flex">
      <el-input v-model="searchQuery" />
      <el-button @click="handleSearch">Rechercher</el-button>
    </div>
    <ul>
      <li
        v-for="(topic, index) in query"
        :key="index"
        :class="{
          'bg-info':
            selectTopic && topic.address_name === selectTopic.address_name,
        }"
      >
        {{ topic.address_name }}
        <div>
          <el-button @click="$emit('marker-target', topic)">Select</el-button>
          <el-button  @click="$emit('street-view-target', topic)"
            >StreetView</el-button
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { querySearch } from '@/utils/app.js'
export default {
  name: 'drawer-topic-add',

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
  &__diapo {
    height: 200px;
    width: 100%;
    .el-image {
      height: 100%;
      width: 100%;
      img {
        object-position: center;
      }
    }
  }
}
</style>
