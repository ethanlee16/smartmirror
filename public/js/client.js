let rowIndex = 0;

function init() {
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
  currentRow.removeClass('selected');
  rowIndex = direction === 'down' ? rowIndex + 1 : rowIndex - 1;
  const delta = direction === 'down' ? currentRow.outerHeight() : -1 * currentRow.outerHeight();
  
  $(content.children().get(rowIndex)).addClass('selected');
  console.log('scrolling to ', delta, content.scrollTop())
  
  // content.scroll();
  content.animate({
    scrollTop: delta + content.scrollTop()
  }, 1000);
}

// update(results<Object>)
// Updates HTML contents with results object returned
// from server. Will include the following properties:
// { weather: {...}, twitter: {...}, ...}
function update(results) {
  console.log(results);
  $('#weather-num').html(results.weather.temperature);
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
    </div>`
  });
  $('.scrollable').first().html(rows);
}

init();

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