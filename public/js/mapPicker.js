(() => {
  const INDIA_CENTER = [20.5937, 78.9629];

  const fetchAddressByQuery = async (query) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
    );
    return response.json();
  };

  const fetchAddressByCoordinates = async (lat, lng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`
    );
    return response.json();
  };

  window.initListingMapPicker = ({
    mapId,
    searchInputId,
    locationInputId,
    countryInputId,
    latInputId,
    lngInputId,
    initialLat,
    initialLng,
  }) => {
    if (typeof L === "undefined") return;

    const mapNode = document.getElementById(mapId);
    const searchInput = document.getElementById(searchInputId);
    const locationInput = document.getElementById(locationInputId);
    const countryInput = document.getElementById(countryInputId);
    const latInput = document.getElementById(latInputId);
    const lngInput = document.getElementById(lngInputId);

    if (!mapNode || !searchInput || !locationInput || !countryInput || !latInput || !lngInput) return;

    const hasInitialCoordinates = Number.isFinite(initialLat) && Number.isFinite(initialLng);
    const map = L.map(mapId).setView(hasInitialCoordinates ? [initialLat, initialLng] : INDIA_CENTER, hasInitialCoordinates ? 13 : 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker(hasInitialCoordinates ? [initialLat, initialLng] : INDIA_CENTER, {
      draggable: true,
    }).addTo(map);

    const setCoordinates = (lat, lng) => {
      latInput.value = Number(lat).toFixed(6);
      lngInput.value = Number(lng).toFixed(6);
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng], 13);
    };

    const applyAddress = (addressObj) => {
      if (!addressObj) return;
      const fullAddress = addressObj.display_name || "";
      const country = (addressObj.address && addressObj.address.country) || "";
      locationInput.value = fullAddress;
      countryInput.value = country;
    };

    marker.on("dragend", async () => {
      const { lat, lng } = marker.getLatLng();
      setCoordinates(lat, lng);
      try {
        const place = await fetchAddressByCoordinates(lat, lng);
        applyAddress(place);
      } catch (err) {
        // Keep the selected coordinates even if reverse geocoding fails.
      }
    });

    searchInput.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;

      try {
        const results = await fetchAddressByQuery(query);
        if (!Array.isArray(results) || results.length === 0) return;
        const place = results[0];
        const lat = Number(place.lat);
        const lng = Number(place.lon);
        setCoordinates(lat, lng);
        applyAddress(place);
      } catch (err) {
        // No UI alert to avoid interrupting form flow.
      }
    });

    if (hasInitialCoordinates) {
      latInput.value = initialLat.toFixed(6);
      lngInput.value = initialLng.toFixed(6);
    }
  };
})();
