<template>
    <b-nav class="navigation__bar py-3 position-sticky top-0 shadow bg-white">
        <b-container fluid="sm" class="d-flex justify-content-between align-items-center">
            <div>
                <b-nav-item active="active">
                    <NuxtLink to="/" class="navigation__logo d-flex align-items-center" style="width: 150px;">
                        <el-image :src="LOGO_PATH" style="width: 100%; height: 100%;" alt="logo coreego"></el-image>
                    </NuxtLink>
                </b-nav-item>
            </div>
            <div class="d-flex align-items-center">
                <div class="d-none d-md-block">
                    <ul class="d-flex">
                        <b-nav-item>
                            <NuxtLink exact="exact" class="d-block" to="/">
                                <i class="el-icon-house"></i>
                                Accueil</NuxtLink>
                        </b-nav-item>
                        <b-nav-item>
                            <NuxtLink class="d-block" to="/places" exact="exact">
                                <i class="el-icon-view"></i>
                                Lieux</NuxtLink>
                        </b-nav-item>
                    </ul>
                </div>
                <!--Dropdown avatar avec les Settings de connexion-->
                <el-dropdown trigger="click" class="d-md-none d-block">
                    <span class="el-dropdown-link me-3">
                        <i class="el-icon-s-grid fs-3"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <NuxtLink class="d-block" exact="exact" to="/">
                                <i class="el-icon-house"></i>
                                Accueil</NuxtLink>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <NuxtLink class="d-block" to="/places" exact="exact">
                                <i class="el-icon-view"></i>
                                Lieux</NuxtLink>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" v-if="!user">
                    <span class="el-dropdown-link">
                        <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <NuxtLink :to="{ name: 'login' }" class="d-block">
                                <i class="el-icon-s-unfold"></i>
                                Connexion</NuxtLink>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown v-else="v-else" trigger="click">
                    <span class="el-dropdown-link">
                        <el-avatar :src="user.photoURL"></el-avatar>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <NuxtLink class="d-block" to="/places/add">
                                <i class="el-icon-plus"></i>
                                Ajouter un lieu</NuxtLink>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <NuxtLink class="d-block" :to="'/profil/view/' + user.uid ">
                                <i class="el-icon-user"></i>
                                Profil</NuxtLink>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <NuxtLink class="d-block" :to="'/carnet/' + user.uid ">
                                <i class="el-icon-notebook-1"></i>
                                Carnet de route</NuxtLink>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <a class="d-block" to="/" @click="handleLogOut">
                                <i class="el-icon-s-fold"></i>
                                Déconnexion</a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </b-container>
    </b-nav>
</template>
<script>
    import {LOGO_PATH} from "~/utils/variables";
    import {mapActions} from "vuex";

    export default {
        name: 'navigationBar',
        props: {
            user: {
                required: false
            }
        },

        data() {
            return {LOGO_PATH};
        },

        created() {
            console.log("create");
        },

        methods: {
            ...mapActions("auth", ["logout"]),

            handleLogOut() {
                console.log("click jogout");
                this.logout();
            }
        }
    };
</script>


<style lang="scss" scoped="scoped">
    .navigation__bar {
        z-index: 900;
    }

    ::v-deep .el-dropdown-menu a {
        color: black;
        text-decoration: none;
    }
</style>
