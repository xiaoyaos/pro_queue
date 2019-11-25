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
});
testQueue.createdJob({a: 'test'});
```