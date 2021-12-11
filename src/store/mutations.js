import { upser, docToResource } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upser(state[resource], docToResource(item))
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  }
}
