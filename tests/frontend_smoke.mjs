// Run with: node tests/frontend_smoke.mjs (Node is only needed for this test).
// These check rendering and state changes, not browser layout.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../app/static/script.js', import.meta.url), 'utf8');
const checks = [];
const requests = [];
const animation = [];
const listeners = new Map();
let reducedMotion = false;
let nextError = null;

class Element {
  constructor(name) {
    this.name = name; this.innerHTML = ''; this.style = {}; this.dataset = {};
    this.children = []; this.inert = false; this.isConnected = true;
    const classes = new Set();
    this.classList = {
      add: (...values) => values.forEach(value => { classes.add(value); if(name==='#curtains') animation.push('add:'+value); }),
      remove: (...values) => values.forEach(value => { classes.delete(value); if(name==='#curtains') animation.push('remove:'+value); }),
      contains: value => classes.has(value),
      toggle: (value, enabled) => enabled ? classes.add(value) : classes.delete(value),
    };
  }
  focus() {}
  append(child) { this.children.push(child); }
  remove() { this.isConnected = false; }
  setAttribute() {}
  closest() { return this; }
}
const elements = new Map();
const element = selector => {
  if (!elements.has(selector)) elements.set(selector, new Element(selector));
  return elements.get(selector);
};
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key,value) => values.set(key,value), removeItem: key => values.delete(key) };
};
const document = {
  documentElement: { dataset: {theme:'dark'}, lang:'en' },
  body: { style:{} }, activeElement:element('initial-focus'),
  querySelector(selector) {
    if (selector === '.modal') return element('#modal-root').innerHTML ? element('.modal') : null;
    if (selector.startsWith('.modal ')) return element('#modal-root').innerHTML ? element('modal-focus') : null;
    return element(selector);
  },
  querySelectorAll: () => [], createElement: tag => new Element(tag),
  addEventListener(type, callback) {
    if (!listeners.has(type)) listeners.set(type, []);
    listeners.get(type).push(callback);
  },
};
const future = new Date(Date.now() + 172800000).toISOString();
const end = new Date(Date.now() + 178200000).toISOString();
const movies = [
  {id:1,title:'Interstellar',description:'A journey beyond the stars.',genre:'Sci-Fi',duration_minutes:90,age_rating:'12+',is_active:true},
  {id:2,title:'Old film',description:'A cinema memory.',genre:'Drama',duration_minutes:90,age_rating:'12+',is_active:false},
];
const halls = [{id:1,name:'Hall A',capacity:3,is_active:true}];
const shows = [{id:1,movie_id:1,hall_id:1,starts_at:future,ends_at:end,status:'scheduled',ticket_price:'55.00'}];
const seats = [
  {id:1,hall_id:1,row_number:1,seat_number:1,is_active:true},
  {id:2,hall_id:1,row_number:1,seat_number:2,is_active:true},
  {id:3,hall_id:1,row_number:2,seat_number:1,is_active:false},
];
const users = [
  {id:1,full_name:'Cinema Customer',email:'customer@example.com',role:'Customer',is_active:true,created_at:new Date().toISOString()},
  {id:2,full_name:'Cinema Admin',email:'admin@example.com',role:'Admin',is_active:true,created_at:new Date().toISOString()},
];
const tickets = [{id:10,user_id:1,showtime_id:1,seat_id:2,status:'booked',price:'55.00',booked_at:new Date().toISOString(),cancelled_at:null}];
const paginate = items => ({items,total:items.length,page:1,page_size:100,total_pages:items.length?1:0});
const respond = (data,status=200) => new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
async function fetchApi(url, options={}) {
  const parsed = new URL(url,'http://cinema.test');
  const path = parsed.pathname.replace('/api/v1','');
  const method = options.method || 'GET';
  requests.push({path,method,options});
  if(nextError) { const error=nextError;nextError=null;return respond({detail:error.detail},error.status); }
  if(path==='/movies' && method==='GET') return respond(paginate(movies.filter(movie=>movie.is_active)));
  if(/^\/movies\/\d+$/.test(path)) return respond(movies.find(movie=>movie.id===Number(path.split('/')[2])));
  if(path==='/halls') return respond(halls);
  if(/^\/halls\/\d+\/seats$/.test(path)) return respond(seats);
  if(path==='/showtimes') return respond(paginate(shows.filter(show=>show.status==='scheduled')));
  if(/^\/showtimes\/\d+\/seats$/.test(path)) {
    const rows=[1,2].map(row=>({row_number:row,seats:seats.filter(seat=>seat.row_number===row).map(seat=>({
      ...seat,status:!seat.is_active?'unavailable':tickets.some(ticket=>ticket.seat_id===seat.id && ticket.showtime_id===1 && ticket.status==='booked')?'booked':'available',
    }))}));
    const statuses=rows.flatMap(row=>row.seats.map(seat=>seat.status));
    return respond({showtime_id:1,hall_id:1,hall_name:'Hall A',rows,summary:{total:3,available:statuses.filter(s=>s==='available').length,booked:statuses.filter(s=>s==='booked').length,unavailable:1}});
  }
  if(/^\/showtimes\/\d+$/.test(path)) return respond(shows.find(show=>show.id===Number(path.split('/')[2])));
  if(path==='/users') return respond(paginate(users));
  if(path==='/users/me') return respond(users[0]);
  if(path==='/tickets/my') return respond(paginate(tickets.filter(ticket=>!parsed.searchParams.get('status') || ticket.status===parsed.searchParams.get('status'))));
  if(path==='/tickets' && method==='POST') {
    const body=JSON.parse(options.body);
    if(tickets.some(ticket=>ticket.showtime_id===body.showtime_id && ticket.seat_id===body.seat_id && ticket.status==='booked')) return respond({detail:'Seat already booked'},409);
    const ticket={id:11,user_id:1,...body,price:'55.00',status:'booked',booked_at:new Date().toISOString()};
    tickets.push(ticket);return respond(ticket,201);
  }
  if(path==='/auth/login') return respond({access_token:'sample-token',token_type:'bearer'});
  if(/^\/tickets\/\d+\/cancel$/.test(path) && method==='POST') {
    const ticket=tickets.find(ticket=>ticket.id===Number(path.split('/')[2]));
    ticket.status='cancelled';ticket.cancelled_at=new Date().toISOString();
    return respond(ticket);
  }
  throw new Error(`Unmocked request: ${method} ${url}`);
}
const context = vm.createContext({
  document,location:{hash:'#/films'},window:{addEventListener(){},scrollTo(){}},
  localStorage:storage(),sessionStorage:storage(),URLSearchParams,Headers,
  FormData:globalThis.FormData || class FormData {},
  fetch:fetchApi,matchMedia:()=>({matches:reducedMotion}),requestAnimationFrame:callback=>callback(),
  setTimeout:callback=>{queueMicrotask(callback);return 1;},clearTimeout(){},console,
});
new vm.Script(source.replace(/\bstart\(\);\s*$/,'')).runInContext(context);
const run = code => vm.runInContext(code,context);
function checkMarkup(html) {
  assert.equal(typeof html,'string');
  assert(!/\bundefined\b|\bNaN\b/.test(html),'Unexpected missing data in rendered page');
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
  for(const match of html.matchAll(/\sfor="([^"]+)"/g)) assert(ids.includes(match[1]),`Label has no field: ${match[1]}`);
}
async function check(name,callback) { await callback();checks.push(name); }
async function click(dataset, classes=[]) {
  const target=new Element('button');target.dataset=dataset;
  classes.forEach(value=>target.classList.add(value));
  const event={target,preventDefault(){}};
  for(const callback of listeners.get('click') || []) await callback(event);
}

