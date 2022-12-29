<template>
  <div class="filter-places py-3 my-3">
    <b-container fluid="sm">
      <p>Filtres :</p>
      <el-input
        placeholder="Rechercher un lieu"
        :value="search"
        @input="$emit('filter-search', $event)"
        clearable
      />
      <section class="mt-3">
        <el-button
          size="small"
          class="me-3 mb-3"
          @click="$emit('filter-alphabet')"
        >
          <span v-if="!filterAlphabet">Az</span>
          <span v-else>Za</span>
        </el-button>
        <el-button size="small" class="me-3 mb-3" @click="$emit('filter-date')">
          <span v-if="!filterDate">Du plus résents</span>
          <span v-else>Du plus anciens</span>
        </el-button>
        <el-button
          size="small"
          icon="el-icon-s-operation"
          @click="openModal = true"
          >Filtre avancé</el-button
        >
      </section>

      <el-dialog
        title="Filtre avancé"
        :visible="openModal"
        class="filter-places__dialog"
        top="5vh"
        @close="openModal = false"
        :destroy-on-close="true"
        :append-to-body="true"
      >
        <section>
          <el-form label-position="top">
            <el-form-item label="Province" class="w-100">
              <el-select
                name="Province"
                remote
                :value="city"
                class="w-100"
                @input="$emit('filter-city', $event), $emit('on-submit-filter')"
                clearable
                placeholder="Selectioner une province"
              >
                <el-option
                  v-for="city in cities"
                  :key="city.id"
                  :label="city.label"
                  :value="city.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Catégorie" class="w-100">
              <div class="d-flex align-items-center">
                <el-select
                  name="Catégorie"
                  class="w-100"
                  remote
                  :value="category"
                  @input="
                    $emit('filter-category', $event), $emit('on-submit-filter')
                  "
                  clearable
                  placeholder="Selectioner une catégorie"
                >
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.label"
                    :value="category.id"
                  >
                  </el-option>
                </el-select>
                <vui-bullet
                  :color="colorCategory"
                  v-if="colorCategory"
                  class="ms-3"
                />
              </div>
            </el-form-item>
          </el-form>
        </section>
        <!-- <span slot="footer" class="dialog-footer">
                <el-button  type="success" @click="$emit('on-submit-filter'), openModal = false">Rechercher</el-button>
              </span> -->
      </el-dialog>
    </b-container>
  </div>
</template>
<script>
import VuiBullet from "~/components/vui-alpha/VuiBullet";

export default {
  name: "filter-places",
  components: { VuiBullet },
  props: {
    search: {
      type: String,
      required: false,
      default: "",
    },
    categories: {
      type: Array,
      required: false,
      default: [],
    },
    cities: {
      type: Array,
      required: false,
      default: [],
    },
    category: {
      required: false,
      default: null,
    },
    city: {
      required: false,
      default: null,
    },
    filterAlphabet: {
      type: Boolean,
      required: false,
      default: false,
    },
    filterDate: {
      type: Boolean,
      required: false,
      default: false,
    },
    colorCategory: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      openModal: false,
    };
  },
};
</script>

<style lang="scss" scoped>
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
