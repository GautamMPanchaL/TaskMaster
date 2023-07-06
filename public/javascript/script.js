// Select all the countdown timer elements
const countdownTimers = document.querySelectorAll('.countdown-timer');

// Alarm 
// const notifier = require('node-notifier');
function notifyMe(x,y){
  if (!window.Notification) {
    console.log('Browser does not support notifications.')
  } else {
    // check if permission is already granted
    if (Notification.permission === 'granted') {
      // show notification here
          const notify = new Notification(x, {
            body: y,
            icon : "/images/Task.jpg",
            vibrate: true
          })
          if(y === "Deadline has been reached"){
            var audio = new Audio('/audio/wind_chimes.mp3');
            audio.loop = true;
            console.log(1);
            // audio.autoplay = true;
              notify.onshow = function(){
                audio.play();
              };
              notify.onclick = function(){
                audio.pause();
			          audio.currentTime = 0;
                audio.remove();
              };
              notify.onclose = function(){
                audio.pause();
			          audio.currentTime = 0;
                audio.remove();
              };
              setTimeout(() => {
                  notify.close();
              }, 30 * 1000);
          }
    } else {
      // request permission from the user
      Notification.requestPermission()
      .then(function (p) {
        if (p === 'granted') {
          // show notification here
          const notify = new Notification(x, {
            body: y,
            icon : "/images/Task.jpg",
            vibrate: true
          })
          if(y === "Deadline has been reached"){
            var audio = new Audio('/audio/wind_chimes.mp3');
            audio.loop = true;
            console.log(2);
            // audio.autoplay = true;
              notify.onshow = function(){
                audio.play();
              };
              notify.onclick = function(){
                audio.pause();
			          audio.currentTime = 0;
                audio.remove();
              };
              notify.onclose = function(){
                audio.pause();
			          audio.currentTime = 0;
                audio.remove();
              };
              setTimeout(() => {
                  notify.close();
              }, 30 * 1000);
          }
        } else {
          console.log('User has blocked notifications.')
        }
      })
      .catch(function (err) {
        console.error(err)
      })
    }
  }
}
// Loop through each countdown timer element
countdownTimers.forEach(timer => {
  // Get the deadline time from the data attribute
  const deadlineTime = new Date(timer.dataset.deadline).getTime();
  // console.log(timer.dataset.name);
  // Update the countdown timer every second
  const countdownInterval = setInterval(() => {
    // Get the current time
    const now = new Date().getTime();

    // Calculate the remaining time
    const remainingTime = deadlineTime - now;

    // If the remaining time is less than 0, the deadline has passed
    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      timer.innerHTML = 'Deadline passed';
      return;
    }

    // Calculate the remaining days, hours, minutes, and seconds
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Update the countdown timer element with the remaining time
    if(days === 0 && hours === 0 && minutes === 0 && seconds === 0){
        // alert(timer.dataset.name);
        notifyMe(timer.dataset.name,"Deadline has been reached");
    }
    else if(days === 0 && hours === 0 && minutes === 30 && seconds === 0){
        // alert(timer.dataset.name);
        notifyMe(timer.dataset.name,"30 minutes remaining to reach Deadline.");
    }
    timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
});

