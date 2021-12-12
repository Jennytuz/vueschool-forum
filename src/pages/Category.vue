<template>
  <div class="col-full" v-if="asyncDataStatus_ready">
    <div class="col-full push-top">
      <h1>{{ category.name }}</h1>
    </div>
    <forum-list
      :forums="getForumsForCategory(category)"
      :category-name="category.name"
      :category-id="category.id"
    />
  </div>
</template>

<script>
import ForumList from '../components/ForumList.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  components: { ForumList },
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.items.find(category => category.id === this.id) || {}
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums']),
    getForumsForCategory (category) {
      return this.$store.state.forums.items.filter(forum => forum.categoryId === category.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>
