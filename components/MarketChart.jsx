'use client';
import {useId, useState} from 'react';
import {BarChart3, LockKeyhole} from 'lucide-react';
const money = cents => '$' + (cents / 100).toFixed(2);
const date = value => value.slice(8, 10) + '/' + value.slice(5, 7);
export default function MarketChart({event, revealed}) {
  const id = 'price-' + useId().replace(/:/g, '');
  const [selected, setSelected] = useState(null);
  const points = event.chart || [];
  if (!points.length) return null;
  const current = points[Math.min(selected ?? points.length - 1, points.length - 1)];
  const W = 760, H = 300, left = 62, right = 25, top = 26, bottom = 246;
  const prices = points.map(p => p.close);
  const span = Math.max(20, Math.max(...prices) - Math.min(...prices));
  const min = Math.max(0, Math.min(...prices) - span * .22), max = Math.max(...prices) + span * .22;
  const xy = points.map((p, i) => ({x: left + i * (W - left - right) / Math.max(1, points.length - 1),
    y: bottom - (p.close - min) / (max - min) * (bottom - top)}));
  const decisionIndex = points.findIndex(p => p.date === event.date);
  const dxy = xy[decisionIndex];
  const past = points.filter(p => p.date <= event.date);
  const change = (event.execution / past[0].close - 1) * 100;
  const outcomeColor = event.reveal >= event.execution ? '#70cba1' : '#ef8090';
  const path = xy.map(p => p.x + ',' + p.y).join(' ');
  const ticks = [0, 1, 2, 3].map(i => ({y: top + (bottom - top) * i / 3, value: max - (max - min) * i / 3}));
  return <section className="market-chart" aria-label="Biểu đồ giá hỗ trợ quyết định">
    <div className="chart-heading">
      <div><span className="eyebrow"><BarChart3 size={15}/> BỐI CẢNH THỊ TRƯỜNG</span>
        <h2>NFLX <span>· Giá đóng cửa</span></h2></div>
      <span className={'trend-chip ' + (change >= 0 ? 'green' : 'red')}>{change >= 0 ? '+' : ''}{change.toFixed(2)}% trước tin</span>
    </div>
    <div className="chart-readout"><span>{date(current.date)}/{current.date.slice(0,4)}</span>
      <strong>{money(current.close)}</strong><small>{current.date === event.date ? 'Điểm quyết định' :
        current.date > event.date ? 'Kết quả phiên kế tiếp' : 'Giá lịch sử'}</small></div>
    <svg viewBox={'0 0 ' + W + ' ' + H} role="group" aria-label="Đường giá Netflix, USD điều chỉnh chia tách">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#70cba1" stopOpacity=".04"/><stop offset="100%" stopColor="#70cba1" stopOpacity="0"/></linearGradient></defs>
      {ticks.map((tick, i) => <g key={i}><line x1={left} x2={W-right} y1={tick.y} y2={tick.y} stroke="#2a3732" strokeDasharray="3 5"/>
        <text x={left-10} y={tick.y+5} textAnchor="end" className="axis-label">{money(tick.value)}</text></g>)}
      <polygon points={left + ',' + bottom + ' ' + path + ' ' + xy.at(-1).x + ',' + bottom} fill={'url(#' + id + ')'}/>
      <polyline className="price-line" points={path} stroke="#70cba1" fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {revealed && xy.length > 1 && <line x1={xy.at(-2).x} y1={xy.at(-2).y} x2={xy.at(-1).x} y2={xy.at(-1).y} stroke={outcomeColor} strokeWidth="3.5" className="outcome-line" pathLength="1"/>}
      {dxy && <line x1={dxy.x} x2={dxy.x} y1={top} y2={bottom} stroke="#d1b784" strokeDasharray="5 6" opacity=".75"/>}
      {xy.map((p, i) => <g key={points[i].date}>
        <circle cx={p.x} cy={p.y} r={i === decisionIndex ? 6 : 4} fill={points[i].date > event.date ? outcomeColor : i === decisionIndex ? '#d1b784' : '#70cba1'} stroke="#101716" strokeWidth="2"/>
        {i === decisionIndex && !revealed && <circle className="chart-halo" cx={p.x} cy={p.y} r="11" fill="none" stroke="#d1b784" opacity=".45"/>}
        <circle cx={p.x} cy={p.y} r="15" fill="transparent" tabIndex={0} role="button"
          aria-label={date(points[i].date) + ': ' + money(points[i].close)}
          onPointerEnter={() => setSelected(i)} onPointerLeave={() => setSelected(null)}
          onFocus={() => setSelected(i)} onBlur={() => setSelected(null)} onClick={() => setSelected(i)}
          onKeyDown={ev => {if (ev.key === 'Enter' || ev.key === ' ') {ev.preventDefault(); setSelected(i);}}}/>
        {(i % 2 === 0 || i === points.length - 1) && <text x={p.x} y={bottom+25} textAnchor="middle" className="axis-label">{date(points[i].date)}</text>}
      </g>)}
    </svg>
    <div className="chart-legend"><span><i className="legend-past"/> Giá đã ghi nhận</span><span><i className="legend-decision"/> Điểm quyết định</span>
      {revealed && <span><i style={{background:outcomeColor}}/> Phiên kết quả</span>}</div>
    <p className="chart-caption">{revealed ? 'Đã mở giá phiên kế tiếp. Lãi/lỗ được tính tại điểm kết quả này.' :
      <><LockKeyhole size={13}/> 10 phiên đến ngày {date(event.date)}. Giá sau sự kiện được mở khi hết giờ.</>}</p>
    <details className="chart-data"><summary>Xem bảng giá · USD điều chỉnh</summary>
      <div className="table-wrap"><table><thead><tr><th>Ngày</th><th>Giá đóng cửa</th><th>Mốc</th></tr></thead>
        <tbody>{points.map(p => <tr key={p.date}><td>{date(p.date)}/{p.date.slice(0,4)}</td><td>{money(p.close)}</td>
          <td>{p.date === event.date ? 'Quyết định' : p.date > event.date ? 'Kết quả' : 'Lịch sử'}</td></tr>)}</tbody></table></div></details>
  </section>;
}
