const canvas = document.getElementById('parkingCanvas');
const ctx = canvas.getContext('2d');
const spotDetails = document.getElementById('spotDetails');

let selectedSpot = null;

// Simulated parking data
const parkingSpots = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  x: 50 + (i % 5) * 80,
  y: 50 + Math.floor(i / 5) * 80,
  available: Math.random() > 0.3
}));

// Draw parking layout
function drawParkingLayout(speed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = speed === '2g' ? '12px Arial' : '14px Arial';

  parkingSpots.forEach(spot => {
    ctx.fillStyle = spot.available ? '#2ecc71' : '#e74c3c';
    ctx.fillRect(spot.x, spot.y, 60, 40);

    ctx.fillStyle = '#fff';
    ctx.fillText(`Spot ${spot.id}`, spot.x + 5, spot.y + 25);
  });

  document.getElementById('status').textContent = 'Parking layout updated.';
}

// Handle canvas click
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  parkingSpots.forEach(spot => {
    if (
      clickX >= spot.x &&
      clickX <= spot.x + 60 &&
      clickY >= spot.y &&
      clickY <= spot.y + 40
    ) {
      selectedSpot = spot;
      showSpotDetails(spot);
    }
  });
});

function showSpotDetails(spot) {
  if (spot.available) {
    spotDetails.innerHTML = `
      <strong>Selected Spot:</strong> ${spot.id}<br>
      Status: Available<br>
      <em>Route guidance: Walk straight to row ${Math.floor(spot.id / 5) + 1}, column ${(spot.id % 5) || 5}</em>
    `;
  } else {
    spotDetails.innerHTML = `
      <strong>Selected Spot:</strong> ${spot.id}<br>
      Status: Taken<br>
      <em>Please select another spot.</em>
    `;
  }
}

// Geolocation API
function getLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      document.getElementById('info').textContent =
        `Location: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)} | Network: ${getNetworkSpeed()}`;
    }, () => {
      document.getElementById('info').textContent = 'Unable to retrieve location.';
    });
  } else {
    document.getElementById('info').textContent = 'Geolocation not supported.';
  }
}

// Network Information API
function getNetworkSpeed() {
  if ('connection' in navigator) {
    return navigator.connection.effectiveType;
  }
  return '4g'; // Default
}

// Initialize
const speed = getNetworkSpeed();
getLocation();
drawParkingLayout(speed);
