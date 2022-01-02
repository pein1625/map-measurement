let map, measureTool;

function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    return;
  }

  const mapData = JSON.parse(mapEl.dataset.json);

  if (!mapData) {
    console.log("Không xác định được map data!");
    return;
  }

  map = new google.maps.Map(mapEl, {
    center: mapData.center,
    zoom: mapData.zoom
  });

  // add image overlay
  imageOverlay = new google.maps.GroundOverlay(mapData.image, mapData.imageBounds, {
    clickable: false
  });
  imageOverlay.setMap(map);

  // add measure tool
  var measureTool = new MeasureTool(map, {
    showSegmentLength: true,
    contextMenu: false
  });

  const startMeasurement = document.getElementById("start-measurement");
  const endMeasurement = document.getElementById("end-measurement");
  const measurementInfo = document.getElementById("measurement-info");
  const totalDistance = document.getElementById("total-distance");
  const totalArea = document.getElementById("total-area");

  startMeasurement.addEventListener("click", function () {
    startMeasurement.disabled = true;
    endMeasurement.disabled = false;
    measurementInfo.classList.add('d-block');
    totalDistance.innerHTML = "0";
    totalArea.innerHTML = "0";
    measureTool.start();
  });
  endMeasurement.addEventListener("click", function () {
    measureTool.end();
    startMeasurement.disabled = false;
    endMeasurement.disabled = true;
    measurementInfo.classList.remove('d-block');
  });
  endMeasurement.disabled = true;

  measureTool.addListener('measure_change', function () {
    totalDistance.innerHTML = measureTool.lengthText;
    totalArea.innerHTML = measureTool.areaText;
  });

  // change map styles
  const styleBtns = document.querySelectorAll('.js-map-styles');

  changeMapStyles(Array.from(styleBtns).find(btn => btn.classList.contains('active')));

  styleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      changeMapStyles(btn);
    });
  });

  function changeMapStyles(btn) {
    if (!btn) return;
    styleBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    btn.classList.add('active');
    const jsonData = btn.dataset.json || "[]";
    const styles = JSON.parse(jsonData);
    map.setOptions({
      styles: styles
    });
  }
}

// toggle sidebar
const aside = document.getElementById('aside');
const toggleBtn = document.getElementById('toggle-aside');

toggleBtn.addEventListener('click', function () {
  if (aside.classList.contains('is-show')) {
    aside.classList.remove('is-show');
  } else {
    aside.classList.add('is-show');
  }
});