await check('translation keys and UTF-8',async()=>{
  assert.deepEqual(run('Object.keys(words.en).sort()').join(','),run('Object.keys(words.ru).sort()').join(','));
  assert.equal(run('words.ru.films'),'В кино');
  for(const value of run('Object.values(words.ru)')) assert(value.length>0);
});
await check('all public and signed-in pages in English and Russian',async()=>{
  for(const language of ['en','ru']) {
    run(`state.lang='${language}'`);
    checkMarkup(await run('filmsPage()'));
    checkMarkup(await run('schedulePage()'));
    checkMarkup(await run('moviePage(1)'));
    checkMarkup(await run('seatsPage(1)'));
    run(`state.user=${JSON.stringify(users[0])}`);
    checkMarkup(await run('ticketsPage()'));
    checkMarkup(await run('accountPage()'));
    run(`state.user=${JSON.stringify(users[1])}`);
    checkMarkup(await run('studioPage()'));
  }
});
await check('search, genre filters, and empty states',async()=>{
  run("state.lang='en';state.search='inter';state.genre='Sci-Fi'");
  assert(run('filmGrid()').includes('Interstellar'));
  run("state.search='not-a-film'");assert(run('filmGrid()').includes('No films found'));
  run("state.search='';state.genre='Drama'");assert(run('filmGrid()').includes('No films found'));
  run("state.genre=''");
});
await check('catalog content is escaped',async()=>{
  const html=run('posterMarkup({id:1,title:"<img src=x onerror=alert(1)>",genre:"<script>",age_rating:"12+"})');
  assert(!html.includes('<img src=x'));assert(html.includes('&lt;img'));
});
await check('available, booked, and unavailable seats',async()=>{
  const html=await run('seatsPage(1)');
  for(const status of ['available','booked','unavailable']) assert(html.includes(`seat ${status}`));
  assert(/data-seat="2"[^>]*disabled/.test(html));assert(/data-seat="3"[^>]*disabled/.test(html));
});
await check('archived films stay out of the public catalog',async()=>{
  shows.push({...shows[0],id:2,movie_id:2});
  tickets.push({...tickets[0],id:12,showtime_id:2,status:'cancelled'});
  run(`state.user=${JSON.stringify(users[0])};state.ticketStatus=''`);
  const html=await run('ticketsPage()');assert(html.includes('Old film'));
  assert.equal(run('state.movies.some(movie=>movie.id===2)'),false);
});
await check('sign-in and confirmation dialogs render',async()=>{
  for(const mode of ['login','signup']) {
    run(`openAuth('${mode}')`);checkMarkup(element('#modal-root').innerHTML);
    assert(element('#modal-root').innerHTML.includes('role="dialog"'));
    run('closeModal()');assert.equal(element('#main').inert,false);
  }
  run('cancelDialog(10)');assert(element('#modal-root').innerHTML.includes('data-confirm-cancel="10"'));run('closeModal()');
});
await check('booking submits only the selected showtime and seat',async()=>{
  run(`state.user=${JSON.stringify(users[0])};state.token='sample-token';state.lang='en'`);
  await run('seatsPage(1)');
  run('state.selectedSeat=state.currentMap.rows[0].seats[0]');
  await run('submitBooking()');
  const request=requests.findLast(request=>request.method==='POST' && request.path==='/tickets');
  assert.deepEqual(JSON.parse(request.options.body),{showtime_id:1,seat_id:1});
  assert.equal(context.location.hash,'/tickets');assert.equal(run('state.busy'),false);
});
await check('booking conflicts clear stale seat selection',async()=>{
  context.location.hash='#/seats/1';
  run('state.selectedSeat={id:1,row_number:1,seat_number:1}');
  await run('submitBooking()');
  assert.equal(run('state.selectedSeat'),null);assert.equal(run('state.busy'),false);
});
await check('curtains close and reopen; reduced motion skips them',async()=>{
  context.location.hash='#/films';animation.length=0;
  await run('changePage(true)');
  assert(animation.includes('add:closed'));assert(animation.includes('remove:closed'));
  assert.equal(element('#main').inert,false);
  reducedMotion=true;animation.length=0;await run('changePage(true)');
  assert(!animation.includes('add:closed'));reducedMotion=false;
});
await check('language and theme controls persist preferences',async()=>{
  await click({lang:'ru'});
  assert.equal(run('state.lang'),'ru');
  assert.equal(document.documentElement.lang,'ru');
  assert.equal(run("localStorage.getItem('cinema-language')"),'ru');
  await click({action:'theme'});
  assert.equal(document.documentElement.dataset.theme,'light');
  assert.equal(run("localStorage.getItem('cinema-theme')"),'light');
  await click({action:'theme'});
  assert.equal(document.documentElement.dataset.theme,'dark');
});
await check('login uses email in the OAuth form and stores only the token',async()=>{
  run("state.lang='en';openAuth()");
  const button=new Element('submit');
  context.loginForm={dataset:{mode:'login'},querySelector(selector){
    if(selector==='[type=submit]')return button;
    return {value:selector==='#auth_email'?'customer@example.com':'password123'};
  }};
  await run('submitAuth(loginForm)');
  const request=requests.filter(request=>request.path==='/auth/login').at(-1);
  assert(request.options.body instanceof URLSearchParams);
  assert.equal(request.options.body.get('username'),'customer@example.com');
  assert.equal(run("sessionStorage.getItem('cinema-token')"),'sample-token');
  assert.equal(run('state.user.email'),'customer@example.com');
  assert.equal(run("localStorage.getItem('password')"),null);
});
await check('ticket cancellation releases its seat',async()=>{
  context.location.hash='#/tickets';
  run('cancelDialog(11)');
  checkMarkup(element('#modal-root').innerHTML);
  await click({confirmCancel:'11'});
  assert.equal(tickets.find(ticket=>ticket.id===11).status,'cancelled');
  await run('seatsPage(1)');
  assert.equal(run("state.currentMap.rows[0].seats.find(seat=>seat.id===1).status"),'available');
});
await check('skip-to-content does not activate the hash router',async()=>{
  context.location.hash='#/films';
  await click({},['skip-link']);
  assert.equal(context.location.hash,'#/films');
});
await check('expired sessions clear credentials',async()=>{
  nextError={status:401,detail:'Invalid or expired token'};
  await assert.rejects(run("api('/users/me')"));
  assert.equal(run('state.token'),'');assert.equal(run('state.user'),null);
});

export const results = checks;
console.log(`${checks.length} frontend checks passed.`);
