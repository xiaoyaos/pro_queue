const Queue = require('../index');
const testQueue = Queue.newQueue('test');
const testQueue1 = Queue.newQueue('test1');

(async ()=>{
  
  // test设置任务处理及间隔
  testQueue.process(1000, (job, done)=>{
    console.log(`\r\nstart queue test process job:`, job.id, job.data);
    return done();
  });
  testQueue.createdJob({a: 'test'});
  

  testQueue1.createdJob({a: 'test1'});
  // test1设置任务处理及间隔
  testQueue1.process(1000, (job, done)=>{
    console.log(`\r\nstart queue test1 process job:`, job.id, job.data);
    return done();
  });

  // 添加任务到队列
  while(1){
    console.log('========> add job to queue test');
    testQueue.createdJob({a: 1});
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 1000);
    }))
  }
})();
