const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');toggle.focus();}});
const galleryItems=[...document.querySelectorAll('.gallery-item')];
let galleryFilter='All',galleryLimit=24;
const morePhotos=document.querySelector('#gallery-more');
function updateGallery(){const matching=galleryItems.filter(item=>galleryFilter==='All'||item.dataset.category===galleryFilter);const shown=new Set(matching.slice(0,galleryLimit));galleryItems.forEach(item=>item.hidden=!shown.has(item));const status=document.querySelector('#gallery-status');if(status)status.textContent='Showing '+shown.size+' of '+matching.length+' photos';if(morePhotos)morePhotos.hidden=shown.size>=matching.length;}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{galleryFilter=button.dataset.filter;galleryLimit=24;document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});updateGallery();}));
morePhotos?.addEventListener('click',()=>{const firstNew=galleryItems.filter(item=>galleryFilter==='All'||item.dataset.category===galleryFilter)[galleryLimit];galleryLimit+=24;updateGallery();firstNew?.focus({preventScroll:true});});
updateGallery();
const dialog=document.querySelector('#lightbox');
document.querySelectorAll('.gallery-item').forEach(item=>item.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=item.querySelector('img').src;img.alt=item.dataset.caption;dialog.showModal();}));
dialog?.querySelector('button').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const form=document.querySelector('#inquiry-form');
if(form){const selected=new URLSearchParams(location.search).get('interest');if(selected&&[...form.interest.options].some(o=>o.value===selected))form.interest.value=selected;form.addEventListener('submit',e=>{e.preventDefault();const subject=`WSP inquiry: ${form.interest.value}`;const body=`Hi WSP,\n\nMy name is ${form.elements.name.value.trim()}.\n\n${form.message.value.trim()}\n\nThank you!`;location.href=`mailto:info@warriorsportsperformance.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='Your email draft has been requested. Review and send it in your email app. If it did not open, please email or call us directly.';});}
// Give third-party widget frames accessible names without changing Studio behavior.
const nameFrames=()=>document.querySelectorAll('.widget-shell iframe').forEach(frame=>{if(!frame.title)frame.title='Warrior Sports Performance booking and schedule';});
new MutationObserver(nameFrames).observe(document.body,{childList:true,subtree:true});nameFrames();
