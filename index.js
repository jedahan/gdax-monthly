global.fetch = require('node-fetch')
const cc = require('cryptocompare')

function getDaysInMonth(month, year) {
  let date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

const november = getDaysInMonth(11, 17)

Promise.all(
  november.map(day => cc.priceHistorical('ETH', ['USD'], day))
).then(prices => {
  const sum = prices
    .map(price => price['USD'])
    .reduce((sum, value) => {sum + value}, 0)
  console.log("average price for nov")
  console.log(sum / november.length)
})
