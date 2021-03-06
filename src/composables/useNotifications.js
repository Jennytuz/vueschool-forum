import { reactive } from 'vue'

const notifications = reactive([])

const addNotification = ({ message, timeout = null }) => {
  const id = Math.random() + Date.now()
  notifications.push({
    id: id,
    message
  })
  if (timeout) {
    setTimeout(() => {
      this.removeNotification(id)
    }, timeout)
  }
}

const removeNotification = (id) => {
  const index = notifications.findIndex(i => i.id === id)
  notifications.splice(index, 1)
}

export default function useNotifications () {
  return {
    notifications,
    addNotification,
    removeNotification
  }
}
