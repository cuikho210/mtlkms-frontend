<template>
<div
class="container container-md"
v-if="isUserLoaded()">
    <ProfileComponent
    :user-data="user" />
    <hr>

    <h3 class="mb-4">Nhật ký thời gian học</h3>
    <ContributionDiary
    :userID="user.id" />
</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ProfileComponent from '@/components/user/ProfileComponent.vue'
import ContributionDiary from '@/components/study_diary/ContributionDiary.vue'

export default {
    name: 'UserView',

    components: {
        ProfileComponent,
        ContributionDiary
    },

    data () {
        return {
            user: {}
        }
    },

    created () {
        this.getUserData()
    },

    computed: {
        ...mapState(['users']),
    },

    methods: {
        ...mapActions(['fetchUsers']),
        ...mapMutations(['setTitle']),

        isUserLoaded () {
            return Object.keys(this.user).length > 0
        },

        async getUserData () {
            await this.fetchUsers()

            let username = this.$route.params.username

            if (this.users[username]) {
                this.user = this.users[username]
            }
            else {
                this.$router.push('/users')
            }

            this.setTitle(this.user.name + ' - Trang Cá Nhân - MTLKMS')
        }
    }
}
</script>