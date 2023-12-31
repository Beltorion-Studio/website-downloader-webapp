import archiver from 'archiver';
import removeBadgeStyles from '../utils/removeBadgeStyles.js';

let archive;

class CreateZipFilePlugin {
 constructor(websiteUrl) {
  this.loadedResources = [];
  this.websiteUrl = websiteUrl;
 }
 apply(registerAction) {
  registerAction('saveResource', async ({ resource }) => {
   this.loadedResources.push(resource);
  });

  registerAction('afterFinish', async ({ options, sendResponse }) => {
   if (this.loadedResources.length === 0) {
    return;
   }
   archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level (0 to 9)
   });

   for (const resource of this.loadedResources) {
    const fileName = resource.getFilename();
    let fileContent = resource.getText();
    const encoding = resource.getEncoding();
    const type = resource.getType();
    const url = resource.getUrl();

    if (type === 'css') {
     let websitname = extractSubdomain(this.websiteUrl);
     if (url.includes(websitname)) {
      fileContent = await removeBadgeStyles(fileContent);
     }  
    }

    if (encoding === 'utf8') {
     archive.append(fileContent, { name: fileName, encoding: 'utf8' });
    } else {
     const buffer = Buffer.from(fileContent, 'binary');
     archive.append(buffer, { name: fileName });
    }
   }
   archive.finalize();
  });
 }
}

function extractSubdomain(url) {
 // Remove 'https://' or 'http://' from the beginning of the URL
 let subdomain = url.replace(/^(https?:\/\/)/, '');

 // Remove '.webflow.io/' from the end of the URL
 subdomain = subdomain.replace(/\.webflow\.io\/?$/, '');

 return subdomain;
}

export { CreateZipFilePlugin, archive };
