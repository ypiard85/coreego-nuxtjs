
<script>

import {auth} from '~/plugins/firebase'


export default {


    props:{
        withUser:{
            type: Boolean,
            required: false,
            default: false
        }
    },

    created(){
        this.iniitMiddleWare()
    },

    methods:{
        iniitMiddleWare(){
            if(this.withUser){
                if(auth && auth.currentUser.uid !== this.$route.params.user){
                        this.$router.replace('/')
                }
            }
        }
    }
}
</script>
