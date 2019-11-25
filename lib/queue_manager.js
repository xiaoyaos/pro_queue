/**
 * 队列管理
 * 支持多任务，且个任务分离
 */
const Queue = require('./Queue');

class QueueManage{
  constructor(){
    this.queues = [];
  }

  /**
   * 创建新的队列
   * @param {*} name 
   */
  newQueue(name){
    // 检查队列列表中是否存在相同名的对队列
    const exist = this.queues.filter(x=>{return x.name == name});
    if(exist.length){
      throw new Error(`${name} queue is exist!`);
    }
    const queue = {
      name,
      queue: new Queue()
    };
    this.queues.push(queue);
    return queue.queue;
  }


}

module.exports = new QueueManage();