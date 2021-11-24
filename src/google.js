

// Client ID and API key from the Developer Console
const CLIENT_ID = '158344361076-ua728i4fud3s2r1r859oi0tk318deh4v.apps.googleusercontent.com';
const client_secret = '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'
const API_KEY = '<YOUR_API_KEY>';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');
const calendar = document.getElementById('calendar')
const date = document.getElementById('date')
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
date.innerHTML = today.toDateString()

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    // apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
  const pre = document.getElementById('content');
  pre.innerHTML = ''
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  const pre = document.getElementById('content');
  pre.innerHTML = 'Login to see your calendar.'
  gapi.auth2.getAuthInstance().signOut();
  
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message, blockElement, tag) {
  const pre = document.getElementById('content');
  const elementContent = document.createElement(blockElement)
  elementContent.className += tag
  const textContent = document.createTextNode(message + '\n');
  elementContent.appendChild(textContent)
  pre.appendChild(elementContent);
}


let getEventInformation = (event) => {
  let when = event.start.dateTime;

  if (!when) {
    when = event.start.date;
  }

  let date = new Date(when)
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let meridiem = ''

  if (hour < 12) {
    meridiem = 'AM'
  } else if (hour === 12) {
    meridiem = 'PM'
  } else if (hour > 12) {
    meridiem = 'PM'
    hour -= 12
  }

  minutes = minutes.toString()
  if (minutes.length < 2) {
    minutes = '0' + minutes
  } 

  let hasTodayClass = document.getElementsByClassName('today');
  let hasTomorrowClass = document.getElementsByClassName('tomorrow');

  if (date.toDateString() === today.toDateString()) {
    if (hasTodayClass.length === 0) {
      appendPre(`Today's events:`, 'div', 'today');
    }
    appendPre(`${hour}:${minutes} ${meridiem} - ${event.summary}`, 'p', 'calender-event')
    // let today = document.getElementsByClassName('today')
    // today.appendChild(`${hour}:${minutes} ${meridiem} ${event.summary}`)
    // appendTitle(`${hour}:${minutes} ${meridiem} ${event.summary}`, 'today')
  } 
  else if (date.toDateString() === tomorrow.toDateString()) {
    if (hasTomorrowClass.length === 0) {
      appendPre(`Tomorrow's events:`, 'div', 'tomorrow');
    }
    appendPre(`${hour}:${minutes} ${meridiem} - ${event.summary}`, 'p', 'calender-event')
  }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    let events = response.result.items;
  
    
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        let event = events[i];
        getEventInformation(event)
      } 
      
    } else {
      appendPre('No upcoming events found.', 'h2')
    }

    
  });
}

calendar.addEventListener('click', event => {
  event.preventDefault()
  document.getElementById('content').innerHTML = ''
  listUpcomingEvents()
})