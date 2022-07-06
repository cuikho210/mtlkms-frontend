import LoginView from '@/views/accounts/LoginView.vue'
import RegisterView from '@/views/accounts/RegisterView.vue'
import LogoutView from '@/views/accounts/LogoutView.vue'

export default [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            title: 'Đăng Nhập - MTLKMS'
        }
    },

    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: {
            title: 'Đăng Ký - MTLKMS'
        }
    },

    {
        path: '/logout',
        name: 'logout',
        component: LogoutView,
        meta: {
            title: 'Đăng Xuất - MTLKMS'
        }
    }
]