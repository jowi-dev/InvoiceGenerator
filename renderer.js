// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const app = require('electron').remote.app,
  path = require('path'),
  fs = require('fs'),
  dialog = require('electron').remote.dialog,
  BrowserWindow = require('electron').remote.BrowserWindow,
  puppeteer = require('puppeteer'),
  connect = require('connect'),
  serveStatic = require('serve-static'),
  electron = require('electron'),
  jsPDF = require('jspdf');

let page;

async function getPic(url) {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 250,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1600, height: 1200 });
  await screenshotDOMElement({
    selector: '#pdf',
    path: 'test.png'
  })

  await browser.close();
  let pdf = new jsPDF();
  let data;

  getDataUri('./test.png',(dataUri) => {
    pdf.addImage(dataUri, 'PNG', 1,1)
    pdf.save('invoice.pdf');

  });


}

function getDataUri(url, callback) {
  var image = new Image();

  image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(this, 0, 0);

      // Get raw image data
      //callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

      // ... or get as Data URI
      callback(canvas.toDataURL('image/png'));
  };

  image.src = url;
}


function startServer(){
  connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});
}

  /**
   * Takes a screenshot of a DOM element on the page, with optional padding.
   *
   * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
   * @return {!Promise<!Buffer>}
   */
async function screenshotDOMElement(opts = {}) {
  const padding = 'padding' in opts ? opts.padding : 0;
  const path = 'path' in opts ? opts.path : null;
  const selector = opts.selector;

  if (!selector)
      throw Error('Please provide a selector.');

  const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
          return null;
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
  }, selector);

  if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

  return await page.screenshot({
      path,
      clip: {
          x: rect.left - padding,
          y: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
      }
  });
}





//Page Elements
const nextButton = document.querySelector('#next');
const dateInput = document.querySelector('#date');
const companyInput = document.querySelector('#company-name');
const reasonInput = document.querySelector('#reason');
const amountInput = document.querySelector('#amount');



//Startup Actions
nextButton.addEventListener('click',navigate);
populateDate(new Date());
//document.getElementById('start').addEventListener('click', function() {
//  event.preventDefault();
//  startServer();
//  getPic('http://localhost:8080/src/generated.html');
//});
//Function Definitions
function populateDate(date){
  dateInput.value = dateFns.format(date, 'MMMM, YYYY');
}


function navigate(event){
  event.preventDefault();

  const company = companyInput.value;
  const date = dateInput.value;
  const reason = reasonInput.value;
  const amount = amountInput.value;
  startServer();
  getPic('http://localhost:8080/src/generated.html?company='+company+'&date='+date + '&reason='+reason + '&amount=' + amount + "&currentDate=" + dateFns.format(new Date(),'MMMM Do, YYYY' ));

  //window.location = 'generated.html?company='+company+'&date='+date + '&reason='+reason + '&amount=' + amount;



}