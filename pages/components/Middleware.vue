<template></template>
<script>
    import { auth } from '~/plugins/firebase'
    import { mapGetters } from 'vuex'

    export default {
        props: {
            editPlace: {
                type: Boolean,
                required: false,
                default: false
            },

            userProfil: {
                type: Boolean,
                required: false,
                default: false
            },

            viewPlace: {
                type: Boolean,
                required: false,
                default: false
            },

            carnetUser:{
                type: Boolean,
                required: false,
                default: false
            }

        },

        created() {
            this.initMiddleWare()
        },

        computed: {
            ...mapGetters('app', { users: 'getUsers', places: 'getPlaces' })
        },

        methods: {
            initMiddleWare() {
                if (this.userProfil) {
                    return this.users.findIndex(user => user.localId === this.$route.params.user) === -1 && this.$router.replace('/')
                }
                if (this.editPlace) {
                    let place = this.places.find(place => place.id === this.$route.params.id)
                    if (!place) {
                        this.$router.replace('/')
                    }
                    if (place && place.user.localId !== auth.currentUser.uid) {
                        this.$router.replace('/')
                    }
                }
                if (this.viewPlace) {
                    return this.places.findIndex(place => place.id === this.$route.params.id) === -1 && this.$router.replace('/')
                }

                if(this.carnetUser){
                    if((auth && auth.currentUser) && auth.currentUser.uid !== this.$route.params.user){
                        return this.$router.replace('/')
                    }
                }

            }
        }
    }
</script>