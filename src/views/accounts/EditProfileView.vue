<template>
<div class="container container-sm">
    <div class="breadcrumb">
        <router-link to="/profile">Cá Nhân</router-link>
        <router-link to="/profile/edit">Sửa Thông Tin Cá Nhân</router-link>
    </div>

    <form action="" @submit.prevent="updateAvatar()">
        <img :src="avatarPreview" :alt="data.user.username" class="d-block mx-auto avatar-xl" />
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
import store from '@/assets/js/store'
import api from '@/assets/js/api'
import MessagePopup from '@/components/MessagePopup.vue'

export default {
    name: 'EditProfileView',

    components: {
        MessagePopup
    },

    data () {
        return {
            data: store.getAll(),
            
            form: {
                name: store.get('user').name,
                slogan: store.get('user').slogan
            },

            passwordForm: {
                oldPassword: '',
                newPassword: ''
            },

            rePassword: '',

            avatarPreview: api.getAvatarURL(store.get('user').username),
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

    methods : {
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

            this.data.isLoading = true

            api.updateAvatar(data)
            .then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    location.reload()
                }
                else {
                    this.showMessage(
                        'Lỗi!',
                        'Có lỗi xảy ra, vui lòng thử lại',
                        'error'
                    )
                }
            })
            .catch(err => {
                this.data.isLoading = false

                console.log(err)

                this.showMessage(
                    'Lỗi!',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )
            })
        },

        updateProfile () {
            if (!this.form.name || !this.form.slogan) {
                this.showMessage(
                    'Lỗi',
                    'Vui lòng nhập đầy đủ thông tin',
                    'warning'
                )

                return
            }

            this.data.isLoading = true

            api.put('/user', this.form)
            .then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    res.json().then(data => {
                        this.data.user = data.user

                        this.showMessage(
                            'Thành công',
                            'Cập nhật thông tin cá nhân thành công',
                            'success'
                        )
                    })
                }
                else {
                    res.json().then(data => {
                        console.log(data.error)

                        let msg = ''

                        if (data.error == 'Invalid name') msg = 'Tên hiển thị phải lớn hơn 2 và nhỏ hơn 50 kí tự'
                        else msg = 'Có lỗi xảy ra, vui lòng thử lại'

                        this.showMessage(
                            'Lỗi!',
                            msg,
                            'error'
                        )
                    })
                }
            })
            .catch(err => {
                this.data.isLoading = false

                console.log(err)

                this.showMessage(
                    'Lỗi!',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )
            })
        },

        updatePassword () {
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

            this.data.isLoading = true

            api.put('/user/password', this.passwordForm)
            .then(res => {
                this.data.isLoading = false

                if (res.status == 200) {
                    res.json().then(() => {
                        this.showMessage(
                            'Thành công',
                            'Cập nhật mật khẩu thành công',
                            'success'
                        )
                    })

                    this.$router.push('/profile')
                }
                else {
                    res.json().then(data => {
                        console.log(data.error)

                        let msg = ''

                        if (data.error == 'Invalid password') msg = 'Mật khẩu phải từ 6 kí tự, bao gồm chữ in hoa, chữ in thường, số và kí tự đặc biệt'
                        else if (data.error == 'Old password is incorrect') msg = 'Mật khẩu cũ không chính xác'
                        else msg = 'Có lỗi xảy ra, vui lòng thử lại'

                        this.showMessage(
                            'Lỗi!',
                            msg,
                            'error'
                        )
                    })
                }
            })
            .catch(err => {
                this.data.isLoading = false
                
                console.log(err)

                this.showMessage(
                    'Lỗi!',
                    'Không thể kết nối đến máy chủ',
                    'error'
                )
            })
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