const fs = require('fs');
const path = require('path');

class Queue {
  constructor(){
    this.queue = [];      // 任务队列
    this.queue_recover(); // 数据恢复
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

    // 添加数据后持久化所有数据
    this.persistence();

    // 添加任务是，如果不在工作状态，则重置任务状态参数
    if(!this.working){
      this.working = true;
      this.exception = 0; 
      this.current = 0;
      this.total = this.queue.length;
      
      // 如果不在工作则添加任务时触发任务执行
      this.process(this.timeout, this.callback, this.sync);
    }

    // console.log('成功添加任务到队列，目前任务数：', this.queue.length);
  }

  /**
   * 
   * @param {number} timeout    任务间隔   default 500ms
   * @param {function} callback 回调函数 
   * @param {boolean} callback 同步执行
   */
  async process(timeout, callback, sync = false){
    this.sync = sync || this.sync;
    this.callback = callback || this.callback;
    this.timeout = timeout || this.timeout || 100;

    if(!this.callback){
      return 0;
    }
    
    if(!this.queue.length){
      // 队列空则结束
      console.log('all task end');
      this.finish();
      return true;
    }

    let queue = this.queue.shift();
    let result;
    if(sync){
      result = await callback(queue, this.done);
      // 同步执行的任务分组调度，（检测队列剩余数，进行队列分组,减少任务数，增加每次任务强度）
      // await this.queueGroup();
    }else{
      await (new Promise(res=>{
        setTimeout(()=>{
          res();
        }, timeout)
      }))
      callback(queue, this.done);
    }

    this.current++;
    this.process(this.timeout, this.callback, this.sync);
    return true;
  }

  /**
   * 队列优化分组，多个任务按照既定大小合并重新分组
   */
  async queueGroup(){
    if(this.queue.length > 5){
      let currentQueue = this.queue.splice(0);
      let newQueue = [];
      let tempFileArr = []
      let count = 0;
      for (const q of currentQueue) {
        count++;
        if(q.data instanceof Array){
          newQueue.push(q.data);
          continue;
        }
        tempFileArr.push(q.data);
        if(count >= 10){
          newQueue.push(tempFileArr);
          tempFileArr = [];
          count = 0;
        }
      }
      if(tempFileArr.length){
        newQueue.push(tempFileArr);
      }
      // 将整理后的任务添加到queue前面
      for (const q of newQueue) {
        this.createdJob(q, -1);
      }
    }
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

  // 持久化
  async persistence(){
    const queueBuffer = Buffer.from(JSON.stringify(this.queue));

    const writeStream = fs.createWriteStream(path.join(__dirname, 'data.bak'));
    writeStream.write(queueBuffer);
    writeStream.end();
  }

  // 数据恢复
  async queue_recover(){
    return;
    const readStream = fs.createReadStream(path.join(__dirname, 'data.bak'));
    var queueBuffer = '';
    readStream.on('data', function(chunk) {console.log('string', chunk.toString())
      queueBuffer += chunk;
    });
   
    readStream.on('end',function(){
      console.log('string', queueBuffer.toString())
      if(queueBuffer === '') return;
      const queue = queueBuffer.toString();
      this.queue = JSON.parse(queue);console.log(this.queue)
    });

    readStream.on('error', function(err){
      console.log(err.stack);
    });
  }
}

module.exports = Queue;