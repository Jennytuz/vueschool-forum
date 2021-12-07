import { upser, findById, docToResource } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    if (resource === 'users') {
      console.log('setAuthUser信息')
    }
    upser(state[resource], docToResource(item))
  },
  setAuthId (state, id) {
    state.authId = id
  },
  setAuthUserUnsubscribe (state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe
  },
  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  },
  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
  appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
}

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    if (!resource) {
      console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed`)
      return
    }
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
