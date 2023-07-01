// Select all the countdown timer elements
const countdownTimers = document.querySelectorAll('.countdown-timer');

// Loop through each countdown timer element
countdownTimers.forEach(timer => {
  // Get the deadline time from the data attribute
  const deadlineTime = new Date(timer.dataset.deadline).getTime();

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
    timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
});


function calculateBarWidth(deadline) {
  const currentDate = new Date();
  const deadlineDate = new Date(deadline);
  const totalDays = Math.ceil((deadlineDate - currentDate) / (1000 * 60 * 60 * 24)); // Calculate the difference in days
  const maxWidth = 300; // Set the maximum width for the bar
  const minWidth = 100; // Set the minimum width for the bar
  const width = (totalDays / 30) * (maxWidth - minWidth) + minWidth; // Adjust the calculation based on your preference

  return `${width}px`; // Return the calculated width with "px" unit
}

