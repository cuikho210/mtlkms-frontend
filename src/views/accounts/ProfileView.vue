<template>
<div class="container container-md">
    <Profile />
    <hr>
    
    <h3 class="mb-4">Nhật ký thời gian học</h3>
    <ContributionDiary />
</div>
</template>

<script>
import store from '/src/assets/js/store'
import Profile from '/src/components/user/ProfileComponent.vue'
import ContributionDiary from '@/components/study_diary/ContributionDiary.vue'

export default {
    name: 'ProfileView',

    components: {
        Profile,
        ContributionDiary
    },

    data () {
        return {
            data: store.getAll()
        }
    },

    methods: {

    }
}
</script>

<style>

</style>