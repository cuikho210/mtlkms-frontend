<template>
<div class="main">
    <img :src="getAvatarURL()" :alt="user.username" class="avatar-xl">

    <div>
        <h3>{{ user.name }}</h3>
        <p class="text-secondary">{{ user.username }} - Tham gia lúc {{ convertTimestampToLocalDate(user.created_at) }}</p>
        <p>{{ user.slogan }}</p>

        <p v-if="auth">
            <router-link to="/profile/edit">[Edit Profile]</router-link>
        </p>
        <p v-else>
            <br>
        </p>
    </div>

    <table>
        <tr>
            <th>Hôm nay:</th>
            <td>{{ caculateTime(user.time_today) }}</td>
        </tr>
        <tr>
            <th>Tuần:</th>
            <td>{{ caculateTime(user.time_week) }}</td>
        </tr>
        <tr>
            <th>Tháng:</th>
            <td>{{ caculateTime(user.time_month) }}</td>
        </tr>
        <tr>
            <th>Năm:</th>
            <td>{{ caculateTime(user.time_year) }}</td>
        </tr>
        <tr>
            <th>Tổng:</th>
            <td>{{ caculateTime(user.time_total) }}</td>
        </tr>
    </table>
</div>
</template>

<script>
import api from '@/store/api'

export default {
    name: 'UserProfile',

    props: {
        userData: {
            type: Object
        }
    },

    created () {
        if (this.userData) {
            this.user = this.userData
        }
        else {
            this.user = this.$store.state.user
            this.auth = true
        }
    },

    data () {
        return {
            user: {},
            auth: false
        }
    },

    methods: {
        convertTimestampToLocalDate (timestamp) {
            return new Date(timestamp).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            })
        },

        getAvatarURL () {
            return api.getAvatarURL(this.user.username)
        },

        caculateTime (minutes) {
            if (minutes == null) return '0 giờ (0 phút)'

            let hours = (minutes / 60).toFixed(2)

            return `${hours} giờ (${minutes} phút)`
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

table {
    width: 100%
}

table th {
    text-align: right;
    padding: .5rem;
    width: 45%;
}

@media (min-width: 1024px) {
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