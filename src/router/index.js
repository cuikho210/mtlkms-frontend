import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

// Account View
import LoginView from '../views/accounts/LoginView.vue'
import RegisterView from '../views/accounts/RegisterView.vue'
import LogoutView from '../views/accounts/LogoutView.vue'

import ProfileView from '../views/accounts/ProfileView.vue'
import EditProfileView from '../views/accounts/EditProfileView.vue'

import SDListView from '../views/study_diary/SDListView.vue'
import SDTagView from '../views/study_diary/SDTagView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Trang Chủ - MTLKMS'
    }
  },

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
  },

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
  },

  {
    path: '/study-diary',
    name: 'study-diary',
    component: SDListView,
    meta: {
      title: 'Nhật Ký Thời Gian Học - MTLKMS'
    }
  },

  {
    path: '/study-diary/:id',
    name: 'study-diary-tag',
    component: SDTagView,
    meta: {
      title: 'Nhật Ký Thời Gian Học - MTLKMS'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,

  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        }
        else {
          resolve({ top: 0 })
        }
      }, 500)
    })
  }
})

export default router