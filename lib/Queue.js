class Queue {
  constructor(){
    this.queue = [];      // 任务队列
    this.increaseId = 0;  // 自增ID

    this.working = false;
    this.current = 0;
    this.total = 0;
    this.exception = 0;             //异常状态 0：无异常 -1 HTTP请求异常
  }

  init(){
    console.log('init')
  }

  async createdJob(jobData){
    if( jobData instanceof Array){
      for (const obj of jobData) {
        this.queue.push({
          id: this.increaseId++,
          data: obj
        });
      }
    }else{
      this.queue.push({
        id: this.increaseId++,
        data: jobData
      });
    }
    // 添加任务是，如果不在工作状态，则重置任务状态参数
    if(!this.working){
      this.working = true;
      this.exception = 0; 
      this.current = 0;
      this.total = this.queue.length;
      
      // 如果不在工作则添加任务时触发任务执行
      this.process();
    }

    // console.log('成功添加任务到队列，目前任务数：', this.queue.length);
  }

  /**
   * 
   * @param {number} timeout    任务间隔   default 500ms
   * @param {function} callback 回调函数 
   */
  async process(timeout, callback){
    callback = arguments[arguments.length-1] || this.callback;
    timeout = arguments[arguments.length-2] || this.timeout || 500;
    if(!callback){
      return 0;
    }
    
    this.callback = callback;
    this.timeout = timeout;

    if(!this.queue.length){
      // 队列空则结束
      console.log('all download file end');
      this.finish();
      return true;
    }
    await (new Promise(res=>{
      setTimeout(()=>{
        res();
      }, timeout)
    }))

    let queue = this.queue.shift();
    const result = await callback(queue, this.done);
    if(result){
      this.current++;
      this.process(timeout, callback);
    }
    return true;
  }

  async finish(){
    this.working = false;
  }

  /**
   * 结束
   * @param {bollean} result 是否正确完成任务
   */
  done(result = true){
    return result;
  }

  async status(){
    return {
      working: this.working,
      exception: this.exception, 
      current: this.current,
      total: this.total,
    }
  }
}

module.exports = Queue;