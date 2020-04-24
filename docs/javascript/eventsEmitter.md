# 观察者模式

- 2020.04.24
### 简单的观察者模式

```js
class EventEmitter (){
    constructor(){
        this.maxListener = 20;
        this.observes = {};
    }

    on(name, fn){
        if(this.observes[name]){
            this.observes[name].push(fn);
            return this;
        }

        this.observes[name] = [fn];
        return this;
    }

    emit(name, ...args){
        this.observes[name].forEach(fn=> fn(...args));
        return this;
    }
}

let eventEmitter = new EventEmitter();

```

### 使用观察者模式实现

```js
function create(fn){
    let ret = false;
    return ({ next, complete, error }) => {
        function nextFn(...args){
            if (ret) {
                return ;
            }
            next(...args);
        }

        function completeFn(...args){
            complete(...args);
            ret = true;
        }

        function errorFn(...args){
            error(...args);
        }

        fn({
            next: nextFn,
            complete: completeFn,
            error: errorFn
        })

        return () => (ret = true);
    }
}

let observerable = create(observer => {
    setTimeout(()=>{
        observer.next(1);
    }, 1000);
    observer.next(2);
    observer.complete(3);
});

const subject = {
    next: value => {
        console.log(value);
    }
    complete: console.log,
    error: console.error
}

let unsubscribe = observerable(subject);// 2 3
```