<template>
  <div>
    <localisation-buttons
      class="mb-3"
      :localisation="localisation"
      :isBusyBtn="isBusyBtn"
      :localisationSearch="localisationSearch"
      @load-localisation="localisationSearch = $event"
    />
    <el-autocomplete
      id="localisation"
      ref="localisationSearch-input"
      class="w-100"
      v-model="localisationSearch"
      :fetch-suggestions="querySearchAsync"
      placeholder="Thurday party hongdae"
      @input="handleResetLocalisation"
      @select="handleSelectLocalisation"
    >
    </el-autocomplete>
  </div>
</template>

<script>
import LocalisationButtons from './_LocalisationButtons.vue'
import Axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'localisation-input',

  props: {
    localisation:{
      type: Object,
      require: false,
      default: () => {}
    },
    isEditMode: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  components: { LocalisationButtons },

  data() {
    return {
      isBusyBtn: false,
      localisationSearch: '',
      timeout: null,
    }
  },

  computed: {
    ...mapGetters('app', { cities: 'getCities' }),
  },

  methods: {
    async querySearchAsync(queryString, cb) {
      if (queryString.length > 5) {
        this.isBusyBtn = true
        await Axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
          headers: {
            Host: 'dapi.kakao.com',
            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
          },
          params: {
            query: queryString,
          },
        })
          .then((response) => {
            console.log(response)
            let result = response.data.documents.map((document) => {
              return {
                value: document.address_name,
                longitude: document.x,
                latitude: document.y,
                displayRoadView: document.road_address ? true : false
              }
            })
            cb(result)
            clearTimeout(this.timeout)
          })
          .catch().finally(() => {
            this.isBusyBtn = false
          })

      }
    },

    handleResetLocalisation() {
      this.$emit('update-localisation', {
        value: '',
        longitude: '',
        latitude: '',
        displayRoadView: false
      } )
    },

    handleSelectLocalisation(item) {
      this.$emit('update-localisation', item)
    },
  },
}
</script>

<style scoped lang="scss"></style>
