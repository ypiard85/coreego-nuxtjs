<template>
  <div class="filter-places py-3 mb-3 shadow">
    <b-container fluid="sm">
      <span class="fw-bold mb-2">Filtres</span>

      <div class="row filter-places-more">
        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="city">
            <i class="el-icon-location-outline"></i>
          </label>
          <el-select id="city" class="w-100" filterable="filterable" name="Province" remote="remote" :value="byCity"
            @input="filterByCity" clearable="clearable" placeholder="Selectioner une province">
            <el-option v-for="city in cities" :key="city.id" :label="city.label" :value="city.id"></el-option>
          </el-select>
        </div>

        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="category">
            <i class="el-icon-folder-opened"></i>
          </label>
          <el-select id="category" class="w-100" name="Catégorie" remote="remote" :value="byCategory"
            @input="filterByCategory" filterable="filterable" clearable="clearable"
            placeholder="Selectioner une catégorie">
            <el-option v-for="category in categories" :key="category.id" :label="category.name"
              :value="category.id"></el-option>
          </el-select>
        </div>

        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="user">
            <i class="el-icon-user"></i>
          </label>
          <user-filter class="w-100" @clear-tag="userName = null" :userName="userName" @change="filterByUser" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <el-input v-model="search" @input="$emit('change-search-value', $event)" placeholder="Rechercher un lieu"
            trim="trim" clearable="clearable">
            <template #prepend>
              <el-button @click="filterByDate">
                Date
                <i :class="`el-icon-caret-${byDate ? 'bottom' : 'top' }`"></i>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </b-container>
  </div>
</template>
<script>
  import UserFilter from '~/components/filter/UserFilter'
  import { mapGetters } from 'vuex'
  import { db } from "~/plugins/firebase.js";
  import { doc, getDoc } from "firebase/firestore";

  export default {
    name: 'filter-places',
    components: {
      UserFilter,
    },

    props: {
      byDate: {
        type: Boolean,
        required: false,
        default: false,
      },
      byCity: {
        required: false,
        default: null,
      },
      byCategory: {
        required: false,
        default: null,
      },
      byUser: {
        required: false,
        default: null,
      },
    },

    data() {
      return {
        openDialog: false,

        search: '',
        dateStatus: false,

        userName: null,
      }
    },

    computed: {
      ...mapGetters('app', {
        cities: 'getCities',
        categories: 'getCategories',
        users: 'getUsers',
      }),
    },

    methods: {
      filterByDate() {
        this.$emit('filter-by-date', !this.byDate)
      },

      filterByCity($event) {
        let city = $event
        if ($event === '') {
          city = null
        }
        this.$emit('filter-by-city', city)
      },

      filterByCategory($event) {
        let category = $event
        if ($event === '') {
          category = null
        }
        this.$emit('filter-by-category', category)
      },

      async filterByUser($event) {
        if ($event) {
          let documentRef = doc(db, 'users', $event)
          let documentSnapshots = await getDoc(documentRef)
          if (documentSnapshots) {
            this.userName = documentSnapshots.data().displayName
          }
        } else {
          this.userName = $event
        }
        this.$emit('filter-by-user', $event)

      },
    },
  }
</script>

<style lang="scss" scoped="scoped">
  .filter-places {
    &-more {
      >div {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;

        i {
          font-size: 24px;
          margin-right: 10px;
        }
      }
    }
  }
</style>