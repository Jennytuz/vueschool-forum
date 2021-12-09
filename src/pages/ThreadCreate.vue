<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>
    <thread-editor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty = false"/>
  </div>
</template>
<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.forumId)
    }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    async save ({ title, text }) {
      const thread = await this.createThread({
        text,
        title,
        forumId: this.forum.id
      })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forum.id } })
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId })
    this.asyncDataStatus_fetched()
  },
  beforeRouteLeave () {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!')
      if (!confirmed) return false
    }
  }
}
</script>
