<template>
  <Transition name="fade-in">
    <div @click="toggleMenu()" v-show="isMenuOpen" id="sidebar-bg"></div>
  </Transition>

  <Transition name="fade-in-left">
    <div v-show="isMenuOpen" id="sidebar">
      <AppMenu />
    </div>
  </Transition>

  <div id="main" :class="{noMarginLeft: !isMenuOpen}">
    <div id="navbar">
      <span @click="toggleMenu()" class="material-icons">menu</span>
      {{ $route.meta.title }}
    </div>

    <router-view v-slot="{ Component }">
      <Transition name="fade-in-fast" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </router-view>
  </div>

  <LoadingEffect />
</template>

<script>
/*          ,-.   -- Quạc quạc quạc
    ,      ( {o\    -- Cạc cạc cạc cạc
    {`"=,___) (`~
     \  ,_.-   )
~^~^~^`- ~^ ~^ '~^~^~^~
*/

import AppMenu from './components/AppMenu.vue'
import LoadingEffect from '@/components/LoadingEffect.vue'
import store from '@/assets/js/store'

export default {
  name: 'App',

  components: {
    AppMenu,
    LoadingEffect
  },

  created () {
    if (!this.data.isLogin && location.pathname !== '/login' && location.pathname !== '/register') {
      store.set('redirect', location.pathname)
      this.$router.push('/login')
    }

    if (innerWidth > 768) {
      this.isMenuOpen = true
    }

    window.addEventListener('resize', () => {
      if (innerWidth > 768) {
        this.isMenuOpen = true
      } else {
        this.isMenuOpen = false
      }
    })
    
    sessionStorage.clear()
  },

  data () {
    return {
      isMenuOpen: false,
      data: store.getAll()
    }
  },

  watch: {
    $route: {
      immediate: true,

      // Change title when route changes
      handler(to) {
        document.title = to.meta.title || 'MTLKMS'
        
        if (innerWidth < 768) {
          this.isMenuOpen = false
        }
      }
    }
  },

  methods: {
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>

<style>
/* --------------------------------------------------- */
/* Custom                                              */
/* --------------------------------------------------- */

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
 
::-webkit-scrollbar-thumb {
  background: #ff907f50;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ff907f80;
}

/* Disable select */
.material-icons {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

body {
  font-family: 'Mali', sans-serif;
  font-size: 15px;
  padding: 0;
  margin: 0;
}

input {
  font-family: 'Mali', sans-serif;
}

hr {
  border: none;
  border-top: 1px solid #eee;
}

/* --------------------------------------------------- */
/* Layout                                              */
/* --------------------------------------------------- */

#sidebar {
  width: 300px;
  max-width: 85%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: .5rem;
  box-sizing: border-box;
  z-index: 25;
  background: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid #eee;
}

#main {
  position: relative;
  transition: margin-left 0.5s;
}

#navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  padding: .25rem;
  margin: 0;
  margin-bottom: 1rem;
  background: #ffffffaa;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  backdrop-filter: blur(3px);
  z-index: 20;
}

#navbar span {
  margin-right: .25rem;
  border-radius: 50%;
  padding: .75rem;
  transition: background-color .5s;
}

#navbar span:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}

@media screen and (max-width: 768px) {
  #sidebar {
    width: 350px;
  }

  #sidebar-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    z-index: 21;
  }
}

@media screen and (min-width: 768px) {
  #main {
    margin-left: 300px;
  }

  .noMarginLeft {
    margin-left: 0 !important;
  }
}

/* --------------------------------------------------- */
/* Animation                                           */
/* --------------------------------------------------- */

.fade-in-left-enter-active,
.fade-in-left-leave-active {
  transition: all 0.5s;
}

.fade-in-left-enter-from,
.fade-in-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.5s;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

.fade-in-fast-enter-active,
.fade-in-fast-leave-active {
  transition: all .25s;
}

.fade-in-fast-enter-from,
.fade-in-fast-leave-to {
  opacity: 0;
}

/* --------------------------------------------------- */
/* Form                                                */
/* --------------------------------------------------- */

.input {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  padding-right: 1rem;
  background-color: #ff907f10;
  border-radius: .25rem;
}

.input span {
  display: block;
  color: #ff907f;
  padding-left: .75rem;
}

.input p {
  position: absolute;
  top: 1px;
  left: 2.75rem;
  width: 6rem;
  margin-right: 1rem;
  color: #333;
  font-family: 'Mali', sans-serif;
  font-size: 13px;
  opacity: 0;
  transition: opacity .5s, margin-left .5s;
  box-sizing: border-box;
  text-align: right;
}

