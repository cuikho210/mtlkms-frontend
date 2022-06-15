<template>
<div class="main">
    <img :src="data.avatarURL" :alt="data.user.username" class="avatar-xl">

    <div>
        <h3>{{ data.user.name }}</h3>
        <p class="text-secondary">{{ data.user.username }} - Tham gia lúc {{ convertTimestampToLocalDate(data.user.created_at) }}</p>
        <p>{{ data.user.slogan }}</p>
        <p><router-link to="/profile/edit">[Edit Profile]</router-link></p>
    </div>
</div>
</template>

<script>
import store from '@/assets/js/store'
import api from '@/assets/js/api'

export default {
    name: 'UserProfile',

    data () {
        return {
            data: store.getAll(),
            api: api
        }
    },

    methods: {
        convertTimestampToLocalDate (timestamp) {
            return new Date(timestamp).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            })
        }
    }
}
</script>

<style scoped>
.main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    box-sizing: border-box;
}

.main > div {
    width: 100%;
    margin-left: 1rem;
    text-align: center;
    transition: margin-left .5s;
}

@media (min-width: 540px) {
    .main {
        flex-direction: row;
        justify-content: space-evenly;
    }

    .main > div {
        text-align: left;
    }
}

@media (min-width: 1320px) {
    .main > div {
        margin-left: 2rem;
    }
}
</style>