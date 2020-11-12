# 抽象表达
 1.是ES6的一项新的技术
 2.Promise是JS中解决异步编程的新方案  旧的方案是利用纯回调函数
# 具体表达
 1.Promise是一个构造函数
 2.从功能上Promise对象用来封装一个异步操作 并且获取其成功或者失败的返回值
```
var promise = new Promise(function(resolve,reject){ //这个函数是同步执行的  叫做执行器函数
    //开始时Promise的状态为 未确定的/初始的

    第一个状态为pending   可以转换为 resolve状态表示成功
    也可以转换为reject表示失败
    一个promise只能转换一次 无论失败还是成功都会有一个数据  成功的一般叫做 value  失败的一般叫reason
    想要转换状态  调用对应的函数

    setTimeout(function(){
        resolve('jian') //Promise状态为成功resolve 同时指定成功的value
    },1000)
})
promise.then(function(value){ //异步执行的成功的回调函数
    console.log(value) //此时会输出jian  表示成功实现了回调
})
promise.then()可以接受连个函数作为参数   第一个函数表示为成功的回调  第二个为失败的回调

```
# 为什么要使用Promise
 1.指定回调函数更加灵活
 2.可以在异步函数结束后  指定回调函数
 3.支持链式调用 可以解决回调地狱
    回调地狱是指一个调用一个