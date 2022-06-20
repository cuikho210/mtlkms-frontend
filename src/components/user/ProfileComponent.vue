<template>
<div class="main">
    <img :src="user.avatarURL" :alt="user.username" class="avatar-xl">

    <div>
        <h3>{{ user.name }}</h3>
        <p class="text-secondary">{{ user.username }} - Tham gia lúc {{ convertTimestampToLocalDate(user.created_at) }}</p>
        <p>{{ user.slogan }}</p>
        <p><router-link to="/profile/edit">[Edit Profile]</router-link></p>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'UserProfile',

    data () {
        return {

        }
    },

    computed: {
        ...mapState(['user']),
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