(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const deck = document.getElementById('presentation');
  const body = document.body;
  const progressFill = document.getElementById('progressFill');
  const currentChapterLabel = document.getElementById('currentChapterLabel');
  const currentPage = document.getElementById('currentPage');
  const screenReaderStatus = document.getElementById('screenReaderStatus');
  const previousButton = document.getElementById('previousButton');
  const nextButton = document.getElementById('nextButton');
  const markers = Array.from(document.querySelectorAll('.chapter-marker'));
  const chapterDialog = document.getElementById('chapterDialog');
  const helpDialog = document.getElementById('helpDialog');
  const overviewGrid = document.getElementById('overviewGrid');
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let traceTimers = [];
  let traceRun = 0;
  let touchStart = null;

  const pad = (number) => String(number).padStart(2, '0');

  function updateControls(index) {
    const slide = slides[index];
    const position = ((index + 1) / slides.length) * 100;
    progressFill.style.width = `${position}%`;
    currentChapterLabel.textContent = slide.dataset.short || slide.dataset.title || `CHAPTER ${pad(index + 1)}`;
    currentPage.textContent = pad(index + 1);
    previousButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;

    markers.forEach((marker, markerIndex) => {
      const selected = markerIndex === index;
      marker.classList.toggle('is-current', selected);
      if (selected) {
        marker.setAttribute('aria-current', 'step');
      } else {
        marker.removeAttribute('aria-current');
      }
    });

    const overviewCards = overviewGrid.querySelectorAll('.overview-card');
    overviewCards.forEach((card, cardIndex) => card.classList.toggle('is-current', cardIndex === index));
  }

  function goTo(requestedIndex) {
    const targetIndex = Math.max(0, Math.min(slides.length - 1, Number(requestedIndex)));
    if (!Number.isInteger(targetIndex) || targetIndex === activeIndex) return;

    body.dataset.direction = targetIndex > activeIndex ? 'forward' : 'back';
    if (activeIndex === 4 && targetIndex !== 4) clearTrace();
    slides[activeIndex].classList.remove('is-active');
    slides[activeIndex].setAttribute('aria-hidden', 'true');
    slides[activeIndex].setAttribute('inert', '');

    activeIndex = targetIndex;
    slides[activeIndex].classList.add('is-active');
    slides[activeIndex].setAttribute('aria-hidden', 'false');
    slides[activeIndex].removeAttribute('inert');
    updateControls(activeIndex);

    const title = slides[activeIndex].dataset.title || `Chapter ${activeIndex + 1}`;
    screenReaderStatus.textContent = `Slide ${activeIndex + 1} of ${slides.length}: ${title}`;
    window.setTimeout(() => {
      if (activeIndex === targetIndex) body.dataset.direction = 'still';
    }, 820);
  }

  function buildOverview() {
    overviewGrid.replaceChildren();
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.className = 'overview-card';
      button.type = 'button';
      button.dataset.goto = String(index);
      button.setAttribute('aria-label', `Go to slide ${index + 1}: ${slide.dataset.title}`);

      const number = document.createElement('span');
      number.className = 'overview-number';
      number.textContent = pad(index + 1);
      const date = document.createElement('span');
      date.className = 'overview-date';
      date.textContent = slide.dataset.date || '';
      const title = document.createElement('span');
      title.className = 'overview-title';
      title.textContent = slide.dataset.title || `Chapter ${index + 1}`;
      const hint = document.createElement('span');
      hint.className = 'overview-hint';
      hint.textContent = 'Open chapter  ↗';
      button.append(number, date, title, hint);
      button.addEventListener('click', () => {
        chapterDialog.close();
        goTo(index);
      });
      overviewGrid.append(button);
    });
  }

  function openDialog(dialog) {
    if (dialog && !dialog.open) dialog.showModal();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      const request = document.documentElement.requestFullscreen?.();
      if (request && typeof request.catch === 'function') request.catch(() => {});
    } else {
      const exit = document.exitFullscreen?.();
      if (exit && typeof exit.catch === 'function') exit.catch(() => {});
    }
  }

  buildOverview();
  updateControls(activeIndex);

  document.querySelector('.wordmark').addEventListener('click', (event) => {
    event.preventDefault();
    goTo(0);
  });
  document.getElementById('beginButton').addEventListener('click', () => goTo(1));
  document.getElementById('replayButton').addEventListener('click', () => goTo(0));
  previousButton.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton.addEventListener('click', () => goTo(activeIndex + 1));
  markers.forEach((marker) => marker.addEventListener('click', () => goTo(Number(marker.dataset.goto))));

  document.getElementById('chaptersButton').addEventListener('click', () => openDialog(chapterDialog));
  document.getElementById('helpButton').addEventListener('click', () => openDialog(helpDialog));
  document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const fullscreen = Boolean(document.fullscreenElement);
    body.classList.toggle('is-fullscreen', fullscreen);
    const button = document.getElementById('fullscreenButton');
    button.setAttribute('aria-label', fullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    button.title = fullscreen ? 'Exit fullscreen' : 'Fullscreen';
  });

  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });

  [chapterDialog, helpDialog].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (chapterDialog.open || helpDialog.open) return;
    const target = event.target;
    const isEditing = target instanceof HTMLElement && (
      target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
    const isTimelineControl = target instanceof HTMLElement && target.closest('[role="tablist"]');
    if (isEditing || (isTimelineControl && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key))) return;

    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if ((event.code === 'Space' || event.key === ' ') && !target.closest('button, a, [role="tab"]')) {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key.toLowerCase() === 'g' && !event.repeat) {
      openDialog(chapterDialog);
    } else if (event.key.toLowerCase() === 'f' && !event.repeat) {
      toggleFullscreen();
    } else if (event.key === '?') {
      openDialog(helpDialog);
    }
  });

  deck.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }, { passive: true });

  deck.addEventListener('touchend', (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 62 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      goTo(activeIndex + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });

  // Keep the early timeline usable with both pointer and keyboard.
  const earlyEvents = {
    proposal: {
      year: '1989',
      title: 'A proposal for a web of information',
      copy: 'Tim Berners-Lee submits his idea for a linked information system at CERN. The first version is modest; the ambition is universal.'
    },
    browser: {
      year: '1990',
      title: 'The first browser and server',
      copy: 'Berners-Lee builds a browser-editor called WorldWideWeb and the first web server on a NeXT computer. The tools are made to create as well as read.'
    },
    site: {
      year: '1991',
      title: 'The first website goes live',
      copy: 'The site at info.cern.ch explains the World Wide Web itself—and shows how to make a page, set up a server, and follow a link.'
    },
    public: {
      year: '1993',
      title: 'The Web is opened to everyone',
      copy: 'CERN releases the Web software into the public domain. No license fee, no single owner: anyone can build on the idea.'
    }
  };
  const timelineStops = Array.from(document.querySelectorAll('.timeline-stop'));
  const earlyTimelineYear = document.getElementById('earlyTimelineYear');
  const earlyTimelineTitle = document.getElementById('earlyTimelineTitle');
  const earlyTimelineCopy = document.getElementById('earlyTimelineCopy');

  function selectEarlyEvent(button) {
    const event = earlyEvents[button.dataset.event];
    if (!event) return;
    timelineStops.forEach((stop) => {
      const selected = stop === button;
      stop.classList.toggle('is-selected', selected);
      stop.setAttribute('aria-selected', String(selected));
      stop.tabIndex = selected ? 0 : -1;
    });
    earlyTimelineYear.textContent = event.year;
    earlyTimelineTitle.textContent = event.title;
    earlyTimelineCopy.textContent = event.copy;
  }

  timelineStops.forEach((button, index) => {
    button.addEventListener('click', () => selectEarlyEvent(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % timelineStops.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + timelineStops.length) % timelineStops.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = timelineStops.length - 1;
      timelineStops[nextIndex].focus();
      selectEarlyEvent(timelineStops[nextIndex]);
    });
  });
  timelineStops.forEach((button, index) => { button.tabIndex = index === 0 ? 0 : -1; });

  // A little hands-on responsive design: one composition, three widths.
  const deviceStage = document.getElementById('deviceStage');
  const deviceCaption = document.getElementById('deviceCaption');
  const deviceChoices = Array.from(document.querySelectorAll('[data-device-choice]'));
  const deviceCaptions = {
    desktop: 'WIDE VIEW / MULTI-COLUMN',
    tablet: 'MID-SIZE VIEW / FLEXIBLE GRID',
    phone: 'POCKET VIEW / ONE COLUMN'
  };
  deviceChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const device = choice.dataset.deviceChoice;
      deviceStage.dataset.device = device;
      deviceCaption.textContent = deviceCaptions[device];
      deviceChoices.forEach((otherChoice) => otherChoice.setAttribute('aria-pressed', String(otherChoice === choice)));
    });
  });

  // Trace a made-up post as it moves from one person through a connected web.
  const traceButton = document.getElementById('traceButton');
  const creatorStage = document.getElementById('creatorStage');
  const traceCaption = document.getElementById('traceCaption');
  const traceSteps = [
    'MAKE SOMETHING',
    'PUBLISH IT',
    'SOMEONE SHARES IT',
    'SOMEONE REMIXES IT',
    'A NEW CONNECTION'
  ];
  const traceDefault = 'WRITE → PUBLISH → SHARE → REMIX';

  function clearTrace() {
    traceRun += 1;
    traceTimers.forEach(window.clearTimeout);
    traceTimers = [];
    creatorStage.classList.remove('is-tracing');
    traceCaption.textContent = traceDefault;
    traceButton.querySelector('span:nth-child(2)').textContent = 'Trace a post across the web';
  }

  traceButton.addEventListener('click', () => {
    traceTimers.forEach(window.clearTimeout);
    traceTimers = [];
    traceRun += 1;
    const thisRun = traceRun;
    creatorStage.classList.remove('is-tracing');
    // Restart the CSS packet loop cleanly on repeat plays.
    void creatorStage.offsetWidth;
    creatorStage.classList.add('is-tracing');
    traceButton.querySelector('span:nth-child(2)').textContent = 'Tracing the connection…';
    traceCaption.textContent = traceSteps[0];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      traceCaption.textContent = traceSteps[traceSteps.length - 1];
      traceButton.querySelector('span:nth-child(2)').textContent = 'Trace it again';
      creatorStage.classList.remove('is-tracing');
      return;
    }
    traceSteps.slice(1).forEach((step, index) => {
      const timer = window.setTimeout(() => {
        if (thisRun === traceRun) traceCaption.textContent = step;
      }, (index + 1) * 850);
      traceTimers.push(timer);
    });
    const finish = window.setTimeout(() => {
      if (thisRun !== traceRun) return;
      creatorStage.classList.remove('is-tracing');
      traceButton.querySelector('span:nth-child(2)').textContent = 'Trace it again';
    }, 4700);
    traceTimers.push(finish);
  });

  // Gentle parallax on the title image; disabled for touch and reduced motion.
  const coverParallax = document.getElementById('coverParallax');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pointerFrame = 0;
  if (coverParallax && !reduceMotion.matches && window.matchMedia('(pointer: fine)').matches) {
    deck.addEventListener('pointermove', (event) => {
      if (activeIndex !== 0) return;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = deck.getBoundingClientRect();
        const offsetX = ((event.clientX - rect.left) / rect.width - .5) * 14;
        const offsetY = ((event.clientY - rect.top) / rect.height - .5) * 12;
        coverParallax.style.transform = `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0)`;
      });
    });
    deck.addEventListener('pointerleave', () => {
      coverParallax.style.transform = 'translate3d(0, 0, 0)';
    });
  }
})();
