(function (root) {
  var _ = function (data) {
    if (!(this instanceof _)) {
      return new _(data)
    }
    this.wrapper = data
  }

  //开启流式编程
  _.chain = function (source) {
    var instance = _(source) //特殊实例对象
    instance._chain = true
    return instance
  }
  _.prototype.end = function () {
    return this.wrapper
  }
  var module = function (instance, outcome) {
    if(instance._chain) {
      instance.wrapper = outcome
      return instance
    }
    return outcome
  }
  _.unique = function (source, callback) {
    const res = []
    for (var i = 0; i < source.length; i++) {
      const target = callback ? callback(source[i]) : source[i]
      if (res.indexOf(target) === -1) {
        res.push(target)
      }
    }
    return res
  }
  _.max = function (source) {
    source.push('9')
    return source
  }

  _.process = function (target) {
    const result = []
    for (var i in target) {
      result.push(i)
    }
    return result
  }

  var beforeHook = function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn(arr[i])
    }
  }

  // mixin
  _.mixin = function (target) {
    beforeHook(_.process(target), function (key) {
      const func = target[key]
      _.prototype[key] = function () {
        const decon = [this.wrapper]
        Array.prototype.push.apply(decon, arguments)
        return module(this, func.apply(this, decon))
      }
    })
  }
  _.mixin(_)

  root._ = _
})(this)
