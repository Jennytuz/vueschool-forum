<template>
  <div class="col-full">
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
      return this.$store.state.categories.find(category => category.id === this.id)
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>
