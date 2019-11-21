const MyQueue = require('./my_queue');

(async ()=>{

  // 设置任务处理及间隔
  MyQueue.process(1000, (job, done)=>{
    console.log("start process job:", job.id, job.data);
    return done();
  });

  // 添加任务到队列
  while(1){
    console.log('========> add job to queue');
    MyQueue.createdJob({a: 1});
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, 1000);
    }))
  }
})();
