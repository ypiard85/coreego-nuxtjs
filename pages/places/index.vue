<template>
  <div>
    <!-- Filtre -->
    <filter-places
      v-if="filter"
      @change-search-value="search = $event"
      @change-text-status="onChangeTextStatus"
      @change-date-status="onChangeDateStatus"
      @change-city="city = $event, onSubmitFilter()"
      @change-category="category = $event, onSubmitFilter()"
      @change-user-value="user = $event, onSubmitFilter()"
      />
    <!-- Conent -->
    <b-container fluid="sm" v-if="places">
      <template v-if="searchFilter.length > 0">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" class="mb-2" v-for="(place, i) in searchFilter" :key="i">
            <card-place :place="place" />
          </el-col>
        </el-row>
      </template>
      <el-empty description="Aucun lieu trouvé" v-else="v-else"></el-empty>
    </b-container>
    <slot name="loading" v-else="v-else" />
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import VuiSearchInput from "~/components/vui-alpha/input/VuiSearchInput";
  import CardPlace from "~/components/card/CardPlace";
  import FilterPlaces from "../components/FilterPlaces";
  import { mapActions } from "vuex";
  import { getDownloadURL, ref as storageRef, deleteObject } from "firebase/storage";
  import { storage } from "~/plugins/firebase";

  export default {
    name: "places",

    props:{
      filter:{
        type: Boolean,
        required: false,
        default: true
      }
    },

    components: {
      VuiSearchInput,
      CardPlace,
      FilterPlaces
    },
    data() {
      return {
        search: "",
        city: null,
        category: null,

        user: null,

        loadingUser: false,

        openModal: false,
        busy: false,
        places: null
      };
    },

    computed: {
      ...mapGetters("app", {
        placesStore: "getPlaces",
        cities: "getCities",
        categories: "getCategories",
        usersStore: 'getUsers'
      }),

      searchFilter() {
        return this.places && this.places.filter((place) => place.title.toLowerCase().includes(this.search.toLowerCase()))
      },

      colorCategory() {
        return this.category ? this.categories.find((category) => category.id === this.category).color : null;
      }
    },

    async created() {
      this.places = [...this.placesStore];
    },

    methods: {
      ...mapActions("app", ["loadPlaces"]),

      onChangeTextStatus(value) {
        if (!value) {
          this.places.sort(function (a, b) {
            if (a.title > b.title) {
              return -1;
            }
          });
        } else if (value) {
          this.places.sort(function (a, b) {
            if (a.title < b.title) {
              return -1;
            }
          });
        }
      },

      onChangeDateStatus(value) {
        if (!value) {
          this.places.sort(function (a, b) {
            if (a.created_at > b.created_at) {
              return -1;
            }
          });
        } else if (value) {
          this.places.sort(function (a, b) {
            if (a.created_at < b.created_at) {
              return -1;
            }
          });
        }
      },

      onSubmitFilter() {
        this.places = [...this.placesStore];

        if (this.city) {
          this.places = this.places.filter((place) => place.city === this.city)
        }

        if (this.category) {
          this.places = this.places.filter((place) => place.category === this.category);
        }

        if(this.user){
          this.places = this.places.filter((place) => place.user.localId === this.user);
        }

      }
    }
  };
</script>

<style lang="scss" scoped="scoped"></style>