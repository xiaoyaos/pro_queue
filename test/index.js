const Queue = require('../index');
const testQueue = Queue.newQueue('test');

(async ()=>{
  
  // test设置任务处理及间隔

  testQueue.process(3000, async (job, done)=>{
    console.log(`\r\nstart queue test process job:`, job.id, job.data);
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 3000);
    }))
    return done();
  }, true);


  // 添加任务到队列
  let count = 0;
  while(count < 10){
    count++;
    console.log('========> add job to queue test');
    job = await testQueue.createdJob({a: 1});
    
    job.on("successed",(j, )=>{
      console.log("job", j.id, "success")
    })

    job.on("error",(j, )=>{
      console.log("job", j.id, "error")
    })
    
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 100);
    }))
  }
})();
