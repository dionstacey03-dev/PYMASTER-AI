const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../../src/pymaster_ai/static/learning-core.js');
const base={goal:'software',minutes:120,skill:'new',style:'examples',deadline:''};
test('all goal paths obey prerequisite ordering without duplicate lessons',()=>{
 for(const goal of Object.keys(core.goals)){
  const plan=core.buildRoadmap({...base,goal});assert.equal(new Set(plan.all).size,plan.all.length);
  for(const id of plan.all)for(const dependency of core.prerequisites[id])assert.ok(plan.all.indexOf(dependency)<plan.all.indexOf(id));
 }
});
test('weekly allocations honor small budgets and preserve learning order',()=>{
 for(const minutes of [15,30,120,1200]){
  const plan=core.buildRoadmap({...base,minutes});
  assert.equal(plan.weeks.flat().reduce((total,part)=>total+part.minutes,0),plan.totalMinutes);
  for(const week of plan.weeks)assert.ok(week.reduce((total,part)=>total+part.minutes,0)<=minutes);
  assert.deepEqual([...new Set(plan.weeks.flat().map(part=>part.id))],plan.remaining);
 }
});
test('completed lessons reduce the plan but do not renumber IDs',()=>{
 const plan=core.buildRoadmap(base,[0,1,999,'2']);assert.ok(!plan.remaining.includes(0));assert.ok(plan.remaining.includes(2));assert.equal(plan.all.length,30);
 const finished=core.buildRoadmap(base,Array.from({length:30},(_,i)=>i));assert.equal(finished.estimatedWeeks,0);
});
test('invalid input and cycles fail explicitly',()=>{
 for(const value of [{goal:'missing'},{goal:'__proto__'},{minutes:0},{minutes:NaN},{skill:'wizard'},{style:'none'},{deadline:'2026-02-30'},{deadline:'2001-01-01'}])assert.throws(()=>core.buildRoadmap({...base,...value},[],new Date('2026-01-01')));
 assert.throws(()=>core.orderTargets([0],[[1],[0]]),/cycle/);assert.throws(()=>core.orderTargets([31]),/Invalid lesson/);
});
test('deadlines are estimates with explicit short-target warning',()=>{
 const plan=core.buildRoadmap({...base,deadline:'2026-01-02'},[],new Date('2026-01-01'));assert.match(plan.deadlineWarning,/shorter/);
});
test('companion requires consent, valid retention and unexpired memory',()=>{
 const value={optIn:true,goal:'Learn functions',preference:'Small examples',retentionDays:7,updatedAt:1000};
 assert.equal(core.readCompanion({...value,optIn:false},1001),null);
 assert.equal(core.readCompanion(value,8*86400000),null);
 assert.equal(core.readCompanion({...value,retentionDays:999},1001),null);
 assert.equal(core.readCompanion({...value,goal:'x'.repeat(301)},1001),null);
 assert.equal(core.readCompanion(value,1001).goal,'Learn functions');
});
test('comparison answer keys and lesson links are valid',()=>{
 assert.equal(core.comparisons.length,8);
 for(const item of core.comparisons){assert.ok(item.answer>=0&&item.answer<item.options.length);assert.ok(item.lesson>=0&&item.lesson<30);assert.ok(item.mistake&&item.reason);}
});
