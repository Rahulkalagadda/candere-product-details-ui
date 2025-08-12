// Interactions and auto slider behavior
(function () {
  const byId = (id) => document.getElementById(id);

  // Side scroll controls (for arrow buttons)
  const attachSideScroll = (containerId, leftButtonSelector, rightButtonSelector) => {
    const container = byId(containerId);
    if (!container) return;
    const leftBtn = document.querySelector(leftButtonSelector);
    const rightBtn = document.querySelector(rightButtonSelector);
    const delta = () => Math.min(360, Math.max(240, Math.floor(container.clientWidth * 0.8)));
    leftBtn && leftBtn.addEventListener('click', () => container.scrollBy({ left: -delta(), behavior: 'smooth' }));
    rightBtn && rightBtn.addEventListener('click', () => container.scrollBy({ left: delta(), behavior: 'smooth' }));
  };

  // Auto scroll that loops back to start; pauses on hover/focus
  const attachAutoScroll = (containerId, pauseSelectors = [], intervalMs = 3000) => {
    const container = byId(containerId);
    if (!container) return;

    let timerId = null;
    const step = () => Math.min(360, Math.max(240, Math.floor(container.clientWidth * 0.8)));
    const atEnd = () => Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 1;

    const tick = () => {
      if (atEnd()) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step(), behavior: 'smooth' });
      }
    };

    const start = () => {
      stop();
      timerId = window.setInterval(tick, intervalMs);
    };
    const stop = () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    // Pause on hover or focus within container and controls
    const pauseEls = [container, ...pauseSelectors.map((s) => document.querySelector(s)).filter(Boolean)];
    pauseEls.forEach((el) => {
      el.addEventListener('mouseenter', stop);
      el.addEventListener('mouseleave', start);
      el.addEventListener('focusin', stop);
      el.addEventListener('focusout', start);
    });

    start();
  };

  // Wire up scrollers
  attachSideScroll('advantagesTrack', '.pill-nav--left', '.pill-nav--right');
  attachSideScroll('recoTrack', '.carousel-nav--left', '.carousel-nav--right');

  // Autoplay both carousels
  attachAutoScroll('advantagesTrack', ['.pill-nav--left', '.pill-nav--right'], 3500);
  attachAutoScroll('recoTrack', ['.carousel-nav--left', '.carousel-nav--right'], 4000);

  // Store locator interactions
  const locateBtn = byId('locateMe');
  const messageEl = byId('locatorMessage');
  const pincodeInput = byId('pincode');
  const showMessage = (text) => {
    if (messageEl) messageEl.textContent = text;
  };
  const isValidPincode = (val) => /^[0-9]{6}$/.test(val);

  if (pincodeInput) {
    pincodeInput.addEventListener('input', () => {
      const value = pincodeInput.value.trim();
      if (value.length === 0) {
        showMessage('');
      } else if (!/^[0-9]+$/.test(value)) {
        showMessage('Enter numbers only.');
      } else if (value.length < 6) {
        showMessage('Enter a 6‑digit pincode.');
      } else if (isValidPincode(value)) {
        showMessage(`Showing near pincode ${value} – No Nearby Stores Found`);
      }
    });
  }

  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        showMessage('Geolocation is not supported on this device.');
        return;
      }
      showMessage('Locating…');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          showMessage(`Showing near (${latitude.toFixed(3)}, ${longitude.toFixed(3)}) – No Nearby Stores Found`);
        },
        () => {
          showMessage('Unable to fetch your location. Please enter pincode.');
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    });
  }

  // Scroll-to-top button
  const scrollTopBtn = byId('scrollTop');
  const onScroll = () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.style.display = window.scrollY > 400 ? 'grid' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Simple utilities to mimic PDP interactions

(function(){
  const byId = (id)=>document.getElementById(id);

  // Horizontal scrollers for pills and cards
  const attachSideScroll = (containerId, leftBtnSel, rightBtnSel) => {
    const container = byId(containerId);
    if(!container) return;
    const leftBtn = document.querySelector(leftBtnSel);
    const rightBtn = document.querySelector(rightBtnSel);
    const scrollBy = () => Math.min(320, container.clientWidth * 0.9);
    leftBtn && leftBtn.addEventListener('click', ()=> container.scrollBy({left: -scrollBy(), behavior: 'smooth'}));
    rightBtn && rightBtn.addEventListener('click', ()=> container.scrollBy({left: scrollBy(), behavior: 'smooth'}));
  };

  // Candere Advantages
  attachAutoScroll('advantagesTrack', ['.pill-nav--left', '.pill-nav--right'], 3500);
  attachAutoScroll('recoTrack', ['.carousel-nav--left', '.carousel-nav--right'], 4000);


  // Store locator interactions
  const locateBtn = byId('locateMe');
  const messageEl = byId('locatorMessage');
  const pincodeInput = byId('pincode');
  const showMessage = (text) => { if(messageEl) messageEl.textContent = text; };
  const isValidPincode = (val)=>/^[0-9]{6}$/.test(val);

  // Validate as user types
  if(pincodeInput){
    pincodeInput.addEventListener('input', ()=>{
      const value = pincodeInput.value.trim();
      if(value.length === 0){
        showMessage('');
      }else if(!/^[0-9]+$/.test(value)){
        showMessage('Enter numbers only.');
      }else if(value.length < 6){
        showMessage('Enter a 6‑digit pincode.');
      }else if(isValidPincode(value)){
        showMessage(`Showing near pincode ${value} – No Nearby Stores Found`);
      }
    });
  }

  // Locate Me using Geolocation API
  if(locateBtn){
    locateBtn.addEventListener('click', ()=>{
      if(!('geolocation' in navigator)){
        showMessage('Geolocation is not supported on this device.');
        return;
      }
      showMessage('Locating…');
      navigator.geolocation.getCurrentPosition(pos =>{
        const { latitude, longitude } = pos.coords;
        showMessage(`Showing near (${latitude.toFixed(3)}, ${longitude.toFixed(3)}) – No Nearby Stores Found`);
      }, () =>{
        showMessage('Unable to fetch your location. Please enter pincode.');
      }, { enableHighAccuracy:false, timeout:6000, maximumAge:60000 });
    });
  }

  // Scroll to top visibility
  const scrollTopBtn = byId('scrollTop');
  const onScroll = () => {
    if(!scrollTopBtn) return;
    scrollTopBtn.style.display = window.scrollY > 400 ? 'grid' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  scrollTopBtn && scrollTopBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
})();


