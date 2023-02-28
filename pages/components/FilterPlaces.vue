<template>
  <div class="filter-places py-3 mb-3 bg-light">
    <b-container fluid="sm">
      <p class="fw-bold">Filtres</p>

      <search-filter v-model="search" @input="$emit('change-search-value', $event)" />

      <section class="mt-3">
        <toogle-filter
          :value="byAlphabet"
          :label="byAlphabet ? 'Z - A' : 'A - Z' "
          @click="filterByAlphabet"
        />
        <toogle-filter
          :value="byDate"
          :label="byDate ? 'Du plus anciens' : 'Du plus résents' "
          @click="filterByDate"
        />
        <el-button size="small" icon="el-icon-s-operation" @click="openDialog = true">Filtre avancé</el-button>
        <ul class="p-0 mt-3 d-flex" v-if="showArianeFilter">
          <li>
            <el-tag
              closable
              type="success"
              v-if="cityName"
              @close="$emit('filter-by-city', null)"
            >{{cityName}}</el-tag>
          </li>
          <li>
            <el-tag
              closable
              v-if="categoryName"
              @close="$emit('filter-by-category', null)"
            >{{categoryName}}</el-tag>
          </li>
          <li>
            <el-tag
              closable
              type="danger"
              v-if="userName"
              @close="$emit('filter-by-user', null), userName = null"
            >{{userName}}</el-tag>
          </li>
        </ul>
      </section>

      <template v-if="openDialog">
        <el-dialog
          title="Filtre avancé"
          :visible="openDialog"
          class="filter-places__dialog"
          top="5vh"
          @close="openDialog = false"
          :destroy-on-close="true"
          :append-to-body="true"
        >
          <section>
            <el-form label-position="top">
              <el-form-item label="Province" class="w-100">
                <el-select
                  name="Province"
                  remote="remote"
                  :value="byCity"
                  class="w-100"
                  @input="filterByCity"
                  clearable="clearable"
                  placeholder="Selectioner une province"
                >
                  <el-option
                    v-for="city in cities"
                    :key="city.id"
                    :label="city.label"
                    :value="city.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Catégorie" class="w-100">
                <div class="d-flex align-items-center">
                  <el-select
                    name="Catégorie"
                    class="w-100"
                    remote="remote"
                    :value="byCategory"
                    @input="filterByCategory"
                    clearable="clearable"
                    placeholder="Selectioner une catégorie"
                  >
                    <el-option
                      v-for="category in categories"
                      :key="category.id"
                      :label="category.name"
                      :value="category.id"
                    ></el-option>
                  </el-select>
                  <!-- <vui-bullet :color="colorCategory" v-if="colorCategory" class="ms-3"/> -->
                </div>
              </el-form-item>
              <el-form-item label="Utilisateur" class="w-100">
                <user-filter
                  class="w-100"
                  @clear-tag="userName = null"
                  :userName="userName"
                  @change="filterByUser"
                />
              </el-form-item>
            </el-form>
          </section>
        </el-dialog>
      </template>
    </b-container>
  </div>
</template>
<script>
import VuiBullet from '~/components/vui-alpha/VuiBullet'
import SearchFilter from '~/components/filter/SearchFilter'
import ToogleFilter from '~/components/filter/ToogleFilter'
import UserFilter from '~/components/filter/UserFilter'
import { mapGetters } from 'vuex'

export default {
  name: 'filter-places',
  components: {
    VuiBullet,
    SearchFilter,
    ToogleFilter,
    UserFilter,
  },

  props: {
    byAlphabet: {
      type: Boolean,
      required: false,
      default: false,
    },
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

    showArianeFilter() {
      return this.byUser || this.byCity || this.byCategory
    },

    cityName() {
      return this.byCity
        ? this.cities.find((city) => city.id == this.byCity).label
        : null
    },

    categoryName() {
      return this.byCategory
        ? this.categories.find((category) => category.id == this.byCategory)
            .name
        : null
    },
  },

  methods: {
    filterByAlphabet() {
      this.$emit('filter-by-alphabet', !this.byAlphabet)
    },

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

    filterByUser($event) {
      let result = this.users.find((user) => user.localId === $event)
      if (result) {
        this.userName = result.displayName
      }
      this.$emit('filter-by-user', $event)
    },
  },
}
</script>

<style lang="scss" scoped="scoped">
.filter-places {
  .el-button + .el-button {
    margin: 0;
  }
}

::v-deep .el-dialog {
  width: 500px !important;
  margin: auto;
  max-width: 100%;
}
</style>