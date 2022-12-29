<template>
  <div>
    <div class="custom_typecontrol">
      <el-button-group>
        <el-button
          @click="$emit('change-mode', MODE_MAP_VIEW)"
          :type="mapMode == MODE_MAP_VIEW ? 'primary' : '' "
          icon="el-icon-map-location"
        ></el-button>
        <el-button
          @click="$emit('change-mode', MODE_STREET_VIEW)"
          :type="mapMode == MODE_STREET_VIEW ? 'primary' : '' "
          icon="el-icon-bicycle"
        ></el-button>
      </el-button-group>

      <el-button-group class="btn__group__map_type mt-5 d-flex flex-column"
      v-if="mapMode === MODE_MAP_VIEW"
      >
        <el-button @click="$emit('change-type', TYPE_ROADMAP )" :class="[mapType === TYPE_ROADMAP && 'type-selected' ]" >
          <img  src="./images/plan.png" />
        </el-button>
        <el-button @click="$emit('change-type', TYPE_HYBRID)" :class="[mapType === TYPE_HYBRID && 'type-selected']">
          <img src="./images/satelite.png" />
        </el-button>
      </el-button-group>

    </div>
  </div>
</template>
<script>
import {
  TYPE_ROADMAP,
  TYPE_HYBRID,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from "~/utils/variables.js";

export default {
  props: {
    mapType: {
      type: Number,
      required: true,
    },
    mapMode: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      TYPE_ROADMAP,
      TYPE_HYBRID,
      MODE_MAP_VIEW,
      MODE_STREET_VIEW,
    };
  },
};
</script>

<style scoped lang="scss">
.custom_typecontrol {
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: flex-end;
  top: 10px;
  right: 10px;
  overflow: hidden;
  z-index: 1000;
}

::v-deep .btn__group__map_type{
  border: 0px solid transparent;
    button{
      padding: 0;
      margin: 0;
      background-color: transparent;

      height: 50px;
      width: 50px;
      border: 0px solid transparent;
      img{
        width: 100%;
        height: 100%;
      }
    }

    .type-selected{
      border: 3px solid black;
      box-shadow: 0px 0px 10px black;
    }
  }

</style>
