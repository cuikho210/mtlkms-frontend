import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import HomeView from '../views/HomeView.vue'

// Account View
import LoginView from '../views/accounts/LoginView.vue'
import RegisterView from '../views/accounts/RegisterView.vue'
import LogoutView from '../views/accounts/LogoutView.vue'

import ProfileView from '../views/accounts/ProfileView.vue'
import EditProfileView from '../views/accounts/EditProfileView.vue'

import SDListView from '../views/study_diary/SDListView.vue'
import SDTagView from '../views/study_diary/SDTagView.vue'

import UserListView from '../views/users/UserListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Trang Chủ - MTLKMS',
      metaTags: [
        {
          name: 'description',
          content: 'Góc nhỏ của nhà Vịt - Nơi cùng nhau học tập và chém gió ^^'
        },
        {
          property: 'og:description',
          content: 'Góc nhỏ của nhà Vịt - Nơi cùng nhau học tập và chém gió ^^'
        }
      ]
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
  },

  {
    path: '/users',
    name: 'users',
    component: UserListView,
    meta: {
      title: 'Danh Sách Các Vịt - MTLKMS'
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

// Copy from https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  changeNavbarTitle()

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el))

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag))

  next()
})

function changeNavbarTitle () {
  store.commit('setTitle', document.title)
}

export default router