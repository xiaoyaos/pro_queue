const Queue = require('../index');
const testQueue = Queue.newQueue('test');

(async ()=>{
  
  testQueue.createdJob({a: 'test'});

  testQueue.process(500, async (job, done)=>{
    console.log(`\r\nstart queue test process job:`, job.id, job.data);
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 5000);
    }))
    console.log(`\r\nend queue test process job:`, job.id, job.data);
    return done();
  }, false);

  // 添加任务到队列
  let count = 0;
  while(count < 10){
    count++;
    console.log('========> add job to queue test');
    testQueue.createdJob({a: 1});
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 100);
    }))
  }
})();
