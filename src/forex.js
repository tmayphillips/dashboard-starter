class Forex{
    api_key = '2309b952fee949d68578ba23c5fe2080'

    audArray = ['GPB/AUD', 'EUR/AUD', 'AUD/USD', 'AUD/NZD', 'AUD/JPY', 'AUD/CHF', 'AUD/CAD']
    cadArray = ['USD/CAD', 'NZD/CAD', 'GBP/CAD', 'EUR/CAD', 'CAD/JPY', 'CAD/CHF', 'AUD/CAD']
    chfArray = ['USD/CHF', 'NZD/CHF', 'GBP/CHF', 'EUR/CHF', 'CHF/JPY', 'CAD/CHF', 'AUD/CHF']
    eurArray = ['EUR/AUD', 'EUR/CAD', 'EUR/CHF', 'EUR/GBP', 'EUR/JPY', 'EUR/NZD', 'EUR/USD']
    gpbArray = ['EUR/GBP', 'GPB/AUD', 'GBP/CAD', 'GBP/CHF', 'GBP/JPY', 'GBP/NZD', 'GBP/USD']
    jpyArray = ['AUD/JPY', 'CAD/JPY', 'CHF/JPY', 'EUR/JPY', 'GBP/JPY', 'NZD/JPY', 'USD/JPY']
    nzdArray = ['AUD/NZD', 'EUR/NZD', 'GBP/NZD', 'NZD/CAD', 'NZD/CHF', 'NZD/JPY', 'NZD/USD']
    usdArray = ['AUD/USD', 'EUR/USD', 'GBP/USD', 'NZD/USD', 'USD/CAD', 'USD/CHF', 'USD/JPY']

    constructor() {}
    
    render(){
        const forex = document.querySelector('.forex')
        const timeseries_url = 'https://api.twelvedata.com/time_series'
        let interval = '1day'
        let symbol = 'EUR/USD'
        const headers = { 'Content-Type': 'application/json' }
        let forexData = []
        let  data = {}

        const getTimeseries = async (pair, currency) => {
            let result = await axios.get(`${timeseries_url}?apikey=${this.api_key}&interval=${interval}&symbol=${pair}&format=JSON`, {
                headers: headers
            })
            forexData = result.data.values
            data[pair]= forexData[0].close

            let currencyName = document.getElementById(currency)
            let dataDisplay = data[pair].toString()
            dataDisplay = dataDisplay.substr(0,6)
            
            currencyName.innerHTML += `
                <p>${pair}: ${dataDisplay}</p>
            `
        }

        function openTab(event, currency) {
            let i, forexContent, tablinks;
            forexContent = document.getElementsByClassName("forex-content");
            for (i = 0; i < forexContent.length; i++) {
              forexContent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(currency).style.display = "block";
            event.currentTarget.className += " active";
        }

        forex.innerHTML = `
            <div class="tab">
                <button class="tablinks" id='aud-btn'>AUD</button>
                <button class="tablinks" id='cad-btn'>CAD</button>
                <button class="tablinks" id='chf-btn'>CHF</button>
                <button class="tablinks" id='eur-btn'>EUR</button>
                <button class="tablinks" id='gbp-btn'>GBP</button>
                <button class="tablinks" id='jpy-btn'>JPY</button>
                <button class="tablinks" id='nzd-btn'>NZD</button>
                <button class="tablinks" id='usd-btn'>USD</button>
            </div>
            <div id='aud' class='forex-content'>
                <h2>AUD Pairs</h2>
            </div>
            <div id='cad' class='forex-content'>
                <h2>CAD Pairs</h2>
            </div>
            <div id='chf' class='forex-content'>
                <h2>CHF Pairs</h2>
            </div>
            <div id='eur' class='forex-content'>
                <h2>EUR Pairs</h2>
            </div>
            <div id='gpb' class='forex-content'>
                <h2>GBP Pairs</h2>
            </div>
            <div id='jpy' class='forex-content'>
                <h2>JPY Pairs</h2>
            </div>
            <div id='nzd' class='forex-content'>
                <h2>NZD Pairs</h2>
            </div>
            <div id='usd' class='forex-content'>
                <h2>USD Pairs</h2>
            </div>
        `

        let audBtn = document.getElementById('aud-btn')
        let cadBtn = document.getElementById('cad-btn')
        let chfBtn = document.getElementById('chf-btn')
        let eurBtn = document.getElementById('eur-btn')
        let gbpBtn = document.getElementById('gbp-btn')
        let jpyBtn = document.getElementById('jpy-btn')
        let nzdBtn = document.getElementById('nzd-btn')
        let usdBtn = document.getElementById('usd-btn')

        audBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'aud')
            this.audArray.forEach(element => {
                getTimeseries(element, 'aud')
            })
        })

        cadBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'cad')
            this.cadArray.forEach(element => {
                getTimeseries(element, 'cad')
            })
        })

        chfBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'chf')
            this.chfArray.forEach(element => {
                getTimeseries(element, 'chf')
            })
        })

        eurBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'eur')
            this.eurArray.forEach(element => {
                getTimeseries(element, 'eur')
            })
        })

        gbpBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'gbp')
            this.gbpArray.forEach(element => {
                getTimeseries(element, 'gbp')
            })
        })

        jpyBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'jpy')
            this.jpyArray.forEach(element => {
                getTimeseries(element, 'jpy')
            })
        })

        nzdBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'nzd')
            this.nzdArray.forEach(element => {
                getTimeseries(element, 'nzd')
            })
        })

        usdBtn.addEventListener('click', event => {
            event.preventDefault()
            openTab(event, 'usd')
            this.usdArray.forEach(element => {
                getTimeseries(element, 'usd')
            })
        })
    }
}

export default Forex;