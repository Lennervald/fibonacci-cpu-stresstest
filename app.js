const express = require('express');
const app = express();

const bigInt = require('big-integer');
const asleep = require('asleep');

async function fib(n){
  let startTime = Date.now();
  let loopTime = Date.now();
  let a = bigInt(0), b = bigInt(1);

  while(n > 0) {
    let c = a.add(b);
    a = b;
    b = c;
    n--;
    // Pause while loop if more
    // then 10 ms has passed
    if (Date.now() - loopTime > 10){
      loopTime = Date.now();
      await asleep(1);
    }
  }

  let endTime = Date.now();
  return (endTime - startTime) + 'ms\n' + a.toString();
}

app.get('/fib/:fibnum', async (req, res) => {
  let n = req.params.fibnum;
  res.end(await fib(n));
});

app.listen(3000, function(){
  console.log('server running 3k');
});

function randInt(min, max) {
  return Math.floor(Math.random() * (1 + max - min)) + min;
}
// test cpu power by making several
// parallell req to fib()
let a = [], co = 0, start = Date.now(), howMany = 10;
while (a.length < howMany) {
  let obj = {n: randInt(1000, 100000)};
  a.push(obj);
  fib(obj.n).then((result) => {
    // obj.result = result;
    obj.timeTaken = Date.now() - start;
    co++;
    if (co == howMany) {
      console.log(
        'All done! ', Date.now() - start, ' ms \n',
        a.sort((objA, objB) => objA.timeTaken - objB.timeTaken)
      );
    }
  });
}
