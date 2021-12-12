<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="user-info" v-if="getUser(post.userId, 'name')">
        <a href="#" class="user-name">{{getUser(post.userId, 'name')}}</a>
        <a href="#">
          <img class="avatar-large" :src="getUser(post.userId, 'avatar')" alt />
        </a>
        <p class="desktop-only text-small">{{getUser(post.userId, 'postsCount')}} posts</p>
         <p class="desktop-only text-small">{{getUser(post.userId, 'threadsCount')}} threads</p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <post-editor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
          >
          </post-editor>
          <p v-else>{{post.text}}</p>
        </div>
        <a
          v-if="post.userId === $store.state.auth.authId"
          @click.prevent="toggleEditMode(post.id)"
          href="#" style="margin-left: auto;padding-left: 12px" class="link-unstyled" title="Make a change">
          <fa icon="pencil-alt" />
        </a>
      </div>
      <div class="post-date text-faded" >
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>
<script>
import PostEditor from './PostEditor.vue'
import { mapActions } from 'vuex'
export default {
  components: { PostEditor },
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      editing: null
    }
  },
  computed: {
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    ...mapActions('posts', ['updatePost']),
    getUser (userId, rtn) {
      return this.$store.getters['users/user'](userId) ? this.$store.getters['users/user'](userId)[rtn] : {}
    },
    toggleEditMode (id) {
      this.editing = id === this.editing ? null : id
    },
    handleUpdate (post) {
      this.updatePost(post)
      this.editing = null
    }
  }
}
</script>
<style scoped>
</style>
