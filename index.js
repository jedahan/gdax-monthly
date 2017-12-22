// yarn install gdax && node index.js

const util = require('util')
const Gdax = require('gdax')
const gdax = new Gdax.PublicClient('ETH-USD')

function getAveragePriceForMonthCoinbase(year, month) {
  // lol december is 11, january is 0
  if (month === 12) {
    next_month = new Date(year + 1, 0, 1)
  } else {
    next_month = new Date(year, month, 1)
  }

  month = new Date(year, month-1, 1)
  if (next_month > new Date()) next_month = new Date()

  return new Promise((resolve, reject) => {
    const options = {
      granularity: 60 * 60 * 24,
      start: month.toISOString().split('T')[0],
      end: next_month.toISOString().split('T')[0]
    }

    gdax
      .getProductHistoricRates(options,
        (err, response) => {
          const prices = JSON.parse(response.body)
          const days = prices.length
          console.log(`found ${days} days...`)
          resolve(prices
            .map(price => price[3])
            .reduce((sum, price) => { return sum + price }, 0)
            / prices.length
          )
        }
      )
  })
}

getAveragePriceForMonthCoinbase(2017, 11).then(average => console.log(`GDAX ETH-USD November: ${average}`))
getAveragePriceForMonthCoinbase(2017, 12).then(average => console.log(`GDAX ETH-USD December: ${average}`))
