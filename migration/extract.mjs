import fs from 'node:fs';
import * as c from 'cheerio';
const h=await (await fetch('https://warriorsportsperformance.com/privacy-policy')).text();
fs.writeFileSync('migration/privacy-policy.html',h);
const $=c.load(h); $('script,style').remove(); fs.writeFileSync('migration/privacy-policy.txt',$('body').text());
for(const p of ['schedule','getstarted','pricingandservices']){const $=c.load(fs.readFileSync('migration/'+p+'.html','utf8'));const e=$('.custom-code-container').filter((i,e)=>$(e).html().includes('directLoader')).first(); e.find('script[src]').remove(); fs.mkdirSync('src/widgets',{recursive:true});fs.writeFileSync('src/widgets/'+p+'.html',e.html());}
