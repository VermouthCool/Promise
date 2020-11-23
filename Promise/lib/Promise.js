'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Promise = Promise;
function Promise(excutor) {
    //构造函数
    var This = this;
    this.status = 'pending'; //代表初始状态
    this.data = undefined; //用来存储结果数据的 value或reason
    this.callBacks = [];
    function resolve(value) {
        if (This.status !== 'pending') {
            return;
        }
        This.status = 'resolved';
        This.data = value;
        if (This.callBacks.length) {
            setTimeout(function () {
                This.callBacks.forEach(function (cabs) {
                    cabs.onResolve(value);
                });
            });
        }
    }
    function reject(reason) {
        if (This.status !== 'pending') {
            return;
        }
        This.status = 'rejected';
        This.data = reason;
        if (This.callBacks.length) {
            setTimeout(function () {
                This.callBacks.forEach(function (cabs) {
                    cabs.onReject(reason);
                });
            });
        }
    }
    try {
        excutor(resolve, reject);
    } catch (err) {
        this.status = 'rejected';
        reject(err);
    }
}
//如果当前的Promise是pending状态 保存
//如果当前是resolve或是reject 异步执行
//最后返回一个新的Promise对象
Promise.prototype.then = function (_onResolve, _onReject) {
    var This = this;
    _onResolve = typeof _onResolve === 'function' ? _onResolve : function (value) {
        return value;
    };
    _onReject = typeof _onReject === 'function' ? _onReject : function (reason) {
        throw reason;
    };
    return new Promise(function (resolve, reject) {
        if (This.status == 'resolved') {
            setTimeout(function () {
                try {
                    var result = _onResolve(This.data);
                    if (result instanceof Promise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                        // try{
                        //     resolve(result);
                        // }catch(err){
                        //     reject(err)
                        // }
                    }
                } catch (err) {
                    jian = 15;
                    reject(err);
                }
            });
        } else if (This.status == 'rejected') {
            setTimeout(function () {
                try {
                    var result = _onReject(This.data);
                    if (result instanceof Promise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        } else {
            This.callBacks.push({
                onResolve: function onResolve(value) {
                    try {
                        var result = _onResolve(This.data);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onReject: function onReject(reason) {
                    try {
                        var result = _onReject(This.data);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        }
    });
};
window.Promise = Promise;
//catch就是then的一个语法糖
Promise.prototype.catch = function (onReject) {
    return this.then(undefined, onReject);
};
//value可能是Promise对象
Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        if (value instanceof Promise) {
            value.then(resolve, reject); //如果是Promise则最后的结果由这个Promise决定
        } else {
            resolve(value);
        }
    });
};
Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    });
};
Promise.all = function (promises) {
    var count = 0;
    var arr = [];
    return new Promise(function (resolve, reject) {
        promises.forEach(function (p, index) {
            p.then(function (value) {
                count++;
                arr[index] = value;
                if (count === promises.length) {
                    resolve();
                }
            }, reject);
        });
    });
};
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        promises.forEach(function (value) {
            value.then(resolve, reject);
        });
    });
};