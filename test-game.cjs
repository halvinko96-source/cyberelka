const assert=require('node:assert/strict');
const {questions,clean,check}=require('./game.js');
assert.equal(questions.length,7);
assert.equal(new Set(questions.map(q=>q.id)).size,7);
for(const q of questions){
 assert.equal(q.answers.length,3);
 assert.ok(q.hint.length>10 && q.explanation.length>10);
 for(let i=0;i<q.answers.length;i++)assert.equal(check(q.id,i),i===q.correct);
 assert.equal(check(q.id,String(q.correct)),false);
 assert.equal(check(q.id,-1),false);
}
assert.deepEqual(clean(['gift','gift','unknown',null,4,'shield']),['gift','shield']);
for(const bad of [null,{},'gift',7])assert.deepEqual(clean(bad),[]);
assert.equal(check('unknown',0),false);
console.log('OK: 7 заданий, ответы, уникальные ID, очистка повреждённого прогресса.');
