<template>
  <div class="col-full" v-if="asyncDataStatus_ready">
    <div class="flex-grid">
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
        <app-infinite-scroll
          @load="fetchUserPosts()"
          :done="user.posts.length === user.postsCount"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue'

export default {
  components: { PostList, UserProfileCard, UserProfileCardEditor, AppInfiniteScroll },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
    lastPostFetched () {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },
  props: {
    edit: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    fetchUserPosts () {
      return this.$store.dispatch('auth/fetchAuthUsersPosts', {
        startAfter: this.lastPostFetched
      })
    }
  },
  async created () {
    await this.fetchUserPosts()
    this.asyncDataStatus_fetched()
  }
}
</script>
