<template>
  <div>
    <h1>Not Found</h1>
    <router-link :to="{name: 'Home'}">Read some cool threads</router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  init () {
    console.log(this.$route.params)
  }
}
</script>
<style scoped>

</style>
