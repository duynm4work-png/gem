// Server-only question content and historical prices. Do not import into client components.
import content from './event-content.json' with {type:'json'};
import history from './price-history.json' with {type:'json'};
export {RULES} from './rules.mjs';
export const EVENTS = content.map((event, i) => ({
  ...event,
  text: event.bullets.join(' '),
  chart: history[i],
  execution: history[i].at(-2).close,
  reveal: history[i].at(-1).close
}));
