<template>
<div class="container container-sm">
    <h2 class="mb-4">Đăng xuất</h2>

    <p>Bạn có chắc muốn đăng xuất không?</p>

    <button class="btn btn-primary" @click="logout">
        <span class="material-icons mr-2">logout</span>
        Đăng xuất
    </button>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import api from '@/store/api'

export default {
    name: 'LogoutView',

    data () {
        return {
            
        }
    },

    methods: {
        ...mapMutations(['setIsLoading']),

        logout() {
            this.setIsLoading(true)
            
            api.get('/logout').then(() => {
                location.href = '/login'
            }).catch(() => {
                this.setIsLoading(false)
            })
        }
    }
}
</script>