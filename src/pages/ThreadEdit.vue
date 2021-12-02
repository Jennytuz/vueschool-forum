<template>
  <div class="col-full push-top" v-if="asyncDataStatus_ready">
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
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
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
    await this.fetchPost({ id: thread.posts[0] })
    this.asyncDataStatus_fetched()
  }
}
</script>
