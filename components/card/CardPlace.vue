<template>
  <nuxt-link v-if="place" :to="'/places/view/' + place.id">
    <el-card :body-style="{ padding: '0px' }" class="shadow">
      <vui-user :userUid="place.user" class="p-2 px-3" />
      <el-image
        :src="place.thumbnail.url"
        fit="cover"
        style="height: 200px; width: 100%"
      />
      <div style="padding: 14px" class="bg-light">
        <strong class="d-block text-truncate">{{ place.title }} </strong>
        <div class="bottom clearfix mt-3">
          <vui-city-category :place="place" />
          <div class="mt-2">
            <small>{{ timeAgo(place.created_at) }} </small>
          </div>
        </div>
      </div>
    </el-card>
  </nuxt-link>
  <b-skeleton
    animation="wave"
    style="height: 500px; pointer-events: none"
    v-else
  ></b-skeleton>
</template>

<script>
import VuiCityCategory from '@/components/vui-alpha/VuiCityCategory'
import VuiUser from '../vui-alpha/VuiUser'
import {timeAgo} from '@/utils/general.js'

export default {
  name: 'CardPlace',

  components: { VuiCityCategory, VuiUser },

  props: {
    place: {
      type: Object,
      required: false,
    },
  },

  data(){
    return{
      timeAgo
    }
  }

}
</script>

<style scoped lang="scss">
.card__place {
  width: 100%;
  max-width: 100%;

  .card__image {
    width: 100%;
    max-width: 100%;
    height: 180px;

    img {
      width: 100%;
      max-width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: bottom;
    }
  }

  .card__category {
    font-size: 12px;
  }

  .card__content {
    width: 100%;
  }
}
</style>
