
//Dynamic Page Elements
const companyLabel = document.querySelector('#company');
const currentDateLabel = document.querySelector('#current-date');
const dateLabel = document.querySelector('#date');
const reasonLabel = document.querySelector('#reason');
const amountLabel = document.querySelector('#amount');


//Startup Actions
populatePdf();



//Function Definitions
function parseQuery(){
  let param = window.location.search.split('?company=')[1];
  const companyName = replaceAll(param.split('&date=')[0],'%20',' ');
  param = param.split('&date=')[1];
  const date = replaceAll(param.split('&reason=')[0],'%20',' ');
  param = param.split('&reason=')[1];
  const reason = replaceAll(param.split('&amount=')[0],'%20',' ');
  param = param.split('&amount=')[1];
  const amount = formatNumber(param.split('&currentDate=')[0]);
  const currentDate = replaceAll(param.split('&currentDate=')[1],"%20",' ');

  return {companyName, date, reason, amount, currentDate};
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function replaceAll(str, search, replacement){
  let result = '';

  str.split(search).forEach(item => {
    result = result + replacement + item;
  });

  return result
}

function populatePdf(){
  const {companyName, date, reason,amount, currentDate} = parseQuery();
  companyLabel.innerText = companyName;
  currentDateLabel.innerText = currentDate;
  dateLabel.innerText = date;
  reasonLabel.innerText = reason;
  amountLabel.innerText = amount;
}

