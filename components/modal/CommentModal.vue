<template>
  <el-form>
    <el-input :rows="10" type="textarea" v-model="comment" />
    <el-button @click="handleAddComment" class="mt-3" size="small" :disabled="comment.trim() == '' "
      type="success">Ajouter</el-button>
  </el-form>
</template>

<script>
  export default {
    name: 'commentModal',

    data() {
      return {
        comment: ''
      }
    },

    methods: {
      async handleAddComment() {
        try {
          this.$emit('modal-busy', true)
          const commentDocument = this.$fire.firestore.collection('commentaires')

          let commentObject = {
            placeId: this.$route.params.id,
            user: this.$fire.auth.currentUser.uid,
            content: this.comment,
            created_at: new Date()
          }
          await commentDocument.add(commentObject)
          this.$message.success("Commentaire ajouté")
          this.$emit('load')
          this.$emit('close')
        } catch (error) {
          console.log(error)
        } finally {
          this.$emit('modal-busy', false)
        }

      },
    }

  }
</script>