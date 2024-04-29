const playwright = require('playwright');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
 
async function test() {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.vea.com.ar/bebidas');
  let html = await page.content();
 
  const $ = cheerio.load(html);
  const items = $('div.vtex-search-result-3-x-galleryItem');

 
  let data = [];
 
  for (let i = 0; i < items.length; i++) {
    let obj = {};
    const item = $(items[i]);
    obj["title"] = item.find('span.vtex-product-summary-2-x-productBrandName').text().trim();
    obj["price"] = item.find('div.veaargentina-store-theme-1dCOMij_MzTzZOCohX1K7w').text().trim();
 
    /* const link = item.find('a.title').attr('href');
    const productPage = `https://webscraper.io${link}`;
 
    const productPageResponse = await page.goto(productPage);
    const productPageHtml = await productPageResponse.text();
 
    const productPage$ = cheerio.load(productPageHtml);
    const description = productPage$('p.description').text().trim();
    obj["description"] = description; */
 
    data.push(obj);
  }
 
  await browser.close();
 
  const csvWriter = createCsvWriter({
    path: 'data1.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'price', title: 'Price' },
    //   { id: 'description', title: 'Description' }
    ]
  });
 
  await csvWriter.writeRecords(data);
 
  console.log('CSV file has been created.');
 
}
 
test();