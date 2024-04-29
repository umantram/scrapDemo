const playwright = require('playwright');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
 
async function test() {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://webscraper.io/test-sites/e-commerce/more');
  let html = await page.content();
 
  const $ = cheerio.load(html);
  const items = $('div.thumbnail');
 
  let data = [];
 
  for (let i = 0; i < items.length; i++) {
    let obj = {};
    const item = $(items[i]);
    obj["title"] = item.find('a.title').text().trim();
    obj["price"] = item.find('h4.price').text().trim();
 
    const link = item.find('a.title').attr('href');
    const productPage = `https://webscraper.io${link}`;
 
    const productPageResponse = await page.goto(productPage);
    const productPageHtml = await productPageResponse.text();
 
    const productPage$ = cheerio.load(productPageHtml);
    const description = productPage$('p.description').text().trim();
    obj["description"] = description;
 
    data.push(obj);
  }
 
  await browser.close();
 
  const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'price', title: 'Price' },
      { id: 'description', title: 'Description' }
    ]
  });
 
  await csvWriter.writeRecords(data);
 
  console.log('CSV file has been created.');
 
}
 
test();