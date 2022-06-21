<template>
<div class="container container-sm">
    <form action="" method="POST" @submit.prevent='submitForm()'>
        <h2 class="mb-4">Đăng ký</h2>

        <transition name="fade-in">
            <div class="log" v-show="log" :class="isSuccess ? 'success' : 'error'">
                <p>{{ apiLog }}</p>
                <p>{{ log }}</p>
            </div>
        </transition>

        <label class="input">
            <span class="material-icons">label</span>
            <input type="text" name="name" required placeholder="Tên hiển thị" v-model="form.name">
            <p>Tên hiển thị</p>
        </label>

        <label class="input">
            <span class="material-icons">person</span>
            <input type="text" name="username" required placeholder="Tên đăng nhập" v-model="form.username">
            <p>Tên đăng nhập</p>
        </label>

        <label class="input">
            <span class="material-icons">email</span>
            <input type="email" name="email" required placeholder="Email" v-model="form.email">
            <p>Email</p>
        </label>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" name="password" required placeholder="Mật khẩu" v-model="form.password">
            <p>Mật khẩu</p>
        </label>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" name="repassword" required placeholder="Nhập lại mật khẩu" v-model="form.repassword">
            <p>Re-password</p>
        </label>

        <div class="footer">
            <button class="btn btn-primary">
                <span class="material-icons mr-2">send</span>
                Đăng ký
            </button>

            <div>
                <p>Đã có tài khoản? <router-link to="/login">[Đăng Nhập]</router-link></p>
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
import { mapActions, mapMutations } from 'vuex'

export default {
    name: 'RegisterView',

    data () {
        return {
            form: {
                name: '',
                username: '',
                email: '',
                password: '',
                repassword: ''
            },

            apiLog: '',
            log: '',
            isSuccess: false
        }
    },
    
    methods: {
        ...mapActions(['register']),
        ...mapMutations(['setIsLoading']),

        async submitForm () {
            if (this.form.password !== this.form.repassword) {
                this.log = 'Mật khẩu không khớp'
                this.isSuccess = false
                return
            }

            try {
                let result = await this.register(this.form)
                if (!result) return

                this.isSuccess = true
                this.apiLog = ''
                this.log = "Đăng ký thành công"
                this.$router.push('/')
            }
            catch (err) {
                this.isSuccess = false
                this.apiLog = err.message
                this.showLog()
            }
        },

        showLog () {
            if (this.apiLog == 'Invalid name') this.log = 'Tên phải lớn hơn 2 và nhỏ hơn 50 kí tự'
            else if (this.apiLog == 'Invalid email') this.log = 'Email không đúng định dạng'
            else if (this.apiLog == 'Invalid username') this.log = 'Tên đăng nhập phải từ 3 đến 20 kí tự, không bao gồm khoảng trống và kí tự đặc biệt'
            else if (this.apiLog == 'Invalid password') this.log = 'Mật khẩu phải lớn hơn 6 kí tự, bao gồm chữ cái viết thường, viết hoa, số và kí tự đặc biệt'
            else if (/(ER_DUP_ENTRY: Duplicate entry ').+(' for key 'username')/gi.test(this.apiLog)) this.log = 'Tên đăng nhập đã tồn tại'
            else if (/(ER_DUP_ENTRY: Duplicate entry ').+(' for key 'email')/gi.test(this.apiLog)) this.log = 'Email đã tồn tại'
            else this.log = 'Đã có lỗi xảy ra'
        }
    }
}
</script>