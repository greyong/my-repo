var stack = require('../lib/stack');

var a = [1,2,3];

//stack.init(a);
stack.items=a;


stack.print();

stack.push(4);

stack.print();

console.log('pop(4)=>'+stack.pop());

stack.print();

console.log('peek(3)=>'+stack.peek());

stack.clear();

stack.print();