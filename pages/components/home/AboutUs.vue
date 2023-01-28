<template>
  <div class="py-3 aboutus">
    <div class="container aboutus-description">
      <h2 class="fs-5">Qu'est ce que COREEGO ?</h2>
      <section>
        <p>
          COREEGO est une application communautaire visant à combler les manques d'informations concernant les endroits
          atypiques à découvrir en Corée du Sud.<br> Lorsque l'on découvre un pays étranger, nous nous concentrons
          souvent
          sur les lieux touristiques et passons ainsi à côté de pépites moins médiatisées.<br>
          Cette application à donc pour objectif le partage
        </p>
      </section>
      <section>
        <p class="fw-bold">Venez découvrir :</p>
        <ul class="d-flex flex-wrap p-0">
          <li class="me-2" v-for="category in categories" :key="category.id"><vui-tag :label="category.label"
              :color="category.color" /></li>
        </ul>
      </section>
      <el-divider></el-divider>
      <section class="aboutus-warning">
        <p>
          <i class="el-icon-warning text-danger"></i>
          <strong>COREEGO n'est pas une agence de voyage.</strong> <br>
          Tous les lieux disponibles sur l'application peuvent être erronés. La Corée du Sud étant un pays qui se
          développeme rapidement, certains lieux peuvent ne plus exister. <br> Pensez à bien vérifier la street view présente
          sur le détail du lieu, cette dernière est mis à jour régulièrement par la société Kakao Corporation.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
  import VuiTag from '~/components/vui-alpha/VuiTag'
  export default {
    name: "about-us",

    props: {
      categories: {
        type: Array,
        required: false,
        default: []
      }
    },

    components: { VuiTag }

  }

</script>

<style lang="scss" scoped>
  .aboutus {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    &-warning {
      i {
        font-size: 34px;
      }
    }
  }
</style>