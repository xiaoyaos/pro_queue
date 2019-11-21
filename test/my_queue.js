/**
 * 自定义任务类继承Queue，可以添加自己的方法或属性
 */
const Queue = require('../index');

class MyQueue extends Queue{

}

module.exports = new MyQueue();