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
import store from '@/assets/js/store'
import api from '@/assets/js/api'

export default {
    name: 'LogoutView',

    data () {
        return {
            data: store.getAll()
        }
    },

    methods: {
        logout() {
            this.data.isLoading = true
            
            api.get('/logout').then(() => {
                this.data.isLoading = false

                store.set('isLogin', false)
                store.set('user', {})
                this.$router.push('/login')
            }).catch(() => {
                this.data.isLoading = false
            })
        }
    }
}
</script>