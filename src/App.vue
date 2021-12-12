<template>
  <div>
    <the-nav-bar />
    <div class="container">
      <router-view v-show="showPage" @ready="onPageReady" :key="$route.path"/>
      <AppSpin v-show="!showPage" class="push-top"/>
    </div>
  </div>
</template>

<script>
import TheNavBar from './components/TheNavBar.vue'
import AppSpin from './components/AppSpin.vue'
import NPrpgress from 'nprogress'
import { mapActions } from 'vuex'
export default {
  components: { TheNavBar, AppSpin },
  name: 'App',
  methods: {
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NPrpgress.done()
    }
  },
  data () {
    return {
      showPage: false
    }
  },
  created () {
    this.fetchAuthUser()
    NPrpgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NPrpgress.start()
    })
  }
}
</script>

<style>
  @import "assets/style.css";
  @import "~nprogress/nprogress.css";
  #nprogress .bar {
    background-color: aqua;
  }
</style>
