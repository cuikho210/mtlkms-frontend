import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import accountRoutes from './accountRoutes'
import profileRoutes from './profileRoutes'
import studyDiaryRoutes from './studyDiaryRoutes'
import userRoutes from './userRoutes'
import guideRoutes from './guideRoutes'

import HomeView from '../views/HomeView.vue'

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

  ...accountRoutes,
  ...profileRoutes,
  ...studyDiaryRoutes,
  ...userRoutes,
  ...guideRoutes
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
    store.commit('setTitle', nearestWithTitle.meta.title)
  } else if(previousNearestWithMeta) {
    store.commit('setTitle', previousNearestWithMeta.meta.title)
  }

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

export default router