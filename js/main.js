/* MOKA Store - behavior only. All content/data lives in the HTML. */
(function(){
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var hd=$('.header');
addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>10)},{passive:true});
var bg=$('.burger'),nv=$('.nav');
if(nv){var ov=document.createElement('div');ov.className='ov';hd.insertBefore(ov,hd.firstChild);
var nc=document.createElement('button');nc.className='nclose';nc.type='button';nc.setAttribute('aria-label','إغلاق');nc.textContent='✕';nv.insertBefore(nc,nv.firstChild);
var nl=document.createElement('a');nl.className='nlogo';nl.href='index.html';nl.innerHTML='<img src="img/logo.png" alt="MOKA Store">';nv.insertBefore(nl,nv.firstChild);
function menu(o){nv.classList.toggle('open',o);ov.classList.toggle('show',o);document.body.classList.toggle('lock',o)}
if(bg)bg.onclick=function(){menu(!nv.classList.contains('open'))};nc.onclick=ov.onclick=function(){menu(false)};
$$('a',nv).forEach(function(a){a.addEventListener('click',function(){menu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)})}
/* reveal on scroll */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('[data-r]').forEach(function(el){io.observe(el)});
/* toast */
var t=$('.toast');function toast(m){t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show')},2200)}
/* hero slider */
var sl=$$('.slide');
if(sl.length){var i=0,bar=$('.hero-ctl .bar i'),cur=$('.hero-ctl .cur'),tm;
function go(n){sl[i].classList.remove('on');i=(n+sl.length)%sl.length;sl[i].classList.add('on');cur.textContent='0'+(i+1);bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run');clearTimeout(tm);tm=setTimeout(function(){go(i+1)},6000)}
$('.hero-ctl .nx').onclick=function(){go(i+1)};$('.hero-ctl .pv').onclick=function(){go(i-1)};go(0)}
/* cart badge + add to cart */
var cnt=$('.badge');
$$('.add,.js-add').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();cnt.textContent=+cnt.textContent+1;cnt.classList.remove('pop');void cnt.offsetWidth;cnt.classList.add('pop');toast('تمت إضافة المنتج إلى السلة')})});
/* wishlist */
$$('.wish').forEach(function(w){w.addEventListener('click',function(e){e.preventDefault();w.classList.toggle('on');toast(w.classList.contains('on')?'أضيف إلى المفضلة':'أزيل من المفضلة')})});
/* single chips (size / color) */
$$('[data-pick]').forEach(function(g){$$('button',g).forEach(function(b){b.onclick=function(){$$('button',g).forEach(function(x){x.classList.remove('on')});b.classList.add('on')}})});
/* gallery */
$$('.thumbs button').forEach(function(b){b.onclick=function(){$$('.thumbs button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');var m=$('.gal .main img');m.style.opacity=0;setTimeout(function(){m.src=b.dataset.src;m.style.objectPosition=b.dataset.pos||'center';m.style.opacity=1},200)}});
var gm=$('.gal .main');
if(gm)gm.addEventListener('mousemove',function(e){var r=gm.getBoundingClientRect();gm.firstElementChild.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'});
/* tabs */
function tabs(nav,sel,pane){$$(nav+' button').forEach(function(b,k){b.onclick=function(){$$(nav+' button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');$$(pane).forEach(function(p,j){p.classList.toggle('on',j===k)})}})}
tabs('.tabnav','','.pane');tabs('.wtabs','','.wp');
/* quantity + cart totals (reads prices from data-price in HTML) */
function fmt(n){return n.toLocaleString('en-US')+' جنيه'}
function totals(){var s=0;$$('.crow[data-price]').forEach(function(r){if(!r.classList.contains('gone'))s+=r.dataset.price*$('input',r).value});
var sub=$('#sub');if(sub){sub.textContent=fmt(s);var disc=+($('#disc')||{dataset:{v:0}}).dataset.v;var ship=s>=1000||s===0?0:60;$('#ship').textContent=ship?fmt(ship):'مجاني';$('#tot').textContent=fmt(s-disc+ship)}}
$$('.qty').forEach(function(q){var inp=$('input',q),bs=$$('button',q);
bs[0].onclick=function(){inp.value=Math.max(1,+inp.value-1);upd()};bs[1].onclick=function(){inp.value=Math.min(20,+inp.value+1);upd()};
function upd(){var r=q.closest('.crow');if(r){$('.lt',r).textContent=fmt(r.dataset.price*inp.value);totals()}}});
$$('.rm').forEach(function(b){b.onclick=function(){var r=b.closest('.crow');r.classList.add('gone');setTimeout(function(){r.remove();totals();if(!$('.crow[data-price]')){$('.ctable').innerHTML='<div class="empty">سلتك فارغة حاليا. <a href="shop.html" style="color:var(--gold);font-weight:700">ابدأ التسوق</a></div>'}},400)}});
var cp=$('#apply');if(cp)cp.onclick=function(){var v=$('#code').value.trim().toUpperCase();var d=$('#disc');if(v==='MOKA10'){d.dataset.v=d.dataset.base;d.textContent='-'+fmt(+d.dataset.base);toast('تم تطبيق الكوبون')}else toast('كود الخصم غير صحيح')};
/* newsletter / contact forms */
$$('form[data-demo]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();toast(f.dataset.demo);f.reset()})});

/* nav active state */
(function(){var p=(location.pathname.split('/').pop()||'index.html').replace('.html','');var c=new URLSearchParams(location.search).get('cat');var k=p==='index'?'home':p==='shop'?(c&&/^(tshirts|pants|jackets|shirts)$/.test(c)?c:'shop'):(p==='blog'||p.indexOf('article')===0)?'blog':'';
if(p.indexOf('product')===0){var cr=$('.crumbs');var m={'تيشرتات':'tshirts','بناطيل':'pants','جواكيت':'jackets','قمصان':'shirts'};if(cr)k=m[cr.textContent.split('/').pop().trim()]||'shop'}
window.setNav=function(x){$$('.nav a').forEach(function(a){a.classList.toggle('on',a.dataset.nav===x)})};setNav(k)})();
/* product filtering (home tabs + shop filters) */
(function(){var cards=$$('.pcard[data-cat]');if(!cards.length)return;
var NAMES={all:'المتجر',best:'الأكثر مبيعاً',tshirts:'تيشرتات',pants:'بناطيل',jackets:'جواكيت',shirts:'قمصان'};
var KW={tshirts:'تيشرت تيشيرت تيشرتات tshirt',pants:'بنطلون بنطال بناطيل pants',jackets:'جاكيت جواكيت jacket',shirts:'قميص قمصان shirt'};
function nz(t){return(t||'').toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[ً-ْ]/g,'')}
var shop=!!$('.shop'),qs=new URLSearchParams(location.search);
var st={cat:shop&&NAMES[qs.get('cat')]?qs.get('cat'):'all',max:2000,sizes:[],colors:[],q:shop?(qs.get('q')||'').trim():'',sort:'new'};
var grid=cards[0].parentNode;
cards.forEach(function(c){c._h=nz($('h3',c).textContent+' '+KW[c.dataset.cat]+(c.dataset.best==='1'?' الاكثر مبيعا':''))});
function inCat(c,k){return k==='all'||(k==='best'?c.dataset.best==='1':c.dataset.cat===k)}
function apply(){var q=nz(st.q),n=0,vis=[];
cards.forEach(function(c){var d=c.dataset;
var ok=inCat(c,st.cat)&&+d.price<=st.max&&(!st.sizes.length||st.sizes.some(function(s){return d.sizes.split(',').indexOf(s)>-1}))&&(!st.colors.length||st.colors.indexOf(d.color)>-1)&&(!q||q.split(/\s+/).every(function(w){return c._h.indexOf(w)>-1}));
c.classList.toggle('hide',!ok);if(ok){c.classList.add('in');n++;vis.push(c)}});
vis.sort(function(a,b){return st.sort==='asc'?a.dataset.price-b.dataset.price:st.sort==='desc'?b.dataset.price-a.dataset.price:b.dataset.order-a.dataset.order}).forEach(function(c){grid.appendChild(c)});
$$('[data-cat-f]').forEach(function(b){b.classList.toggle('on',b.dataset.catF===st.cat)});
$$('[data-count]').forEach(function(s){s.textContent=cards.filter(function(c){return inCat(c,s.dataset.count)}).length});
var rc=$('#rcount');if(rc)rc.textContent='عرض '+n+' منتج'+(n===1?'':'ات');
var nr=$('#nores');if(nr)nr.classList.toggle('hide',n>0);
if(shop){var ph=$('#ph');if(ph){ph.textContent=NAMES[st.cat];$('#pc').textContent=NAMES[st.cat];document.title=NAMES[st.cat]+' | موكا ستور'}
setNav(st.cat==='all'||st.cat==='best'?'shop':st.cat);
var u=new URLSearchParams();if(st.cat!=='all')u.set('cat',st.cat);if(st.q)u.set('q',st.q);history.replaceState(null,'',location.pathname+(u.toString()?'?'+u:''))}}
$$('[data-cat-f]').forEach(function(b){b.onclick=function(){st.cat=b.dataset.catF;apply()}});
if(shop){
var pr=$('#fprice');pr.oninput=function(){st.max=+pr.value;$('#pmax').textContent=pr.value+' EGP';apply()};
$$('[data-multi]').forEach(function(g){$$('button',g).forEach(function(b){b.onclick=function(){var a=st[g.dataset.multi],i=a.indexOf(b.dataset.v);if(i>-1)a.splice(i,1);else a.push(b.dataset.v);b.classList.toggle('on',i<0);apply()}})});
$('#fsort').onchange=function(e){st.sort=e.target.value;apply()};
function reset(){st.cat='all';st.max=2000;st.sizes=[];st.colors=[];st.q='';st.sort='new';pr.value=2000;$('#pmax').textContent='2000 EGP';$('#fsort').value='new';$$('[data-multi] button').forEach(function(b){b.classList.remove('on')});var si=$('.search input');if(si)si.value='';apply()}
$('#freset').onclick=reset;$('#freset2').onclick=reset;
var si=$('.search input');if(si){si.value=st.q;si.addEventListener('input',function(){st.q=si.value.trim();apply()});$('.search').addEventListener('submit',function(e){e.preventDefault()})}}
apply()})();

/* slider */
$$('.slider').forEach(function(s){var tr=$('.track',s),rtl=getComputedStyle(tr).direction==='rtl';
function step(d){var c=tr.firstElementChild;var w=c.getBoundingClientRect().width+16;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:'smooth'})}
$('.nx',s).onclick=function(){step(1)};$('.pv',s).onclick=function(){step(-1)}});
/* mobile filter drawer */
(function(){var sd=$('#side');if(!sd)return;var o=document.createElement('div');o.className='ov fov';document.body.appendChild(o);
function f(x){sd.classList.toggle('open',x);o.classList.toggle('show',x);document.body.classList.toggle('lock',x)}
$('#fopen').onclick=function(){f(true)};$('#fclose').onclick=o.onclick=$('#fdone').onclick=function(){f(false)}})();
})();
