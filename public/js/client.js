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
 });
 const mainInterval = setInterval(appLoop, 1000);
 setTimeout(() => {
   window.location = window.location;
 }, 10000);
}

function appLoop() {
  $('#time').html(moment(Date.now()).format('LT'));
  $('#date').html(moment(Date.now()).format('LL'));
}

function update() {
  
}

init();