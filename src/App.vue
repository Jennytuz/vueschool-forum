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
    ...mapActions(['fetchUser'])
  },
  created () {
    console.log(this.$store.state.authId)
    console.log('----=====-')
    this.fetchUser(this.$store.state.authId)
  }
}
</script>

<style>
  @import "assets/style.css"
</style>
