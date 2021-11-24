class Calendar{
    constructor() {}

    render(){
        const calendar = document.querySelector('.calendar');
        let url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3nGQ8wjdomDSAQzKZof3iv8ZtlguE91TerpfAxk2yofwHmGEQQlbQeZudLM-XyGNLkJ_KmeD304jS/pub?gid=0&single=true&output=csv'

        var GoogleAuth; // Google Auth object.
        function initClient() {
        gapi.client.init({
            'apiKey': 'YOUR_API_KEY',
            'clientId': '158344361076-p307at8n782qdp6mke5ehemsmp0g2tpj.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);
        });
        }

        var isAuthorized;
        var currentApiRequest;

        /**
         * Store the request details. Then check to determine whether the user
         * has authorized the application.
         *   - If the user has granted access, make the API request.
         *   - If the user has not granted access, initiate the sign-in flow.
         */
        function sendAuthorizedApiRequest(requestDetails) {
        currentApiRequest = requestDetails;
        if (isAuthorized) {
            // Make API request
            // gapi.client.request(requestDetails)

            // Reset currentApiRequest variable.
            currentApiRequest = {};
        } else {
            GoogleAuth.signIn();
        }
        }

        /**
         * Listener called when user completes auth flow. If the currentApiRequest
         * variable is set, then the user was prompted to authorize the application
         * before the request executed. In that case, proceed with that API request.
         */
        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                isAuthorized = true;
                if (currentApiRequest) {
                sendAuthorizedApiRequest(currentApiRequest);
                }
            } else {
                isAuthorized = false;
            }
        }

        function makeApiCall() {
            var today = new Date(); //today date
            gapi.client.load('calendar', 'v3', function () {
                var request = gapi.client.calendar.events.list({
                    'calendarId' : userEmail,
                    'timeZone' : userTimeZone, 
                    'singleEvents': true, 
                    'timeMin': today.toISOString(), //gathers only events not happened yet
                    'maxResults': maxRows, 
                    'orderBy': 'startTime'});
            request.execute(function (resp) {
                    for (var i = 0; i < resp.items.length; i++) {
                        var li = document.createElement('li');
                        var item = resp.items[i];
                        var classes = [];
                        var allDay = item.start.date? true : false;
                        var startDT = allDay ? item.start.date : item.start.dateTime;
                        var dateTime = startDT.split("T"); //split date from time
                        var date = dateTime[0].split("-"); //split yyyy mm dd
                        var startYear = date[0];
                        var startMonth = monthString(date[1]);
                        var startDay = date[2];
                        var startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00");
                        var startDayWeek = dayString(startDateISO.getDay());
                        if( allDay == true){ //change this to match your needs
                            var str = [
                            '<font size="4" face="courier">',
                            startDayWeek, ' ',
                            startMonth, ' ',
                            startDay, ' ',
                            startYear, '</font><font size="5" face="courier"> @ ', item.summary , '</font><br><br>'
                            ];
                        }
                        else{
                            var time = dateTime[1].split(":"); //split hh ss etc...
                            var startHour = AmPm(time[0]);
                            var startMin = time[1];
                            var str = [ //change this to match your needs
                                '<font size="4" face="courier">',
                                startDayWeek, ' ',
                                startMonth, ' ',
                                startDay, ' ',
                                startYear, ' - ',
                                startHour, ':', startMin, '</font><font size="5" face="courier"> @ ', item.summary , '</font><br><br>'
                                ];
                        }
                        li.innerHTML = str.join('');
                        li.setAttribute('class', classes.join(' '));
                        document.getElementById('events').appendChild(li);
                    }
                document.getElementById('updated').innerHTML = "updated " + today;
                document.getElementById('calendar').innerHTML = calName;
                });
            });
        }
        
        initClient()

        getData(url)
        .then((data) => {
            const events = data
                .split(/\r?\n/).map((l) => l.split(","))
                .map((event) => {
                    return { date: event[0], title: event[1] }
                })
                
            events.forEach(element => {
                calendar.innerHTML += `<p>Date/Time: ${element.date}, Event: ${element.title}</p>`
            })
        })

        async function getData(url) {
            const response = await fetch(url)
            return response.text()
        }
    }
}

export default Calendar;