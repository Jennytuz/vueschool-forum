<template>
  <header class="header" id="header"
    v-click-outside="()=> mobileNavMenu = false"
    v-page-scroll="() => mobileNavMenu = false"
  >
    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/img/svg/vueschool-logo.svg" />
    </router-link>
    <div class="btn-hamburger" @click="mobileNavMenu = !mobileNavMenu">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>
    <div class="dropdown-menu-item">
                <a @click="$store.dispatch('auth/signOut'), $router.push({ name: 'Home' })" href="">Sign Out</a>
              </div>
    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavMenu}">
      <ul>
        <li class="navbar-user" v-if="authUser">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen" v-click-outside="() => userDropdownOpen = false">
            <img
              class="avatar-small"
              :src="authUser.avatar"
              alt
            />
            <span>
              {{authUser.name}}
              <img class="icon-profile" src="assets/img/svg/arrow-profile.svg" alt />
            </span>
          </a>
          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop': userDropdownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{name: 'Profile'}">View profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click="$store.dispatch('auth/signOut'), $router.push({ name: 'Home' })" href="">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{name: 'SignIn'}">Sign In</router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
        <li v-if="authUser" class="navbar-mobile-item">
          <router-link :to="{name: 'Profile'}">View profile</router-link>
        </li>
        <li v-if="authUser" class="navbar-mobile-item">
          <a @click="$store.dispatch('auth/signOut'), $router.push({ name: 'Home' })" href="">Sign Out</a>
        </li>
      </ul>

      <!-- <ul>
        <li class="navbar-item">
          <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  data () {
    return {
      userDropdownOpen: false,
      mobileNavMenu: false
    }
  },
  created () {
    this.$router.beforeEach((to, from) => {
      this.mobileNavMenu = false
    })
  }
}
</script>
