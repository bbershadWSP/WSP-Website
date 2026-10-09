// Bulk optimize a local folder. Original files are never modified.
import fs from 'node:fs';import path from 'node:path';import sharp from 'sharp';
const source=process.argv[2];if(!source){console.error('Usage: node scripts/import-photos.mjs "C:/path/to/photos"');process.exit(1);}
const target=path.resolve('public/images');fs.mkdirSync(target,{recursive:true});const manifest=[];
for(const name of fs.readdirSync(source).filter(n=>/\.(jpe?g|png|webp)$/i.test(n))){const base=path.parse(name).name.replace(/[^a-z0-9_-]/gi,'-').toLowerCase();let filename=base+'.webp',suffix=1;while(fs.existsSync(path.join(target,filename)))filename=`${base}-${suffix++}.webp`;await sharp(path.join(source,name)).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:82}).toFile(path.join(target,filename));manifest.push({src:'/images/'+filename,caption:'',category:'Strength'});}
const output=`migration/photo-import-${Date.now()}.json`;fs.writeFileSync(output,JSON.stringify(manifest,null,2));console.log(`Imported ${manifest.length} images. Add captions and selected entries from ${output} to src/content.mjs.`);
