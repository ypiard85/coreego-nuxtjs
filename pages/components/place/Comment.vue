<template>
  <div v-loading="busy">
    <h5 class="text-blue my-3"> {{comments.length}} Commentaire {{ comments.length > 1 ? 's' : '' }} </h5>
    <el-button size="small mb-3" @click="handleOpenModal">Ajouter un commentaire</el-button>
    <CommentCard ref="commentcard" v-for="comment in comments" :comment="comment" :key="comment.id"
      :user="user(comment.user)" :authComment="authComment(comment.user)" @edit-comment="onEditComment($event)"
      @delete-comment="deleteComment" />
  </div>
</template>

<script>
  import CommentCard from '~/components/card/CommentCard'
  import { mapGetters } from 'vuex';
  import { auth, db } from "~/plugins/firebase";
  import { doc, updateDoc, deleteDoc } from "firebase/firestore";

  export default {
    name: 'commentaire',

    components: {
      CommentCard
    },

    props: {
      comments: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        busy: false
      }
    },

    computed: {
      ...mapGetters('app', { users: 'getUsers' }),

      user() {
        return userId => {
          return this.users.find(user => user.localId === userId)
        }
      },

      authComment() {
        return userId => {
          if (auth && auth.currentUser) {
            return auth.currentUser.uid === userId
          }
        }

      }

    },

    methods: {
      handleOpenModal() {
        this.$emit('open-modal', {
          name: 'comment',
          open: true,
          title: 'Ajouter un commentaire'
        })
      },

      async onEditComment($event) {
        try {
          this.busy = true

          await updateDoc(doc(db, "commentaires", $event.id), {
            content: $event.content
          })

          this.$emit('load-comments')
          this.$message.success("Commentaire mis à jour");


        } catch (error) {
          console.log(error)
          this.$message.error(error);
        } finally {
          this.busy = false
        }
      },

      async deleteComment($event) {
        try {
          let confirm = await this.$confirm('Supprimer ce commentaire')

          if (confirm) {
            this.busy = true
            await deleteDoc(doc(db, 'commentaires', $event))
            this.$emit('load-comments')
            this.$message.success("Commentaire supprimé");
          }else{

          }

        } catch (error) {
          // this.$message.error(error);
        } finally {
          this.busy = false
        }
      }

    }

  }
</script>

<style scoped lang="scss">
  ::v-deep .el-card__header {
    padding: 10px 20px;
  }
</style>