<template>
<div class="container container-sm">
    <form action="" method="POST" @submit.prevent='submitForm()'>
        <h2 class="mb-4">Đăng nhập</h2>

        <transition name="fade-in">
            <div class="log" v-show="log" :class="isSuccess ? 'success' : 'error'">
                <p>{{ apiLog }}</p>
                <p>{{ log }}</p>
            </div>
        </transition>

        <label class="input">
            <span class="material-icons">person</span>
            <input type="text" name="username" required placeholder="Username" v-model="form.username">
            <p>Username</p>
        </label>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" name="password" required placeholder="Mật khẩu" v-model="form.password">
            <p>Password</p>
        </label>

        <div class="footer">
            <button class="btn btn-primary">
                <span class="material-icons mr-2">login</span>
                Đăng nhập
            </button>

            <div>
                <p>Chưa có tài khoản? <router-link to="/register">[Đăng Ký]</router-link></p>
                <p><router-link to="">[Quên Mật Khẩu]</router-link></p>
            </div>
        </div>
    </form>
</div>
</template>

<style scoped>
.log {
    padding: .25rem 1rem;
    border-radius: .25rem;
    font-size: 12px;
}

.error {
    color: red;
    background-color: #ff000010;
}

.success {
    color: green;
    background-color: #00ff0010;
}
</style>

<script>
import api from '/src/assets/js/api'
import store from '/src/assets/js/store'

export default {
    name: 'LoginView',

    created () {
        this.checkLogin()
    },

    data () {
        return {
            data: store.getAll(),

            form: {
                username: '',
                password: ''
            },

            isSuccess: false,
            apiLog: '',
            log: ''
        }
    },

    methods: {
        submitForm() {
            this.data.isLoading = true

            api.post('/login', this.form)
            .then(res => {
                this.data.isLoading = false

                if (res.status === 200) {
                    res.json().then(data => {
                        this.isSuccess = true
                        this.apiLog = '';
                        this.log = "Đăng ký thành công"
                        store.set('user', data.user)
                        store.set('isLogin', true)
                        api.setAvatarURL()
                        this.$router.push('/')
                    })
                }
                else {
                    res.json().then(data => {
                        this.isSuccess = false
                        this.apiLog = data.error
                        this.showLog()
                    })
                }
            })
            .catch(err => {
                this.data.isLoading = false

                console.log(err)
            })
        },

        showLog () {
            if (this.apiLog == 'Username not found or password is incorrect') this.log = 'Tên đăng nhập hoặc mật khẩu không chính xác'
            else this.log = 'Đã có lỗi xảy ra'
        },

        redirect () {
            if (store.get('redirect') && store.get('redirect') != '/login' && store.get('redirect') != '/register') {
                this.$router.push(store.get('redirect'))
                store.set('redirect', null)
            }
            else {
                this.$router.push('/')
            }
        },

        async checkLogin () {
            if (store.get('isLogin')) {
                this.redirect()
            }
            
            this.data.isLoading = true

            let result = await api.get('/check-login')
            let data = await result.json()

            this.data.isLoading = false

            if (result.status !== 200) {
                throw new Error('Check login failed')
            }

            store.set('user', data.user)
            store.set('isLogin', true)
            api.setAvatarURL()

            // Get learning diary
            try {
                let diary = await api.getLearningDiary()
                store.set('learningDiary', diary)
            }
            catch (err) {
                console.log(err)
            }

            this.redirect()
        }
    }
}
</script>