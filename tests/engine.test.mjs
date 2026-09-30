import test from 'node:test';
import assert from 'node:assert/strict';
import {makeRoom,addPlayer,act,view,trade,settle,auth} from '../lib/engine.mjs';
import {EVENTS,RULES} from '../lib/events.mjs';
const host='h'.repeat(64), player='p'.repeat(64);
function room(){const r=makeRoom('ABC234',host);addPlayer(r,'Duy',player);return r;}
function start(r,t=1000){act(r,host,{action:'start',round:-1,phase:'lobby'},t);}
test('partial BUY and SELL preserve the remainder, with exact cent arithmetic',()=>{
 assert.deepEqual(trade(800000,20,'BUY',10000,30),{cash:500000,shares:50});
 assert.deepEqual(trade(800000,20,'SELL',10000,7),{cash:870000,shares:13});
 assert.deepEqual(trade(1050,4,'BUY',400,2),{cash:250,shares:6});
 assert.deepEqual(trade(1050,4,'SELL',400,4),{cash:2650,shares:0});
 assert.deepEqual(trade(20,4,'HOLD',400,0),{cash:20,shares:4});
});
test('invalid quantities, overdraft, shorts, unsafe totals and fake HOLD are rejected',()=>{
 for(const q of [undefined,null,0,-1,1.1,'2',NaN,Infinity,Number.MAX_SAFE_INTEGER])
   assert.throws(()=>trade(1000,10,'BUY',123,q));
 assert.throws(()=>trade(1000,10,'BUY',123,9));
 assert.throws(()=>trade(1000,10,'SELL',123,11));
 assert.throws(()=>trade(1000,10,'HOLD',123,2));
 assert.throws(()=>trade(Number.MAX_SAFE_INTEGER,1,'SELL',123,1));
});
test('500 varied transactions conserve execution-price wealth and leave non-negative holdings',()=>{
 for(let i=1;i<=500;i++){
  const cash=i*17053+999, shares=i%47, price=i%179+1;
  const quantity=Math.floor(cash/price)%(i+1);
  if(quantity){
   const r=trade(cash,shares,'BUY',price,quantity);
   assert.equal(BigInt(r.cash)+BigInt(r.shares)*BigInt(price),BigInt(cash)+BigInt(shares)*BigInt(price));
   assert.ok(r.cash>=0&&r.shares>=shares);
   assert.deepEqual(trade(r.cash,r.shares,'SELL',price,quantity),{cash,shares});
  }
 }
});
test('all 9 datasets agree on event date, execution price and next-session outcome',()=>{
 assert.equal(EVENTS.length,9);
 for(const e of EVENTS){
  assert.equal(e.chart.length,11);
  assert.equal(e.chart.at(-2).date,e.date);
  assert.equal(e.chart.at(-2).close,e.execution);
  assert.equal(e.chart.at(-1).date,e.revealDate);
  assert.equal(e.chart.at(-1).close,e.reveal);
  assert.equal(new Set(e.chart.map(p=>p.date)).size,e.chart.length);
  e.chart.forEach((p,i)=>{assert.ok(Number.isSafeInteger(p.close)&&p.close>0);if(i)assert.ok(p.date>e.chart[i-1].date);});
 }
 assert.equal(EVENTS[4].reveal,5863);
 assert.equal(EVENTS[6].execution,3486);
 assert.equal(EVENTS[7].execution,2409);
 assert.ok(EVENTS[6].bullets.some(s=>s.includes('2,5 triệu')));
});
test('server filters future chart points, outcomes, other quantities and credentials',()=>{
 const r=room();start(r);act(r,player,{action:'decide',round:0,decision:'BUY',quantity:57},1100);
 const v=view(r,host,1200);
 assert.equal(v.event.reveal,undefined);assert.equal(v.event.revealDate,undefined);assert.equal(v.event.lesson,undefined);
 assert.equal(v.event.chart.length,10);assert.equal(v.event.chart.at(-1).date,EVENTS[0].date);
 assert.equal(v.players[0].decision,null);assert.equal(v.players[0].quantity,null);
 assert.equal(JSON.stringify(v).includes(r.host),false);
 assert.equal(view(r,player).me.choiceQuantity,57);
 // Poison every unrevealed value: the decision-phase response must remain identical.
 const poisoned=structuredClone(r);poisoned.events[0].reveal=99999999;
 poisoned.events[0].chart.at(-1).close=99999999;
 poisoned.events[0].revealDate='2099-12-31';
 poisoned.events[1].title='FUTURE_SECRET';
 assert.deepEqual(view(poisoned,host,1200),v);
 settle(r,61000);assert.equal(view(r,host).event.chart.length,11);
});
test('60-second deadline is exact, cannot settle early and default HOLD scores 60000 ms',()=>{
 const r=room();start(r);
 assert.equal(r.deadline-r.started,60000);
 assert.equal(settle(r,60999),false);assert.equal(settle(r,61000),true);
 const p=r.players[0];assert.equal(p.snapshots[0].decision,'HOLD');
 assert.equal(p.snapshots[0].quantity,0);assert.equal(p.snapshots[0].auto,true);
 assert.equal(p.cash,RULES.cash);assert.equal(p.shares,RULES.shares);assert.equal(p.totalMs,60000);
 assert.equal(settle(r,62000),false);assert.equal(p.snapshots.length,1);
});
test('last-millisecond orders succeed; at deadline orders are late; unconfirmed drafts do nothing',()=>{
 const r=room();start(r);
 act(r,player,{action:'decide',round:0,decision:'SELL',quantity:13},60999);
 settle(r,61000);assert.equal(r.players[0].snapshots[0].quantity,13);
 const late=room();start(late);assert.throws(()=>act(late,player,{action:'decide',round:0,decision:'BUY',quantity:1},61000));
 assert.equal(late.players[0].snapshots[0].decision,'HOLD');
});
test('validation happens on confirmation; reject cannot consume the only order',()=>{
 const r=room();start(r);
 for(const q of [undefined,0,0.5,100000000])assert.throws(()=>act(r,player,{action:'decide',round:0,decision:'BUY',quantity:q},1100));
 assert.equal(Object.keys(r.decisions).length,0);
 act(r,player,{action:'decide',round:0,decision:'BUY',quantity:91},1200);
 assert.equal(r.players[0].cash,RULES.cash);assert.equal(r.players[0].shares,RULES.shares);
 assert.throws(()=>act(r,player,{action:'decide',round:0,decision:'SELL',quantity:1},1300));
 assert.throws(()=>act(r,host,{action:'decide',round:0,decision:'BUY',quantity:1},1300));
 assert.throws(()=>act(r,player,{action:'next'},1300));
 assert.throws(()=>auth(r,'fake'));
});
test('50 seats, unique normalized names, no late join',()=>{
 const r=makeRoom('ABC234',host);for(let i=0;i<50;i++)addPlayer(r,'p'+i,String(i));
 assert.throws(()=>addPlayer(r,'extra','z'));
 const a=room();assert.throws(()=>addPlayer(a,'duy','x'));start(a);assert.throws(()=>addPlayer(a,'Late','x'));
});
test('nine rounds match an independent integer oracle including all between-event gaps',()=>{
 const r=room();let t=1000, cash=BigInt(RULES.cash), shares=BigInt(RULES.shares);start(r,t);
 const choices=[['BUY',1000],['SELL',500],['HOLD',0],['BUY',233],['SELL',100],['BUY',300],['SELL',1000],['BUY',50],['HOLD',0]];
 for(let i=0;i<9;i++){
  const [decision,quantity]=choices[i], price=BigInt(EVENTS[i].execution);
  act(r,player,{action:'decide',round:i,decision,quantity},t+750);
  if(decision==='BUY'){cash-=BigInt(quantity)*price;shares+=BigInt(quantity);}
  if(decision==='SELL'){cash+=BigInt(quantity)*price;shares-=BigInt(quantity);}
  settle(r,t+60000);
  const snap=r.players[0].snapshots[i];
  assert.equal(BigInt(snap.cash_after),cash);assert.equal(BigInt(snap.shares_after),shares);
  assert.equal(BigInt(snap.portfolio_value_after),cash+shares*BigInt(EVENTS[i].reveal));
  const previous=i?r.players[0].snapshots[i-1].portfolio_value_after:RULES.cash+RULES.shares*RULES.reference;
  assert.equal(snap.portfolio_value_after-previous,snap.gap_pnl+snap.event_pnl);
  assert.equal(snap.quantity,quantity);assert.equal(snap.trade_value,quantity*EVENTS[i].execution);
  t+=61000;act(r,host,{action:'next',round:i,phase:'reveal'},t);
 }
 assert.equal(r.phase,'finished');assert.equal(r.players[0].totalMs,6750);
 assert.equal(view(r,host).replays[0].snapshots.length,9);assert.equal(view(r,player).replays,null);
});
test('duplicate or stale host command cannot advance twice',()=>{
 const r=room();start(r);settle(r,61000);
 const cmd={action:'next',round:0,phase:'reveal'};act(r,host,cmd,62000);assert.throws(()=>act(r,host,cmd,62001));assert.equal(r.round,1);
 assert.throws(()=>act(r,player,{action:'decide',round:0,decision:'BUY',quantity:1},63000));
});
test('ties use response time then shared rank; scaling preserves original allocation',()=>{
 const r=room();addPlayer(r,'B','b');start(r);
 act(r,player,{action:'decide',round:0,decision:'HOLD',quantity:0},1500);
 act(r,'b',{action:'decide',round:0,decision:'HOLD',quantity:0},2000);settle(r,61000);
 assert.equal(view(r,host).players[0].name,'Duy');r.players[1].totalMs=500;
 assert.deepEqual(view(r,host).players.map(p=>p.rank),[1,1]);
 assert.equal(RULES.cash/1000000,RULES.shares/200);
});
test('legacy rooms keep old 20-second, max-size orders and room snapshots stay independent',()=>{
 const r=room();delete r.rules.orderMode;r.rules.seconds=20;r.players[0].cash=1050;r.players[0].shares=4;r.events[0].execution=400;
 start(r);act(r,player,{action:'decide',round:0,decision:'BUY'},1100);settle(r,21000);
 assert.equal(r.players[0].cash,250);assert.equal(r.players[0].shares,6);
 assert.notEqual(EVENTS[0].execution,400);
});
