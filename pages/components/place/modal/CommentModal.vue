<template>
  <el-form>
    <el-input :rows="10" type="textarea" v-model="comment" />
    <el-button class="mt-3" size="small" :disabled="comment.trim() == '' " type="success"
      @click="handleAddComment">Ajouter</el-button>
  </el-form>
</template>

<script>
  import { db, auth } from "~/plugins/firebase";
  import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
  export default{
    name: 'commentModal',

    data(){
      return{
        comment: ''
      }
    },

    methods:{
      async handleAddComment() {
        try {
          this.$emit('modal-busy', true)
          await addDoc(collection(db, "commentaires"), {
            placeId: this.$route.params.id,
            user: auth.currentUser.uid,
            content: this.comment,
            created_at: new Date()
          });
          this.$message.success("Commentaire ajouté")
          this.$emit('load-comments')
          this.$emit('close-modal')
        } catch (error) {
          console.log(error)
        } finally {
          this.$emit('modal-busy', false)
        }

      },
    }

  }
</script>