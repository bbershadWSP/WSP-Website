const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');toggle.focus();}});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});let count=0;document.querySelectorAll('.gallery-item').forEach(item=>{item.hidden=button.dataset.filter!=='All'&&item.dataset.category!==button.dataset.filter;if(!item.hidden)count++;});document.querySelector('#gallery-status').textContent=`Showing ${count} photos`; }));
const dialog=document.querySelector('#lightbox');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=item.querySelector('img').src;img.alt=item.dataset.caption;dialog.querySelector('p').textContent=item.dataset.caption;dialog.showModal();}));
dialog?.querySelector('button').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const form=document.querySelector('#inquiry-form');
if(form){const selected=new URLSearchParams(location.search).get('interest');if(selected&&[...form.interest.options].some(o=>o.value===selected))form.interest.value=selected;form.addEventListener('submit',e=>{e.preventDefault();const subject=`WSP inquiry: ${form.interest.value}`;const body=`Hi WSP,\n\nMy name is ${form.elements.name.value.trim()}.\n\n${form.message.value.trim()}\n\nThank you!`;location.href=`mailto:info@warriorsportsperformance.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Your email draft has been requested. Review and send it in your email app. If it did not open, please email or call us directly.';});}
// Give third-party widget frames accessible names without changing Studio behavior.
const nameFrames=()=>document.querySelectorAll('.widget-shell iframe').forEach(frame=>{if(!frame.title)frame.title='Warrior Sports Performance booking and schedule';});
new MutationObserver(nameFrames).observe(document.body,{childList:true,subtree:true});nameFrames();
