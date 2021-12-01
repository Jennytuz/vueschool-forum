<template>
  <div class="col-full">
    <div class="col-full push-top">
      <h1>{{ category.name }}</h1>
    </div>
    <forum-list
      v-if="!!category"
      :forums="getForumsForCategory(category)"
      :category-name="category.name"
      :category-id="category.id"
    />
  </div>
</template>

<script>
import ForumList from '../components/ForumList.vue'
import { mapActions } from 'vuex'
export default {
  components: { ForumList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return this.$store.state.categories.find(category => category.id === this.id) || {}
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    this.fetchForums({ ids: category.forums })
  }
}
</script>
