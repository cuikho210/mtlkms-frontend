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
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'LoginView',

    created () {
        this.checkIfLoggedIn()
    },

    data () {
        return {
            form: {
                username: '',
                password: ''
            },

            isSuccess: false,
            apiLog: '',
            log: ''
        }
    },

    computed: {
        ...mapState(['isLogin', 'redirect'])
    },

    methods: {
        ...mapActions(['login', 'checkLogin', 'getLearningDiary']),
        ...mapMutations(['setRedirect']),

        async submitForm() {
            try {
                await this.login(this.form)
            }
            catch (err) {
                this.isSuccess = false
                this.apiLog = err.message
                this.showLog()
            }

            this.isSuccess = true
            this.apiLog = ''
            this.log = 'Đăng nhập thành công'
            this.$router.push('/')
        },

        showLog () {
            if (this.apiLog == 'Username not found or password is incorrect') this.log = 'Tên đăng nhập hoặc mật khẩu không chính xác'
            else this.log = 'Đã có lỗi xảy ra'
        },

        runRedirect () {
            if (this.redirect && this.redirect != '/login' && this.redirect != '/register') {
                this.$router.push(this.redirect)
                this.setRedirect(null)
            }
            else {
                this.$router.push('/')
            }
        },

        async checkIfLoggedIn () {
            if (this.isLogin) this.runRedirect()

            await this.checkLogin()

            try {
                await this.getLearningDiary()
            }
            catch (err) {
                console.log('Bạn không đang học môn nào - ', err.message)
            }

            this.runRedirect()
        }
    }
}
</script>