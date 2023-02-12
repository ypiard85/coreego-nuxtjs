<template>
  <div v-if="place">
    <section class="introduction__header">
      <div class="d-flex">
        <span class="me-2 text-secondary fw-bold"><i class="el-icon-location-outline"></i>{{ city.label }}</span>
        <vui-tag :label="category.name" :color="category.color" />
      </div>
      <Avatar :user="place.user" :link="true" />
      <h1 class="fs-3 mt-3">{{ place.title }}</h1>
    </section>
    <!-- description -->
    <section class="my-2 introduction__description" style="white-space: pre-line">
      {{ place.description }}
    </section>

    <section class="mt-5" v-if="isLogged">
      <!-- <el-button v-if="!inCarnet" type="primary" @click="$emit('add-to-carnet')" :loading="loadingBtn"
        icon="el-icon-plus">Carnet de route</el-button>
      <el-button v-else type="danger" :loading="loadingBtn" @click="$emit('delete-to-carnet')"
        icon="el-icon-minus">Carnet de route</el-button> -->
      <switch-button :status="inCarnet" true-icon="el-icon-plus" false-icon="el-icon-minus" true-label="Carnet de route"
        false-label="Carnet de route" :busy="busy" @status-changed="updateCarnet" />

      <setting-dropdown v-if="isAuthPlace" @command-button="$emit('command-button', $event)" />

    </section>

  </div>
</template>

<script>
  import VuiTag from '@/components/vui-alpha/VuiTag'
  import Avatar from '@/components/Avatar'
  import SettingDropdown from './_SettingDropdown'
  import SwitchButton from '@/components/button/SwitchButton'
  import { mapGetters, mapActions } from 'vuex'
  import { auth, db, storage } from "~/plugins/firebase";
  import { getDoc, getDocs, setDoc, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";


  export default {
    components: { VuiTag, Avatar, SettingDropdown, SwitchButton },

    props: {
      place: {
        required: true,
      },
      loadingBtn: {
        type: Boolean,
        required: false,
        default: false
      },
      isAuthPlace: {
        type: Boolean,
        required: true,
        default: false,
      },
      user: {
        type: Object,
        required: false,
        default: () => { }
      }
    },

    data() {
      return {
        busy: false,

      }
    },

    computed: {
      ...mapGetters('auth', { isLogged: 'getIsLogged' }),
      ...mapGetters("app", {
        cities: "getCities",
        categories: "getCategories",
        carnetStore: 'getCarnet'
      }),


      category() {
        return this.categories.find(
          (category) => category.id === this.place.category
        );
      },

      city() {
        return this.cities.find((city) => city.id === this.place.city);
      },

      carnet(){
        return [...this.carnetStore]
      },

      inCarnet() {
        if (this.isLogged) {
          return (
            Array.isArray(this.carnet) &&
            this.carnet.length > 0 &&
            this.carnet.includes(this.$route.params.id)
          );
        }
      },

    },

    methods: {
      ...mapActions('app', ['loadCarnet']),

      async updateCarnet() {
        try {
          this.busy = true

          if (!this.inCarnet) {
            let carnet = [...this.carnet, this.$route.params.id]
            await setDoc(doc(db, "carnets", this.user.uid), {
              places: carnet
            })
            await this.loadCarnet(this.user.uid)
            this.$message.success('Ce lieu à été ajouter à votre carnet de route')
          } else {
            let carnet = [...this.carnet].filter((placeId) => placeId != this.$route.params.id);
            await setDoc(doc(db, "carnets", this.user.uid), {
              places: carnet
            })
            await this.loadCarnet(this.user.uid)
            this.$message.success('Ce lieu à été supprimer de votre carnet de route')
          }
        } catch (error) {
          console.log(error)
          this.$message.error(error)
        } finally {
          this.busy = false
        }
      }

    }

  };
</script>

<style scoped lang="scss">
  ::v-deep .nav-tabs {
    border-bottom: 0px solid transparent;

    .nav-link.active {
      border-color: transparent;
      border-bottom: 3px solid black;
    }
  }
</style>