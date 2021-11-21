<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <div class="post-list">
      <div v-for="postId in thread.posts"
          :key="postId"
          class="post"
      >
        <div class="user-info">
          <a href="#" class="user-name">{{getUser(getPost(postId, 'userId'), 'name')}}</a>
          <a href="#">
            <img class="avatar-large" :src="getUser(getPost(postId, 'userId'), 'avatar')" alt />
          </a>
          <p class="desktop-only text-small">107 posts</p>
        </div>

        <div class="post-content">
          <div>
           <p>{{getPost(postId, 'text')}}</p>
          </div>
          <a href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change">
            <i class="fa fa-pencil"></i>
          </a>
        </div>

        <div class="post-date text-faded">{{ getPost(postId, 'publishedAt') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import sourceData from '@/data.json/'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    }
  },
  methods: {
    getPost (postId, rtn) {
      return this.posts.find((p) => p.id === postId)[rtn]
    },
    getUser (userId, rtn) {
      return this.users.find((u) => u.id === userId)[rtn]
    }
  }
}
</script>
