import UserListView from '@/views/users/UserListView.vue'
import UserView from '@/views/users/UserView.vue'

export default [
    {
        path: '/users',
        name: 'users',
        component: UserListView,
        meta: {
            title: 'Danh Sách Các Vịt - MTLKMS'
        }
    },

    {
        path: '/users/:username',
        name: 'user',
        component: UserView,
        meta: {
            title: 'Thông Tin Cá Nhân - MTLKMS'
        }
    }
]