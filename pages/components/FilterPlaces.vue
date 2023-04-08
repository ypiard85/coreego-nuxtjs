<template>
  <div class="filter-places py-3 mb-3 shadow">
    <b-container fluid="sm">
      <span class="fw-bold mb-2">Filtres</span>

      <div class="row filter-places-more">
        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="city">
            <i class="el-icon-location-outline"></i>
          </label>
          <el-select
            id="city"
            class="w-100"
            filterable="filterable"
            name="Province"
            :value="filters.city"
            @input="handleFilters('city', $event)"
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
        </div>
        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="category">
            <i class="el-icon-folder-opened"></i>
          </label>
          <el-select
            id="category"
            class="w-100"
            name="Catégorie"
            :value="filters.category"
            @input="handleFilters('category', $event)"
            filterable="filterable"
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
        </div>
        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="user">
            <i class="el-icon-user"></i>
          </label>
          <user-filter class="w-100" @change="handleFilters('user', $event)" />
        </div>
        <div class="col-md-4 col-xs-12 col-sm-6">
          <label for="period">
            <i class="el-icon-time"></i>
          </label>
          <el-select
            id="category"
            class="w-100"
            name="period"
            :value="filters.period"
            @input="handleFilters('period', $event)"
          >
            <el-option
              v-for="periodOption in PERIOD_OPTIONS"
              :key="periodOption.value"
              :label="periodOption.text"
              :value="periodOption.value"
            />
          </el-select>
        </div>
      </div>
    </b-container>
  </div>
</template>
<script>
import UserFilter from '~/components/filter/UserFilter'
import { mapGetters } from 'vuex'
import { PERIOD_OPTIONS, MORE_RECENT, MORE_OLDER } from '@/utils/variables.js'

export default {
  name: 'filter-places',
  components: {
    UserFilter,
  },

  props: {
    filters: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      PERIOD_OPTIONS,
      MORE_RECENT,
      MORE_OLDER,
    }
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
    }),
  },

  methods: {
    handleFilters(key, value) {
      const filters = {}
      filters[key] = value
      this.$emit('update-filters', filters)
    },
  },
}
</script>

<style lang="scss" scoped="scoped">
.filter-places {
  &-more {
    > div {
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
