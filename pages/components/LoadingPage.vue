<template>
    <div class="d-flex flex-column justify-content-center align-items-center loading__page" style="height: 80vh">
        <div class="d-flex">
            <div class="point one"></div>
            <div class="point two"></div>
            <div class="point three"></div>
        </div>
        <p class="fs-2 loading__text">Chargement</p>
    </div>
</template>

<style scoped="scoped" lang="scss">
   .loading__page {
        .point {
            background-color: $blue-principal;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            margin: 10px;

            &.one {
                animation: 1s ease-in transitionYOne infinite;
            }

            &.point.two {
                animation: 1s ease-in transitionYTwo infinite;
            }

            &.three {
                animation: 1s ease-in transitionYThree infinite;
            }
        }

        .loading__text{
            color:  $blue-principal;
        }
    }

    @keyframes transitionYOne {
        0% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
        70% {
            transform: translateY(0px);
        }
    }

    @keyframes transitionYTwo {
        20% {
            transform: translateY(0px);
        }
        70% {
            transform: translateY(-20px);
        }
        90% {
            transform: translateY(0px);
        }
    }

    @keyframes transitionYThree {
        60% {
            transform: translateY(0px);
        }
        80% {
            transform: translateY(-20px);
        }
        100% {
            transform: translateY(0px);
        }
    }
</style>
