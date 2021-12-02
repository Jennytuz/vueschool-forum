<template>
  <div>
    <the-nav-bar />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheNavBar from './components/TheNavBar.vue'
import { mapActions } from 'vuex'
export default {
  components: { TheNavBar },
  name: 'App',
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<style>
  @import "assets/style.css"
</style>
