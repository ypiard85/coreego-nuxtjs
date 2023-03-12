<template>
  <div v-loading="busy">
    <h5 class="text-blue my-3">
      {{ comments.length }} Commentaire{{ comments.length > 1 ? 's' : '' }}
    </h5>
    <el-button size="small mb-3" @click="$emit('click')"
      >Ajouter un commentaire</el-button
    >
    <CommentCard
      ref="commentcard"
      v-for="comment in comments"
      :comment="comment"
      :key="comment.id"
      :authComment="authComment(comment.user)"
      @edit-comment="onEditComment($event)"
      @delete-comment="deleteComment"
    />
  </div>
</template>

<script>
import CommentCard from '~/components/card/CommentCard'
import { auth, db } from '~/plugins/firebase'

export default {
  name: 'commentaire',

  components: {
    CommentCard,
  },

  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      busy: false,
    }
  },

  computed: {
    authComment() {
      return (userId) => {
        if (auth && auth.currentUser) {
          return auth.currentUser.uid === userId
        }
      }
    },
  },

  methods: {
    handleOpenModal() {
      this.$emit('open-modal', {
        name: 'comment',
        open: true,
        title: 'Ajouter un commentaire',
      })
    },

    async onEditComment($event) {
      try {
        this.busy = true
        const commentDocument = this.$fire.firestore.collection('commentaires').doc($event.id)
        await commentDocument.update({
          content: $event.content,
        })

        this.$emit('load')
        this.$message.success('Commentaire mis à jour')
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      } finally {
        this.busy = false
      }
    },

    async deleteComment(commentId) {
      try {
        let confirm = await this.$confirm('Supprimer ce commentaire')
         const commentDocument = this.$fire.firestore.collection('commentaires').doc(commentId)
        if (confirm) {
          this.busy = true
          await commentDocument.delete()
          this.$emit('load')
          this.$message.success('Commentaire supprimé')
        }
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.busy = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-card__header {
  padding: 10px 20px;
}
</style>
