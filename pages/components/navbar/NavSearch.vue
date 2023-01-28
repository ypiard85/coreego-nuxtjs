<template>
  <el-form class="nav_search_form d-flex bg-white shadow">
    <el-select class="select_category" clearable v-model="category" placeholder="Catégory">
      <el-option v-for="category in categories" :label="category.label" :key="category.id"
        :value="category.id"></el-option>
    </el-select>
    <el-select class="select_city" clearable v-model="city" placeholder="Ville">
      <el-option v-for="city in cities" :label="city.label" :key="city.id" :value="city.id"></el-option>
    </el-select>
    <el-input clearable v-model="title" class="search_input"
      placeholder="Entrez un mot cles">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </el-form>
</template>

<script>
  export default {

    props: {
      categories: {
        type: Array,
        required: false,
        default: []
      },
      cities: {
        type: Array,
        required: false,
        default: []
      },
    },

    data() {
      return {
        city: null,
        category: null,
        title: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .nav_search_form {
    width: 500px;
    max-width: 100%;
    background-color: white;
    padding: 10px 20px;
    border-radius: 20px;

    .select_city {

      max-width: 100%;
      border-right: 1px solid #C0C4CC;
    }

    .select_category {

      border-right: 1px solid #C0C4CC;
    }

    .el-input-group__append {
      button {
        background-color: $blue-principal;

        i {
          color: white;
        }
      }
    }
  }

  ::v-deep .el-input__inner {
    border: 1px solid transparent;
  }
</style>