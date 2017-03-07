let rowIndex = 0;
let currentRotation = 0;
const icons = {
  'clear-day': 'fa-sun-o',
  'clear-night': 'fa-moon-o',
  'rain': 'fa-tint',
  'snow': 'fa-snowflake-o',
  'sleet': 'fa-snowflake-o',
  'wind': 'fa-skyatlas',
  'fog': 'fa-soundcloud',
  'cloudy': 'fa-cloud',
  'partly-cloudy-day': 'fa-soundcloud',
  'partly-cloudy-night': 'fa-soundcloud'
}

function initApp() {
 appLoop();
 navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);
  fetch('/api/data', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  })
  .then(response => response.json())
  .then(response => update(response))
  .catch(err => alert(err));
 });
 const mainInterval = setInterval(appLoop, 1000);
 window.controller = Leap.loop({
   enableGestures: true
 }, function(frame) {
  if (frame.valid && frame.gestures.length > 0) {
    frame.gestures.forEach(function(gesture) {
      // console.log(gesture)
      switch (gesture.type){
        case "circle":
          // console.log("Circle Gesture", gesture);
          let clockwise = false;

          const pointableID = gesture.pointableIds[0];
          const direction = frame.pointable(pointableID).direction;
          if (!direction || !gesture.normal) return;
          const dotProduct = Leap.vec3.dot(direction, gesture.normal);
          
          if (dotProduct  >  0) clockwise = true;
          const scrollDir = clockwise ? 'down' : 'up';
          
          if (gesture.state === 'start') {
            currentRotation = 0;
          }
          
          if (Math.round(gesture.progress) > currentRotation) {
            currentRotation = Math.round(gesture.progress);
            scroll(scrollDir);
          }
          
          break;
        case "keyTap":
          console.log("Key Tap Gesture");
          break;
        case "screenTap":
          console.log("Screen Tap Gesture");
          break;
        case "swipe":
          console.log("Swipe Gesture");
          break;
      }
    });
  }
 });
// setTimeout(() => {
//   window.location = window.location;
// }, 10000);
}

function appLoop() {
  $('#time').html(moment(Date.now()).format('LT'));
  $('#date').html(moment(Date.now()).format('LL'));
}

function scroll(direction) {
  const content = $('.scrollable').first();
  
  if ((rowIndex + 1 >= content.children().length && direction === 'down')
  || (rowIndex - 1 < 0) && direction === 'up') {
    return;
  }
  
  const currentRow = $('.contentrow.selected').first();
  rowIndex = direction === 'down' ? rowIndex + 1 : rowIndex - 1;
  const delta = direction === 'down' ? currentRow.outerHeight() : -1 * currentRow.outerHeight();
  currentRow.removeClass('selected');
  $(content.children().get(rowIndex)).addClass('selected');

  console.log('scrolling to ', delta, content.scrollTop())
  content.animate({
    scrollTop: delta + content.scrollTop(),
  }, {
    queue: true,
    duration: 100
  });
}

// update(results<Object>)
// Updates HTML contents with results object returned
// from server. Will include the following properties:
// { weather: {...}, twitter: {...}, ...}

function update(results) {
  console.log(results);
  $('#weather-num').html(results.weather.temperature);
  $('#weather-icon').html(`<i class="fa ${icons[results.weather.icon]}"></i>`);
  
  $('#apparentTemperature').html(results.weather.apparentTemperature);
  $('#cloudCover').html(results.weather.cloudCover);
  $('#dewPoint').html(results.weather.dewPoint);
  $('#humidity').html(results.weather.humidity);
  $('#icon').html(results.weather.icon);
  $('#nearestStormDistance').html(results.weather.nearestStormDistance);
  $('#ozone').html(results.weather.ozone);
  $('#precipProbability').html(results.weather.precipProbability);
  $('#pressure').html(results.weather.pressure);
  $('#summary').html(results.weather.summary);
  $('#temperature').html(results.weather.temperature);
  $('#time').html(results.weather.time);
  $('#visibility').html(results.weather.visibility);
  $('#windSpeed').html(results.weather.windSpeed);
  $('#windBearing').html(results.weather.windBearing);
  // in the update function
  let tweets = results.twitter;
  const rows = tweets.map(function(tweet, i) {
    return `<div class="row contentrow ${i === 0 ? 'selected' : ''}">
      <div class="col-xs-1">
        <img class="" src="${tweet.user.profile_image_url_https}">
      </div>
      <div class="col-xs-8">
        <p class="heading">${tweet.user.name} (@${tweet.user.screen_name})</p>
        <p class="content">${tweet.text}</p>
      </div>
    </div>`;
  });
  $('.twitter .scrollable').first().html(rows);
}

initApp();
