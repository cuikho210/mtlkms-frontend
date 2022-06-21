<template>
<div class="container container-md grid">
    <router-link
    v-for="(user, index) of users"
    :key="index"
    class="user"
    :to="'/user/' + user.username"
    >
        <img
        :src="getAvatarURL(user.username)"
        :alt="user.username + '-avatar'"
        class="avatar" />

        <div class="ml-3">
            <p><b>{{ user.name }}</b></p>
            <p class="text-secondary">{{ user.username }}</p>
        </div>
    </router-link>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import api from '@/store/api'

export default {
    name: 'UserListView',

    data () {
        return {
            
        }
    },

    created () {
        this.fetchUsers()
    },

    computed: {
        ...mapState(['users']),
    },

    methods: {
        ...mapActions(['fetchUsers']),

        async getUsersData () {
            try {
                await this.fetchUsers()
            }
            catch (error) {
                console.log('[getUsersData - UserListView]', error)
            }
        },

        getAvatarURL (username) {
            return api.getAvatarURL(username)
        }
    },
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 10px;
    margin-top: 20px;
}

.user {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    border-radius: .25rem;
    border: 1px solid #ff907f10;
    border-left: 3px solid #ff907f;
    text-decoration: none;
    color: initial;
    transition: border-left .5s, box-shadow .5s, color .5s;
}

.user:hover {
    border-left: 3px solid #ff90ff;
    box-shadow: 3px 3px 3px #ff90ff30;
    color: #ff907f;
}
</style>