.input input {
  display: block;
  width: 100%;
  padding: .75rem;
  padding-right: 7rem;
  padding-left: .75rem;
  box-sizing: border-box;
  outline: none;
  border: none;
  background-color: transparent;
  color: #333;
  opacity: .8;
  transition: opacity .5s;
  font-family: 'Mali', sans-serif;
  font-size: 13px;
}

.input input:focus {
  opacity: 1;
}

.input input:focus ~ span {
  opacity: 1;
  background-color: #333;
}

.input input::placeholder {
  color: #333;
  opacity: .75;
  font-family: 'Mali', sans-serif;
  font-size: 13px;
}

.input input:not(:placeholder-shown) + p {
  margin-left: calc(100% - 10rem);
  text-align: right;
  opacity: .5;
}

textarea {
  position: relative;
  font-family: 'Mali', sans-serif;
  box-sizing: border-box;
  width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: .25rem;
  resize: none;
  border: 1px solid #ff907f;
  outline: none;
}

/* --------------------------------------------------- */
/* Button                                              */
/* --------------------------------------------------- */

.btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .75rem 1.75rem;
  margin: 1rem 0;
  border: none;
  border-radius: .25rem;
  cursor: pointer;
  font-family: 'Mali', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  text-decoration: none;
}

.btn-primary {
  background-color: #ff907f10;
  color: #e6705d;
  box-shadow: .25rem .25rem .5rem #ff907f30;
  transition: background-color .5s, color .5s;
  transition-delay: .5s;
  border: 1px solid #ff907f30;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: calc(100% - 2px);
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #ff907f;
  border-radius: .25rem;
  overflow: hidden;
  transition: left .5s, width .5s;
}

.btn-primary:hover {
  background-color: #ff907f;
  color: #fff;
}

.btn-primary:hover::before {
  left: 0;
  width: 100%;
}

.btn:active {
  top: 1px;
}

/* --------------------------------------------------- */
/* Breadcrumb                                          */
/* --------------------------------------------------- */

.breadcrumb {
  position: relative;
  padding: .75rem 1.75rem;
  border-radius: .25rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 3rem;
}

.breadcrumb a {
  text-decoration: none !important;
  padding-left: .5rem;
}

.breadcrumb a::after {
  content: ' / ';
  padding: .5rem;
}

.breadcrumb a:first-child {
  padding-left: 0;
}

.breadcrumb a:last-child::after {
  content: '';
}

.breadcrumb a:last-child {
  color: #e6705d;
}

/* --------------------------------------------------- */
/* Quote                                               */
/* --------------------------------------------------- */

.code {
  display: block;
  font-family: monospace;
  font-size: 13px;
  color: #333;
  background-color: #ff907f30;
  border-radius: .25rem;
  padding: 1rem;
  margin: .5rem auto;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: scroll;
}

.quote {
  display: block;
  color: #222;
  background-color: #ff907f10;
  border-radius: 0 .25rem .25rem 0;
  padding: 1rem;
  margin: .5rem auto;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: scroll;
  border-left: 1px solid #ff907f;
}

/* --------------------------------------------------- */
/* Custom class                                        */
/* --------------------------------------------------- */

.container {
  position: relative;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.container-sm {
  max-width: 540px;
}

.container-md {
  max-width: 960px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.avatar-lg {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.avatar-xl {
  width: 250px;
  height: 250px;
  border-radius: 50%;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.d-block {
  display: block;
}

.d-flex {
  display: flex;
}

.justify-content-center {
  justify-content: center;
}

.justify-space-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.align-items-center {
  align-items: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mr-1 {
  margin-right: .25rem;
}

.mr-2 {
  margin-right: .5rem;
}

.mr-3 {
  margin-right: 1rem;
}

.mr-4 {
  margin-right: 2rem;
}

.ml-1 {
  margin-left: .25rem;
}

.ml-2 {
  margin-left: .5rem;
}

.ml-3 {
  margin-left: 1rem;
}

.ml-4 {
  margin-left: 2rem;
}

.mb-1 {
  margin-bottom: .25rem;
}

.mb-2 {
  margin-bottom: .5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 2rem;
}

.mt-1 {
  margin-top: .25rem;
}

.mt-2 {
  margin-top: .5rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-4 {
  margin-top: 2rem;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-secondary {
  color: #6c757d;
}

</style>