class ListNode {
  constructor(key, value) { //双向链表的单个节点
    this.key = key
    this.value = value
    this.next = null //指向后一个节点
    this.prev = null //指向前一个节点
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.hashTable = {} //存放键值对信息
    this.count = 0 //键值对数量
    this.dummyHead = new ListNode()
    this.dummyTail = new ListNode()
    this.dummyHead.next = this.dummyTail
    this.dummyTail.prev = this.dummyHead
  }

  get(key) {
    let node = this.hashTable[key]
    if (node == null) return -1
    this.moveToHead(node)
    console.log(node.value)
    return node.value
  }

  put(key, value) {
    let node = this.hashTable[key]
    if (node == null) {
      if (this.count == this.capacity) {
        this.removeLRUItem()
      }
      let newNode = new ListNode(key, value)
      this.hashTable[key] = newNode
      this.addToHead(newNode)
      this.count ++
      
    } else {
      node.value = value
      this.moveToHead(node)
    }
    console.log(key, this.hashTable[key].value)
  }

  moveToHead(node) {
    this.removeFromList(node)
    this.addToHead(node)
  }

  removeFromList(node) {
    let tempForPrev = node.prev
    let tempForNext = node.next
    tempForPrev.next = tempForNext
    tempForNext.prev = tempForPrev
  }

  addToHead(node) {
    node.prev = this.dummyHead
    node.next = this.dummyHead.next
    this.dummyHead.next.prev = node
    this.dummyHead.next = node
  }

  removeLRUItem() {
    let tail = this.popTail()
    delete this.hashTable[tail.key]
    this.count --
  }

  popTail() {
    let tailItem = this.dummyTail.prev
    this.removeFromList(tailItem)
    return tailItem
  }
}

var lRUCache = new LRUCache(2);
lRUCache.put(2, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(1, 1); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.put(4, 1);
lRUCache.get(2);    // 返回 -1 (未找到)