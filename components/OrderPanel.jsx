'use client';
import {useState} from 'react';
import {TrendingUp, TrendingDown, Minus, Plus, LockKeyhole, ShieldCheck, Radio} from 'lucide-react';
const money = v => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2}).format(v/100);
const count = v => new Intl.NumberFormat('vi-VN').format(v);
export default function OrderPanel({state:s, remaining, busy, online, onConfirm}) {
  const [choice, setChoice] = useState(null), [draft, setDraft] = useState('');
  const me = s.me, price = s.event.execution;
  const buyingPower = me ? Math.floor(me.cash / price) : 0;
  const quantityMode = s.rules.orderMode === 'quantity';
  const locked = !!me?.choice, action = me?.choice || choice;
  const max = action === 'BUY' ? buyingPower : me?.shares || 0;
  const quantity = action === 'HOLD' ? 0 : locked ? me.choiceQuantity :
    quantityMode ? (draft === '' ? NaN : Number(draft)) : max;
  const valid = action === 'HOLD' || !!action && Number.isSafeInteger(quantity) && quantity > 0 && quantity <= max;
  const disabled = busy || locked || remaining === 0 || !online;
  const value = valid ? quantity * price : 0;
  const nextCash = me ? me.cash + (action === 'BUY' ? -value : action === 'SELL' ? value : 0) : 0;
  const nextShares = me ? me.shares + (action === 'BUY' ? quantity : action === 'SELL' ? -quantity : 0) : 0;
  function choose(d) {
    setChoice(d);
    const limit = d === 'BUY' ? buyingPower : me.shares;
    setDraft(d === 'HOLD' || !limit ? '' : String(Math.max(1, Math.floor(limit / 4))));
  }
  function step(n) {setDraft(String(Math.min(max, Math.max(1, (Number(draft) || 0) + n))));}
  return <section className="panel decision-panel">
    <div className="section-head"><h3>{me ? 'Quyết định của bạn' : 'Đang nhận quyết định'}</h3>
      <span className="muted"><LockKeyhole size={14}/> {s.locked} / {s.count} đã chốt</span></div>
    <div className="participation-track" aria-hidden="true"><i style={{width:(s.count?s.locked/s.count*100:0)+'%'}}/></div>
    {me ? <>
      <div className="order-balance"><span>Tiền mặt <b>{money(me.cash)}</b></span><span>Đang giữ <b>{count(me.shares)} CP</b></span></div>
      <div className="decisions">{[['BUY', quantityMode?'Chọn số cổ mua':'Mua tối đa', TrendingUp], ['HOLD','Giữ vị thế',Minus], ['SELL', quantityMode?'Chọn số cổ bán':'Bán toàn bộ',TrendingDown]].map(([d,txt,Icon]) =>
        <button key={d} className={d.toLowerCase()+' '+(action===d?'selected':'')} aria-pressed={action===d}
          disabled={disabled || d==='BUY'&&buyingPower===0 || d==='SELL'&&me.shares===0}
          onClick={()=>choose(d)}><Icon size={24}/><b>{d}</b><span>{txt}</span></button>)}</div>
      {action && action !== 'HOLD' && quantityMode && !locked && <div className="quantity-editor">
        <div className="quantity-label"><label htmlFor="order-quantity">Số cổ phiếu {action==='BUY'?'mua':'bán'}</label>
          <span>Tối đa {count(max)} CP</span></div>
        <div className="quantity-control"><button className="secondary" aria-label="Giảm một cổ phiếu" disabled={disabled||Number(draft)<=1} onClick={()=>step(-1)}><Minus size={18}/></button>
          <input id="order-quantity" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={draft}
            aria-invalid={draft!==''&&!valid} aria-describedby="quantity-help" disabled={disabled}
            onChange={ev=>{if(/^\d{0,15}$/.test(ev.target.value))setDraft(ev.target.value);}}
            onKeyDown={ev=>{if(ev.key==='ArrowUp'){ev.preventDefault();step(1);}if(ev.key==='ArrowDown'){ev.preventDefault();step(-1);}}}/>
          <button className="secondary" aria-label="Tăng một cổ phiếu" disabled={disabled||Number(draft)>=max} onClick={()=>step(1)}><Plus size={18}/></button></div>
        <div className="quantity-presets">{[25,50,75,100].map(percent=><button key={percent} className={Number(draft)===Math.max(1,Math.floor(max*percent/100))?'active':''}
          disabled={disabled||max===0} onClick={()=>setDraft(String(Math.max(1,Math.floor(max*percent/100))))}>{percent===100?'Tối đa':percent+'%'}</button>)}</div>
        <p id="quantity-help" className={'small-note '+(draft!==''&&!valid?'red':'')}>{draft!==''&&!valid?'Nhập số nguyên từ 1 đến '+count(max)+'.':
          'Mỗi cổ '+money(price)+'. Có thể nhập số lượng hoặc chọn nhanh theo mức tối đa.'}</p>
      </div>}
      {action && valid && <div className="order-preview" aria-label="Xem trước giao dịch">
        <div><span>{action==='BUY'?'Số tiền mua':action==='SELL'?'Số tiền thu về':'Không giao dịch'}</span><strong>{money(value)}</strong></div>
        <div><span>Tiền mặt sau lệnh</span><b>{money(nextCash)}</b></div>
        <div><span>Cổ phiếu sau lệnh</span><b>{count(nextShares)} CP</b></div>
      </div>}
      {locked ? <div className="locked" role="status"><ShieldCheck size={20}/><span>Đã chốt <b>{action}{action!=='HOLD'?' · '+count(me.choiceQuantity ?? max)+' CP':''}</b>. Chờ kết quả.</span></div> :
        <><button className="primary wide confirm-order" disabled={!valid||disabled} onClick={()=>onConfirm({decision:choice,quantity:choice==='HOLD'?0:quantity})}>
          <LockKeyhole size={16}/>{remaining===0?'Đang chốt kết quả…':!online?'Đang kết nối lại…':action?'Xác nhận '+action+(action!=='HOLD'&&valid?' · '+count(quantity)+' CP':''):'Chọn lệnh để xác nhận'}</button>
          <p className="small-note">Xác nhận một lần. Hết giờ chưa xác nhận: tự động HOLD.</p></>}
    </> : <div className="host-wait"><Radio size={28}/><p>Cả phòng có cùng {s.rules.seconds} giây.<br/>Kết quả tự mở khi hết thời gian.</p></div>}
  </section>;
}
