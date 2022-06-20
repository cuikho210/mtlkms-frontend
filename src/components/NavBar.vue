<template>
<div id="navbar">
    <span @click="$emit('toggleMenu')" class="material-icons">menu</span>
    <p>{{ title }}</p>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',

  data () {
    return {
        
    }
  },

  computed: {
    ...mapState(['title'])
  }
}
</script>

<style scoped>
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
</style>