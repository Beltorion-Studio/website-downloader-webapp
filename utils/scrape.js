import scrape from 'website-scraper';

import { CreateZipFilePlugin, archive } from '../utils/CreateZipFilePlugin.js';

class ConsoleLogPlugin {
 static counter = 0; // Static property to keep track of the count

 constructor() {
  ConsoleLogPlugin.counter = 0;
 }

 apply(registerAction) {
  registerAction('onResourceSaved', ({ resource }) => {
   ConsoleLogPlugin.counter++; // Increment the static counter
   const message = `${ConsoleLogPlugin.counter} ${resource.filename} downloaded successfully!`;
   global.io.emit('progress', message); // Emit the progress event to the server
   console.log(message);
  });
 }
}

async function scrapeWebsite(formData) {
 const { websiteUrl, depth } = formData;
 const userDirectory = 'download_directory';

 const options = {
  urls: [websiteUrl, 'https://uploads-ssl.webflow.com'],
  urlFilter: function (url) {
   // Include all URLs that match the website URL or have a specific file extension
   return (
    url.indexOf(websiteUrl) === 0 ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.jpg') ||
    url.endsWith('.png') ||
    url.endsWith('.svg') ||
    url.endsWith('.pdf') ||
    url.startsWith('https://uploads-ssl.webflow.com')
   );
  },
  subdirectories: [
   { directory: 'img', extensions: ['.jpg', '.png', '.svg', '.jpeg', '.webp', '.gif'] },
   { directory: 'js', extensions: ['.js'] },
   { directory: 'css', extensions: ['.css'] },
   { directory: 'fonts', extensions: ['.ttf', '.otf', '.woff', '.woff2', '.eot'] },
   {
    directory: 'media',
    extensions: ['.avi', '.mp4', '.wmv', '.flv', '.mkv', '.swf', '.f4v', '.mov'],
   },
  ],

  directory: userDirectory,
  plugins: [new ConsoleLogPlugin(), new CreateZipFilePlugin(websiteUrl)],
  recursive: true,
  maxRecursiveDepth: depth,
 };

 const result = await scrape(options);
 return archive;
}

function isWebflowSite(url) {
 const website = 'webflow.io';
 return url.includes(website);
}

export { scrapeWebsite };
