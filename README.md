很多项目可能都会涉及到任务队列来进行任务处理和维护的，那么需要使用到redis或者第三方库（使用redis）来实现任务队列，甚至需要控制并发量，但是对于saas部署来说使用redis可能会比较麻烦和成本提升，那么我们是否可以直接基于程序来使用内存进行任务队列管理，有兴趣可以了解一下这个包：[pro_queue github地址](https://github.com/xiaoyaos/pro_queue "pro_queue")

# 介绍
该包是借鉴[bee-queue github地址](https://github.com/bee-queue/bee-queue "bee_queue")库的外部接口规范来对外统一提供任务的创建和执行（设置任务执行相关的数据【间隔、并发、任务处理等】），该包已经支持同时多任务队列管理且处理任务。

## 使用
```js
// 创建新的队列
const Queue = require('../index');
const testQueue = Queue.newQueue('test');

testQueue.createdJob({a: 'test'});

// test队列设置任务处理及间隔
testQueue.process(1000, (job, done)=>{
  console.log(`\r\nstart queue test process job:`, job.id, job.data);
  return done();
}, true);
testQueue.createdJob({a: 'test'});
```
关于异步和同步执行队列使用详情请参考根目录下test目录下源码

# API
## createdJob(any)

name | type |  Description  
-|-|-
obj | object | 需要添加的任务数据可以使任意类型数据 |

## process(timeout, callback, sync)

name | type |  Description  
-|-|-
timeout | number | 间隔时间，如果是同步执行，目前忽略间隔参数 |
callback | Function | 具体任务数据处理逻辑 |
sync | boolean | 是否同步执行，默认异步，按照时间间隔执行 |

## 待实现功能计划

### 任务失败重试，可设置重试次数
### 并发数量
### 任务执行结果时间
succeeded：任务成功执行

retrying：任务失败需要重新尝试，且剩余尝试次数

failed：任务失败，且没有重试次数

progress：

### 队列数据持久化
防止程序中断或异常终止时重启程序，队列数据丢失