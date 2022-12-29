<template>
    <div>
      <filter-places
        :categories="categories"
        :cities="cities"
        :openModal="openModal"
        @filter-search="onFilterSearch"
        :search="search"
        @filter-alphabet="onFilterAlphabet"
        :filterAlphabet="filterAlphabet"
        @filter-date="onFilterDate"
        :filterDate="filterDate"
        @filter-city="city = $event"
        :city="city"
        @filter-category="category = $event"
        :category="category"
        @on-submit-filter="onSubmitFilter"
        :colorCategory="colorCategory"
      />
      <b-container fluid="sm" v-if="places">
        <template v-if="places.at(0)">
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              class="mb-2"
              v-for="(place, i) in searchFilter"
              :key="i"
            >
              <card-place :place="place" v-if="!busy" />
            </el-col>
          </el-row>
        </template>
        <el-empty description="Aucun lieu trouvé" v-else></el-empty>
      </b-container>
      <slot name="loading" v-else />
    </div>
  </template>

  <script>
  import { mapGetters } from "vuex";
  import VuiSearchInput from "~/components/vui-alpha/input/VuiSearchInput";
  import CardPlace from "~/components/card/CardPlace";
  import FilterPlaces from "../components/FilterPlaces";
  import { mapActions } from "vuex";
  import {
    getDownloadURL,
    ref as storageRef,
    deleteObject,
  } from "firebase/storage";
  import { storage } from "~/plugins/firebase";

  export default {
    name: "places",
    components: {
      VuiSearchInput,
      CardPlace,
      FilterPlaces,
    },
    data() {
      return {
        search: "",
        filterAlphabet: false,
        city: null,
        category: null,
        filterDate: false,

        openModal: false,
        busy: false,
        places: null,
      };
    },

    computed: {
      ...mapGetters("app", {
        placesStore: "getPlaces",
        cities: "getCities",
        categories: "getCategories",
      }),
      searchFilter() {
        return (
          this.places &&
          this.places.filter((place) =>
            place.title.toLowerCase().includes(this.search.toLowerCase())
          )
        );
      },
      colorCategory() {
        return this.category
          ? this.categories.find((category) => category.id === this.category)
              .color
          : null;
      },
    },

    async created() {
      this.places = [...this.placesStore];
    },

    methods: {
      ...mapActions("app", ["loadPlaces"]),

      onFilterSearch(value) {
        this.search = value;
      },

      onFilterAlphabet() {
        this.filterAlphabet = !this.filterAlphabet;
        if (!this.filterAlphabet) {
          this.places.sort(function (a, b) {
            if (a.title > b.title) {
              return -1;
            }
          });
        } else if (this.filterAlphabet) {
          this.places.sort(function (a, b) {
            if (a.title < b.title) {
              return -1;
            }
          });
        }
      },

      onFilterDate() {
        this.filterDate = !this.filterDate;
        if (!this.filterDate) {
          this.places.sort(function (a, b) {
            if (a.created_at > b.created_at) {
              return -1;
            }
          });
        } else if (this.filterDate) {
          this.places.sort(function (a, b) {
            if (a.created_at < b.created_at) {
              return -1;
            }
          });
        }
      },

      onSubmitFilter() {
        this.places = [...this.placesStore];

        this.city == "" && (this.city = null);
        this.category == "" && (this.category = null);

        if (this.city) {
          this.places = this.places.filter((place) => place.city === this.city);
        }
        if (this.category) {
          this.places = this.places.filter(
            (place) => place.category === this.category
          );
        }
      },
    },
  };
  </script>

  <style lang="scss" scoped></style>
