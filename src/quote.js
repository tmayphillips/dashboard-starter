class Quote{
    constructor() {}

    render(){
        const quote = document.querySelector('.quote')
        const quoteUrl = 'https://type.fit/api/quotes' 
        const headers = { 'Content-Type': 'application/json' }

        const getRandomInt = max => {
            return Math.floor(Math.random() * max)
        }

        const getQuote = async () => {
            let result = await axios.get(quoteUrl, {
                headers: headers
            })
            let rand = getRandomInt(result.data.length)
            let data = result.data[rand]
            if (data.author === null) {
                data.author = 'Unknown'
            }
            const authorUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${data.author}&prop=pageimages&format=json&pithumbsize=100&origin=*`
        
            let author = await axios.get(authorUrl, {
                headers: headers
            })

            quote.innerHTML = `
            <div>
                <div id='quote-details'>
                <h2 id='quote-text'>${data.text}</h2>
                </div>
                <h3>${data.author}</h3>
            </div>
            `

            if (data.text.length > 100) {
                document.getElementById('quote-text').style['font-size'] = '2vw'
            }
                
        }
        quote.addEventListener('click', event => {
            event.preventDefault()
            getQuote()
        })

        let quoteInterval = setInterval(getQuote, 10000)
        getQuote()
    }
}

export default Quote;