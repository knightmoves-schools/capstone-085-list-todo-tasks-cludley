const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should list each card with a unique id that contains "task-" followed by the index within the tasks array', async function() {
    const firstCard = await page.$eval('#task-0', (result) => {
      return result.innerHTML;
    });
    
    const secondCard = await page.$eval('#task-1', (result) => {
      return result.innerHTML;
    }); 

    const thirdCard = await page.$eval('#task-2', (result) => {
      return result.innerHTML;
    }); 
      
    expect(firstCard).toContain('pack spikes for track meet');
    expect(secondCard).toContain('make my bed');
    expect(thirdCard).toContain('walk the dog');
  });

  it('should contain an edit link within each card that contains the corresponding  index within the tasks array', async function() {
    const firstCard = await page.$eval('#task-0', (result) => {
      return result.innerHTML;
    });
    
    const secondCard = await page.$eval('#task-1', (result) => {
      return result.innerHTML;
    }); 

    const thirdCard = await page.$eval('#task-2', (result) => {
      return result.innerHTML;
    }); 
      
    expect(firstCard).toMatch(/<a href="\/edit\/0">[\s\S]*Edit[\s\S]*<\/a>/);
    expect(secondCard).toMatch(/<a href="\/edit\/1">[\s\S]*Edit[\s\S]*<\/a>/);
    expect(thirdCard).toMatch(/<a href="\/edit\/2">[\s\S]*Edit[\s\S]*<\/a>/);
  });

  it('should contain a delete link within each card that contains the corresponding  index within the tasks array', async function() {
    const firstCard = await page.$eval('#task-0', (result) => {
      return result.innerHTML;
    });
    
    const secondCard = await page.$eval('#task-1', (result) => {
      return result.innerHTML;
    }); 

    const thirdCard = await page.$eval('#task-2', (result) => {
      return result.innerHTML;
    }); 

    expect(firstCard).toMatch(/<a href="\/delete\/0">[\s\S]*Delete[\s\S]*<\/a>/);
    expect(secondCard).toMatch(/<a href="\/delete\/1">[\s\S]*Delete[\s\S]*<\/a>/);
    expect(thirdCard).toMatch(/<a href="\/delete\/2">[\s\S]*Delete[\s\S]*<\/a>/);
  });
});

