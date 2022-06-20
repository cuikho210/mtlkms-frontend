<template>
<div class="container container-sm">
    <div class="breadcrumb">
        <router-link to="/profile">Cá Nhân</router-link>
        <router-link to="/profile/edit">Sửa Thông Tin Cá Nhân</router-link>
    </div>

    <form action="" @submit.prevent="updateAvatar()">
        <img :src="avatarPreview" :alt="user.username" class="d-block mx-auto avatar-xl" />
        <br>

        <p>Cập nhật ảnh đại diện</p>

        <label class="input">
            <input type="file" @change="onchangeAvatar">
        </label>

        <button class="btn btn-primary">
            <span class="material-icons mr-2">file_upload</span>
            Upload
        </button>
    </form>
    <hr>

    <form action="" @submit.prevent="updateProfile()">
        <p>Cập nhật thông tin cá nhân</p>

        <label class="input">
            <span class="material-icons">label</span>
            <input type="text" v-model="form.name" placeholder="Tên hiển thị" />
            <p>Tên hiển thị</p>
        </label>

        <label class="input">
            <span class="material-icons">favorite</span>
            <input type="text" v-model="form.slogan" placeholder="Châm ngôn" />
            <p>Châm ngôn</p>
        </label>

        <button class="btn btn-primary">
            <span class="material-icons mr-2">save</span>
            Save
        </button>
    </form>
    <hr>

    <form action="" @submit.prevent="updatePassword()">
        <p>Cập nhật mật khẩu</p>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" v-model="passwordForm.oldPassword" placeholder="Mật khẩu cũ" />
            <p>Mật khẩu cũ</p>
        </label>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" v-model="passwordForm.newPassword" placeholder="Mật khẩu mới" />
            <p>Mật khẩu mới</p>
        </label>

        <label class="input">
            <span class="material-icons">lock</span>
            <input type="password" v-model="rePassword" placeholder="Xác nhận mật khẩu" />
            <p>Xác nhận mật khẩu</p>
        </label>

        <button class="btn btn-primary">
            <span class="material-icons mr-2">save</span>
            Save
        </button>
    </form>

    <message-popup
    :title="message.title"
    :message="message.message"
    :type="message.type"
    :is-display="message.isDisplay" />
</div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import api from '@/store/api'
import MessagePopup from '@/components/MessagePopup.vue'

export default {
    name: 'EditProfileView',

    components: {
        MessagePopup
    },

    data () {
        return {
            form: {
                name: this.getUserName(),
                slogan: this.getUserSlogan()
            },

            passwordForm: {
                oldPassword: '',
                newPassword: ''
            },

            rePassword: '',

            avatarPreview: api.getAvatarURL(this.getUserUsername()),
            avatarFile: null,

            isLoading: false,

            message: {
                title: '',
                message: '',
                type: '',
                isDisplay: false
            }
        }
    },

    computed: {
        ...mapState(['user']),
    },

    methods : {
        ...mapMutations(['setIsLoading']),
        ...mapActions(['updateProfile', 'updatePassword']),
        ...mapGetters(['getUserName', 'getUserSlogan', 'getUserUsername']),

        updateAvatar () {
            if (!this.avatarFile) {
                this.showMessage(
                    'Lỗi',
                    'Vui lòng chọn ảnh đại diện',
                    'error'
                )

                return
            }

            let data = new FormData()
            data.append('avatar', this.avatarFile)

            this.setIsLoading(true)

            api.updateAvatar(data)
            .then(res => {
                if (res.status == 200) {
                    location.reload()
                }
                else {
                    this.setIsLoading(false)

                    this.showMessage(
                        'Lỗi!',
                        'Có lỗi xảy ra, vui lòng thử lại',
                        'error'
                    )
                }
            })
            .catch(err => {
                this.setIsLoading(false)

                console.log(err)

                this.showMessage(
                    'Lỗi!',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )
            })
        },

        async updateProfile () {
            if (!this.form.name || !this.form.slogan) {
                this.showMessage(
                    'Lỗi',
                    'Vui lòng nhập đầy đủ thông tin',
                    'warning'
                )

                return
            }

            try {
                await this.updateProfile(this.form)

                this.showMessage(
                    'Thành công',
                    'Cập nhật thông tin thành công',
                    'success'
                )
            }
            catch (err) {
                console.log(err.message)

                let msg = ''

                if (err.message == 'Invalid name') msg = 'Tên hiển thị phải lớn hơn 2 và nhỏ hơn 50 kí tự'
                else msg = 'Có lỗi xảy ra, vui lòng thử lại'

                this.showMessage(
                    'Lỗi!',
                    msg,
                    'error'
                )
            }
        },

        async updatePassword () {
            if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword) {
                this.showMessage(
                    'Lỗi',
                    'Vui lòng nhập đầy đủ thông tin',
                    'warning'
                )

                return
            }

            if (this.passwordForm.newPassword != this.rePassword) {
                this.showMessage(
                    'Lỗi',
                    'Mật khẩu mới và xác nhận mật khẩu không khớp',
                    'warning'
                )

                return
            }

            try {
                await this.updatePassword(this.passwordForm)

                this.showMessage(
                    'Thành công',
                    'Cập nhật mật khẩu thành công',
                    'success'
                )

                this.$router.push('/profile')
            }
            catch (err) {
                console.log(err.message)

                let msg = ''

                if (err.message == 'Invalid password') msg = 'Mật khẩu phải từ 6 kí tự, bao gồm chữ in hoa, chữ in thường, số và kí tự đặc biệt'
                else if (err.message == 'Old password is incorrect') msg = 'Mật khẩu cũ không chính xác'
                else msg = 'Có lỗi xảy ra, vui lòng thử lại'

                this.showMessage(
                    'Lỗi!',
                    msg,
                    'error'
                )
            }
        },

        onchangeAvatar (e) {
            let files = e.target.files || e.dataTransfer.files

            if (!files.length) return

            this.convertAvatar(files[0])
        },

        // Convert avatar to 256x256 png file
        convertAvatar (avatar) {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            let img = document.createElement('img')
            let scale = 256
            
            canvas.width = scale
            canvas.height = scale
            
            img.src = URL.createObjectURL(avatar)

            img.onload = () => {
                URL.revokeObjectURL(img.src)
                
                if (img.width > img.height) {
                    let s = img.height / scale
                    let w = img.width / s
                    
                    ctx.drawImage(img, 0, 0, w, scale)
                }
                else {
                    let s = img.width / scale
                    let h = img.height / s
                    
                    ctx.drawImage(img, 0, 0, scale, h)
                }
                
                this.avatarPreview = canvas.toDataURL()

                fetch(this.avatarPreview).then(res => {
                    res.arrayBuffer().then(buf => {
                        this.avatarFile = new File([buf], 'avatar', {type: 'image/png'})
                    })
                })
            }
        },

        showMessage (title, message, type) {
            this.message.title = title
            this.message.message = message
            this.message.type = type
            this.message.isDisplay = !this.message.isDisplay
        }
    }
}
</script>