<template>
<div class="col-full">
  <div class="forum-list">
    <h2 class="list-title">
      <router-link :to="{name: 'Category', params: {id: categoryId}}">{{categoryName}}</router-link>
    </h2>
    <div v-for="forum in forums"
        :key="forum.id"
        class="forum-listing"
    >
      <div class="forum-details">
        <router-link :to="{name: 'Forum', params: {id: forum.id }}" class="text-xlarge">{{ forum.name }}</router-link>
        <p>{{ forum.description }}</p>
      </div>

      <div class="threads-count" >
        <p class="count">{{ forum.threads?.length || 'no'}}</p> {{forum.threads?.length > 1 ?'threads': 'thread'}}
      </div>

      <div class="last-thread">
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    forums: {
      type: Array,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true
    }
  },
  computed: {
  },
  init () {
    console.log(this.forums)
  }
}
</script>
