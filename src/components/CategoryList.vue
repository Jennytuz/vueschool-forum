<template>
  <div class="col-full" v-if="categories">
    <forum-list
      v-for="category in categories"
      :key="category.id"
      :forums="getForumsForCategory(category)"
      :category-name="category.name"
      :category-id="category.id"
    />
  </div>
</template>
<script>
import ForumList from './ForumList.vue'

export default {
  components: { ForumList },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.items.filter(
        (forum) => forum.categoryId === category.id
      )
    }
  }
}
</script>
