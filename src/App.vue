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
export default {
  components: { TheNavBar },
  name: 'App'
}
</script>

<style>
  @import "assets/style.css"
</style>
