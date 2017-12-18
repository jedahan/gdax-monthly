global.fetch = require('node-fetch')
const cc = require('cryptocompare')

function getAveragePriceForMonth(year, month) {
  return new Promise((resolve, reject) => {
    cc
      .histoDay('ETH', 'USD', { timestamp: new Date(`${year}-${(month+1)}-1`) })
      .then(prices => {
          resolve(prices
            .map(price => price.close)
            .reduce((sum, price) => { return sum + price }, 0)
            / prices.length)
        })
      })
}

getAveragePriceForMonth(2017, 10).then(average => console.log(`October: ${average}`))
getAveragePriceForMonth(2017, 11).then(average => console.log(`November: ${average}`))

const Gdax = require('gdax')
const gdax = new Gdax.PublicClient('ETH-USD')

function getAveragePriceForMonthCoinbase(year, month) {
  return new Promise((resolve, reject) => {
    gdax
      .getProductHistoricRates({granularity: 60 * 60 * 24, start: `${year}-${month}-1`, end: `${year}-${(month+1)}-1`},
        (err, response) => {
          const days = JSON.parse(response.body).length
          const prices = JSON.parse(response.body)[0]
          resolve(prices
            .map(price => prices[3])
            .reduce((sum, price) => { return sum + price }, 0)
            / prices.length
          )
        }
      )
  })
}

getAveragePriceForMonthCoinbase(2017, 11).then(average => console.log(`GDAX ETH-USD November: ${average}`))
