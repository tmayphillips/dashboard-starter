import Forex from './src/forex.js'
import Quote from './src/quote.js'
import Weather from './src/weather.js'
import ToDo from './src/todo.js'

let forex = new Forex()
forex.render()

let quote = new Quote()
setInterval(quote.render(), 3000)

let weather = new Weather()
weather.render()

let todo = new ToDo()
todo.render()