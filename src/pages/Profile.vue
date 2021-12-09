<template>
  <div class="col-full">
    <!-- <div class="flex-grid">
      <div class="col-3 push-top">
        <user-profile-card :user="user" v-if="!edit"/>
        <user-profile-card-editor :user="user" v-else />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{ user.username }}'s recent activity</span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />
        <post-list :posts="user.posts"/>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import PostList from '@/components/PostList'
// import UserProfileCard from '@/components/UserProfileCard.vue'
// import UserProfileCardEditor from '../components/UserProfileCardEditor.vue'
export default {
  computed: {
    ...mapGetters({ user: 'authUser' })
  },
  props: {
    edit: {
      type: Boolean,
      required: false
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
