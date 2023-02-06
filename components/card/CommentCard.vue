<template>
  <el-card class="box-card mb-3" shadow="never" :id="comment.id">
    <div slot="header">
      <div class="float-end" v-if="authComment">
        <el-button type="text" class="me-1" icon="el-icon-edit" @click="editMode = true"></el-button>
        <el-button class="text-danger" @click="$emit('delete-comment', comment.id)" type="text" icon="el-icon-delete-solid"></el-button>
      </div>
      <div class="d-flex align-items-center">
        <el-avatar class="me-3" :src="user.photoUrl" />
        <p class="fw-bold text-blue"> {{user.displayName}} </p>
      </div>
      <small class="time text-secondary"> {{publishedDate}} </small>
    </div>
    <div class="bottom text item" v-if="!editMode">
      {{comment.content}}
    </div>
    <template v-if="editMode">
      <el-form>
        <el-input :rows="10" type="textarea" v-model="content" />
        <el-button class="mt-3" size="small" :disabled="content.trim() == '' " type="success"
          @click="onEditComment">Modifier</el-button>
        <el-button @click="editMode = false" type="danger" size="small">Annuler</el-button>
      </el-form>
    </template>
  </el-card>
</template>


<script>
  import moment from 'moment';
  export default {
    name: 'CommentCard',

    props: {
      comment: {
        type: Object,
        required: true
      },
      user: {
        type: Object,
        required: true
      },
      authComment: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        editMode: false,
        content: null
      }
    },

    created() {
      this.content = this.comment.content
    },

    computed: {
      publishedDate() {
        return moment.unix(this.comment.created_at.seconds).locale('fr').format('dddd D MMMM YYYY - HH:mm ')
      },
    },

    methods: {
      onEditComment() {
        this.$emit('edit-comment', {
          id: this.comment.id,
          content: this.content
        } )
        this.editMode = false
      }
    }

  }
</script>

<style>
</style>