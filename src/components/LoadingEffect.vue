<template>
<div>
    <Transition name="fade-in">
        <div class="main" v-show="data.isLoading">
            <div class="static-bar"></div>
            <div class="move-bar"></div>
        </div>
    </Transition>
</div>
</template>

<script>
import store from '@/assets/js/store'

export default {
    name: 'LoadingEffect',

    data () {
        return {
            data: store.getAll()
        }
    }
}
</script>

<style scoped>
.main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 29;
}

.static-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #ff907f;
}

.move-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 3px;
    border-radius: 1rem;
    background-color: #fff;
    animation: loading 1s linear infinite;
}

@keyframes loading {
    0% {
        left: -50%;
    }
    50% {
        left: 50%;
    }
    100% {
        left: 100%;
    }
}
</style>