<template>
  <div class="notifications">
    <div
      class="notification"
      v-for="notification in notifications"
      :key="notification.id"
    >
      <span>{{notification.message}}</span>
      <button @click="removeNotification(notification.id)">X</button>
    </div>
  </div>
</template>

<script>
import useNotifications from '@/composables/useNotifications'

export default {
  setup () {
    const { notifications, removeNotification } = useNotifications()
    return { notifications, removeNotification }
  }
}
</script>
