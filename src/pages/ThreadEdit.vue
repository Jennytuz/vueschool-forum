<template>
  <div class="col-full push-top" v-if="thread && text">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <thread-editor @save="save" :title="thread.title" :text="text" @cancel="cancel"/>
  </div>
</template>
<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.id)
    },
    text () {
      const post = findById(this.$store.state.posts, this.thread.posts[0])
      return post ? post.text : ''
    }
  },
  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    async save ({ title, text }) {
      await this.updateThread({
        text,
        title,
        threadId: this.id
      })
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.id })
    this.fetchPost({ id: thread.posts[0] })
  }
}
</script>
