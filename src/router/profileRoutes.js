import ProfileView from '@/views/accounts/ProfileView.vue'
import EditProfileView from '@/views/accounts/EditProfileView.vue'

export default [
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: {
            title: 'Thông Tin Cá Nhân - MTLKMS'
        }
    },

    {
        path: '/profile/edit',
        name: 'edit-profile',
        component: EditProfileView,
        meta: {
            title: 'Chỉnh Sửa Thông Tin Cá Nhân - MTLKMS'
        }
    }
]