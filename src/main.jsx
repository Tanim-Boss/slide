import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Player } from '@remotion/player';
import { useCurrentFrame } from 'remotion';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Command,
  Globe2, Layers3, Link2, Maximize, Pause, Play, VolumeX, X,
} from 'lucide-react';
import '@fontsource/noto-sans-bengali/400.css';
import '@fontsource/noto-sans-bengali/500.css';
import '@fontsource/noto-sans-bengali/600.css';
import '@fontsource/noto-sans-bengali/700.css';
import './styles.css';

const SOURCE = 'https://home.cern/science/computing/the-birth-of-the-web/short-history-web/';

const slides = [
  {
    id: 'cover', kicker: 'একটি সংযুক্ত পৃথিবীর গল্প', year: '১৯৮৯ — আজ',
    title: <>ওয়েবের<br /><em>ইতিহাস</em></>,
    description: 'একটি গবেষণাগারের প্রস্তাব থেকে—পৃথিবীর সবচেয়ে বড় সংযোগের গল্প।',
    type: 'cover',
  },
  {
    id: 'need', kicker: '০১  /  প্রেক্ষাপট', year: 'সিইআরএন · ১৯৮৯',
    title: <>সমস্যাটা ছিল<br /><em>দূরত্ব।</em></>,
    description: 'সিইআরএনের বিজ্ঞানীরা কাজ করতেন বিশ্বের নানা বিশ্ববিদ্যালয় ও গবেষণাগারে। তাদের দরকার ছিল তথ্য ভাগ করে নেওয়ার সহজ, নির্ভরযোগ্য উপায়।',
    type: 'need',
    stat: '১৭,০০০+', statLabel: 'বিজ্ঞানী · ১০০টিরও বেশি দেশ',
    quote: 'তথ্য ছিল—কিন্তু একে অন্যের কাছে পৌঁছানোর পথ ছিল না।',
  },
  {
    id: 'idea', kicker: '০২  /  একটি প্রস্তাব', year: 'মার্চ ১৯৮৯',
    title: <>একটি জালের<br /><em>কল্পনা।</em></>,
    description: 'টিম বার্নার্স-লি কম্পিউটার, ডেটা নেটওয়ার্ক ও হাইপারটেক্সটকে মিলিয়ে ভাবলেন—তথ্য যদি লিংকে লিংকে পরস্পরকে খুঁজে পায়?',
    type: 'idea',
    quote: '“Information Management: A Proposal”',
    attribution: 'টিম বার্নার্স-লি · সিইআরএন',
  },
  {
    id: 'first', kicker: '০৩  /  প্রথম ওয়েব', year: '১৯৯০ — ১৯৯১',
    title: <>তিনটি জিনিসে<br /><em>শুরু।</em></>,
    description: 'একটি ওয়েব সার্ভার, একটি ব্রাউজার, আর একে অন্যের দিকে নির্দেশ করা হাইপারটেক্সট পৃষ্ঠা।',
    type: 'first',
    quote: 'info.cern.ch',
    attribution: 'বিশ্বের প্রথম ওয়েবসাইটের ঠিকানা',
  },
  {
    id: 'release', kicker: '০৪  /  সবার জন্য', year: '১৯৯১ — ১৯৯৩',
    title: <>দরজা খুলল<br /><em>সবার জন্য।</em></>,
    description: '১৯৯১-এ সফটওয়্যার ছড়িয়ে পড়ে গবেষকদের মধ্যে। ১৯৯৩-এর ৩০ এপ্রিল সিইআরএন ওয়েবের সোর্স কোড রয়্যালটি-ফ্রি করে দেয়।',
    type: 'release',
    stat: '৩০.০৪.১৯৯৩', statLabel: 'ওয়েবের কোড সবার জন্য উন্মুক্ত',
    quote: 'মালিকানার দেয়াল নয়—খোলা মানই ওয়েবকে বাড়তে দিল।',
  },
  {
    id: 'mosaic', kicker: '০৫  /  বিশ্বজুড়ে বিস্তার', year: '১৯৯৩ — ১৯৯৪',
    title: <>দেখা সহজ।<br /><em>বাড়ল দ্রুত।</em></>,
    description: 'এনসিএসএ-র Mosaic ব্রাউজার ওয়েবকে আরও ব্যবহারবান্ধব করল। ১৯৯৪-এর শেষে ওয়েবে ছিল ১০,০০০ সার্ভার এবং প্রায় ১ কোটি ব্যবহারকারী।',
    type: 'mosaic',
    stat: '১০,০০০', statLabel: 'সার্ভার · ১৯৯৪ সালের শেষ',
  },
  {
    id: 'open', kicker: '০৬  /  উন্মুক্ত মান', year: '১৯৯৪ →',
    title: <>কেউ একা<br /><em>মালিক নয়।</em></>,
    description: 'ওয়েব যেন সবার জন্য উন্মুক্ত থাকে—এই লক্ষ্যেই ১৯৯৪ সালে টিম বার্নার্স-লি MIT-তে গড়ে তোলেন World Wide Web Consortium, বা W3C।',
    type: 'open',
    quote: 'একটি উন্মুক্ত মান। অসংখ্য নির্মাতা। এক পৃথিবী।',
    attribution: 'ওয়েবের নকশা—সবার অংশগ্রহণে',
  },
  {
    id: 'timeline', kicker: 'শেষ / শুরু', year: '১৯৮৯ — আজ',
    title: <>একটি লিংক।<br /><em>অসীম সম্ভাবনা।</em></>,
    description: 'গবেষণাগারের বিজ্ঞানীদের তথ্য ভাগ করার জন্য যে ধারণা—তা বদলে দিয়েছে যোগাযোগ, জ্ঞান আর আমাদের দৈনন্দিন জীবন।',
    type: 'timeline',
  },
];

function FilmPulse() {
  const frame = useCurrentFrame();
  const drift = (frame % 180) / 180;
  return (
    <svg className="remotion-pulse" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <defs><radialGradient id="pulseGlow"><stop stopColor="#a0d9ff" stopOpacity=".22" /><stop offset="1" stopColor="#7692ff" stopOpacity="0" /></radialGradient></defs>
      <circle cx={1420 + Math.sin(drift * Math.PI * 2) * 28} cy="505" r="410" fill="url(#pulseGlow)" opacity={0.5 + Math.sin(drift * Math.PI * 2) * 0.14} />
    </svg>
  );
}

function RemotionFilmLayer() {
  return <Player component={FilmPulse} durationInFrames={180} compositionWidth={1920} compositionHeight={1080} fps={30} loop autoPlay controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.42 }} />;
}

function ThreeNetwork({ activeIndex }) {
  const canvasRef = useRef(null);
  const currentIndex = useRef(activeIndex);
  useEffect(() => { currentIndex.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8.2);
    const group = new THREE.Group();
    scene.add(group);

    const count = 148;
    const points = [];
    const radius = 2.15;
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * i;
      points.push(new THREE.Vector3(Math.cos(angle) * ringRadius * radius, y * radius, Math.sin(angle) * ringRadius * radius));
    }
    const pointPositions = new Float32Array(count * 3);
    points.forEach((p, i) => { pointPositions[i * 3] = p.x; pointPositions[i * 3 + 1] = p.y; pointPositions[i * 3 + 2] = p.z; });
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    const pointMaterial = new THREE.PointsMaterial({ color: 0xb7dfff, size: 0.045, transparent: true, opacity: 0.9, sizeAttenuation: true });
    group.add(new THREE.Points(pointGeometry, pointMaterial));

    const linePositions = [];
    points.forEach((p, i) => {
      const neighbors = points.map((q, j) => ({ j, distance: p.distanceTo(q) })).filter((v) => v.j !== i && v.distance < 0.83).sort((a, b) => a.distance - b.distance).slice(0, 3);
      neighbors.forEach(({ j }) => { if (j > i) { linePositions.push(p.x, p.y, p.z, points[j].x, points[j].y, points[j].z); } });
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x6483c8, transparent: true, opacity: 0.27 })));

    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x83c8ff, transparent: true, opacity: 0.17, side: THREE.DoubleSide });
    [2.48, 2.62].forEach((r, index) => {
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0035, 8, 180), orbitMaterial);
      orbit.rotation.x = index === 0 ? 0.73 : 1.28;
      orbit.rotation.y = index === 0 ? -0.38 : 0.7;
      group.add(orbit);
    });
    const glow = new THREE.PointLight(0x598cff, 4.5, 8);
    glow.position.set(-2.4, 1.8, 3.2);
    scene.add(glow);
    const ambient = new THREE.AmbientLight(0x6883b8, 1.6);
    scene.add(ambient);

    let width = 1; let height = 1; let raf;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const idx = currentIndex.current;
      group.rotation.y = t * 0.045 + idx * 0.11;
      group.rotation.x = Math.sin(t * 0.14) * 0.06;
      group.scale.setScalar(idx === 0 ? 1 : 0.82);
      pointMaterial.opacity = idx === 0 ? 0.91 : 0.52;
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(raf); observer.disconnect(); renderer.dispose(); pointGeometry.dispose(); lineGeometry.dispose(); pointMaterial.dispose(); orbitMaterial.dispose(); scene.clear(); };
  }, []);

  return <canvas className={`three-network ${activeIndex === 0 ? 'is-cover-network' : ''}`} ref={canvasRef} aria-hidden="true" />;
}

function TimelineCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    let frame;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
      const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      const w = rect.width; const h = rect.height;
      const y = h * 0.53; const left = w * 0.06; const right = w * 0.95;
      const progress = (performance.now() % 4200) / 4200;
      const grad = context.createLinearGradient(left, y, right, y);
      grad.addColorStop(0, 'rgba(102,145,223,.18)'); grad.addColorStop(.55, 'rgba(117,188,231,.9)'); grad.addColorStop(1, 'rgba(238,174,124,.75)');
      context.beginPath(); context.moveTo(left, y); context.lineTo(right, y); context.strokeStyle = grad; context.lineWidth = 1.5; context.stroke();
      const points = [0, .24, .45, .68, .82, 1].map((p) => left + (right - left) * p);
      points.forEach((x, index) => {
        const active = progress > index / 6 && progress < (index + 1.3) / 6;
        context.beginPath(); context.arc(x, y, active ? 6.5 : 4, 0, Math.PI * 2);
        context.fillStyle = active ? '#d7f0ff' : index < 4 ? '#a5c4fa' : '#efbd97';
        context.shadowColor = active ? '#9bcaff' : 'transparent'; context.shadowBlur = active ? 16 : 0; context.fill(); context.shadowBlur = 0;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={ref} className="timeline-canvas" aria-hidden="true" />;
}

function SlideArtwork({ slide }) {
  switch (slide.type) {
    case 'cover': return <div className="art-cover"><div className="cover-orbit-ring ring-one" /><div className="cover-orbit-ring ring-two" /><div className="cover-orbit-ring ring-three" /><div className="art-core"><Globe2 strokeWidth={0.75} /><span>WWW</span></div><div className="orbit-tag tag-top">একটি উন্মুক্ত নেটওয়ার্ক</div><div className="orbit-tag tag-bottom">সিইআরএন → বিশ্ব</div></div>;
    case 'need': return <div className="art-need"><div className="need-number">{slide.stat}</div><div className="need-label">বিজ্ঞানী<br /><span>বিশ্বজুড়ে ছড়ানো জ্ঞান</span></div><div className="continent-grid">{Array.from({ length: 13 }, (_, i) => <i key={i} className={`node n${i + 1}`} />)}</div><div className="need-caption"><span className="live-dot" /> তথ্য ভাগাভাগির নতুন পথ</div></div>;
    case 'idea': return <div className="art-idea"><div className="idea-paper"><div className="paper-meta">INFORMATION MANAGEMENT</div><div className="paper-line wide" /><div className="paper-line mid" /><div className="paper-line short" /><div className="paper-rule" /><div className="paper-diagram"><i /><i /><i /><b /><b /></div><div className="paper-mark">1989</div></div><div className="idea-orbit"><span>HYPERTEXT</span><span>INFORMATION</span><span>NETWORK</span></div></div>;
    case 'first': return <div className="art-first"><div className="browser-window"><div className="window-bar"><i /><i /><i /><span>WorldWideWeb · NeXT</span></div><div className="browser-content"><div className="browser-title">World Wide Web</div><div className="browser-rule" /><p>Everything there is online about W3 is linked directly or indirectly to this document.</p><div className="browser-links"><a>What’s out there?</a><a>Help</a><a>Software products</a><a>Technical details</a></div><div className="browser-url">info.cern.ch</div></div></div><div className="server-sticker">THIS MACHINE IS A SERVER<br /><b>DO NOT POWER IT DOWN!!</b></div></div>;
    case 'release': return <div className="art-release"><div className="release-date">30<span>APR</span></div><div className="release-year">1993</div><div className="release-orbit"><div className="orbit-core"><Link2 /></div><span className="orbit-chip chip-a">WWW</span><span className="orbit-chip chip-b">OPEN</span><span className="orbit-chip chip-c">FREE</span><span className="orbit-chip chip-d">CODE</span></div><div className="release-caption">কোড উন্মুক্ত · ওয়েব মুক্ত</div></div>;
    case 'mosaic': return <div className="art-mosaic"><div className="mosaic-browser"><div className="mosaic-toolbar"><span>◉</span><span>◉</span><div>http://the.web</div></div><div className="mosaic-img"><div className="mosaic-sun" /><div className="mosaic-hill hill-a" /><div className="mosaic-hill hill-b" /><div className="mosaic-hill hill-c" /></div><div className="mosaic-page"><div className="mosaic-head">The World Wide Web</div><div className="mosaic-copy"><i /><i /><i /><i /></div><div className="mosaic-links"><span /><span /></div></div></div><div className="browser-note">MOSAIC · ১৯৯৩</div><div className="mosaic-data"><b>১ কোটি</b><span>ওয়েব ব্যবহারকারী<br />১৯৯৪ সালের শেষে</span></div></div>;
    case 'open': return <div className="art-open"><div className="open-circle outer"><div className="open-circle middle"><div className="open-circle inner"><span>W3C</span><small>OPEN WEB</small></div></div></div><div className="open-pill pill-left">মুক্ত মান</div><div className="open-pill pill-right">সবার জন্য</div><div className="open-pulse" /></div>;
    case 'timeline': return <div className="art-timeline"><TimelineCanvas /><div className="timeline-labels"><div><b>১৯৮৯</b><span>প্রস্তাব</span></div><div><b>১৯৯০</b><span>প্রথম সার্ভার</span></div><div><b>১৯৯১</b><span>সবার কাছে</span></div><div><b>১৯৯৩</b><span>উন্মুক্ত কোড</span></div><div><b>১৯৯৪</b><span>বিশ্বজুড়ে</span></div><div><b>আজ</b><span>এক পৃথিবী</span></div></div><div className="source-note"><span>তথ্যসূত্র</span><a href={SOURCE} target="_blank" rel="noreferrer">CERN · A short history of the Web <ArrowUpRight size={13} /></a></div></div>;
    default: return null;
  }
}

function Slide({ slide, active, index }) {
  return (
    <section className={`slide-frame slide-${slide.type} ${active ? 'active' : ''}`} aria-hidden={!active}>
      <div className="slide-grain" />
      <div className="slide-index">WEB / 001 <i /> {String(index + 1).padStart(2, '0')}</div>
      <div className="slide-content">
        <div className="slide-copy">
          <div className="slide-kicker"><span className="kicker-mark" />{slide.kicker}<span className="slide-year">{slide.year}</span></div>
          <h1 className="slide-title">{slide.title}</h1>
          <p className="slide-description">{slide.description}</p>
          {(slide.quote || slide.stat) && <div className="slide-aside">
            {slide.stat && <div className="stat-block"><strong>{slide.stat}</strong><span>{slide.statLabel}</span></div>}
            {slide.quote && <blockquote>{slide.quote}{slide.attribution && <cite>— {slide.attribution}</cite>}</blockquote>}
          </div>}
        </div>
        <div className="slide-art" aria-label={slide.id === 'timeline' ? 'ওয়েবের ইতিহাসের সময়রেখা' : undefined}>
          <SlideArtwork slide={slide} />
        </div>
      </div>
      <div className="slide-edge-note"><span>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><i /></div>
    </section>
  );
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef(null);
  const timerRef = useRef(null);
  const touchStart = useRef(null);
  const active = slides[activeIndex];

  const goTo = (index) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    if (next === activeIndex) return;
    setActiveIndex(next);
    requestAnimationFrame(() => {
      const incoming = deckRef.current?.querySelector('.slide-frame.active');
      if (incoming) {
        gsap.set(incoming, { clearProps: 'opacity' });
        gsap.fromTo(incoming.querySelectorAll('.slide-copy > *, .slide-art > *'),
          { opacity: 0, y: 18, filter: 'blur(5px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.72, stagger: 0.06, ease: 'power3.out', clearProps: 'all' });
      }
    });
  };

  const step = (direction) => goTo(activeIndex + direction);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') { event.preventDefault(); step(1); }
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); step(-1); }
      else if (event.key === 'Home') goTo(0);
      else if (event.key === 'End') goTo(slides.length - 1);
      else if (event.key.toLowerCase() === 'f') toggleFullscreen();
      else if (event.key.toLowerCase() === 'g') setShowChapters((s) => !s);
      else if (event.key === 'Escape') { setShowHelp(false); setShowChapters(false); }
      else if (event.key === '?') setShowHelp((s) => !s);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  useEffect(() => {
    if (isPlaying) timerRef.current = window.setInterval(() => setActiveIndex((index) => (index + 1) % slides.length), 5600);
    return () => window.clearInterval(timerRef.current);
  }, [isPlaying]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) { await document.documentElement.requestFullscreen(); setIsFullscreen(true); }
      else { await document.exitFullscreen(); setIsFullscreen(false); }
    } catch { /* Fullscreen is optional in embedded previews. */ }
  };

  useEffect(() => {
    const update = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const handleTouchStart = (event) => { touchStart.current = event.touches[0].clientX; };
  const handleTouchEnd = (event) => {
    if (touchStart.current == null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 48) step(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const exportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setIsPlaying(false);
    try {
      await document.fonts.ready;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080], hotfixes: ['px_scaling'], compress: true });
      const frames = Array.from(deckRef.current.querySelectorAll('.slide-frame'));
      for (let index = 0; index < frames.length; index += 1) {
        const frame = frames[index];
        const previousVisibility = frame.style.visibility;
        const previousOpacity = frame.style.opacity;
        frame.style.visibility = 'visible';
        frame.style.opacity = '1';
        try {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          const canvas = await html2canvas(frame, { scale: 1.15, backgroundColor: '#080c14', useCORS: true, allowTaint: false, logging: false, width: frame.clientWidth, height: frame.clientHeight, windowWidth: frame.clientWidth, windowHeight: frame.clientHeight });
          const image = canvas.toDataURL('image/jpeg', 0.94);
          if (index > 0) pdf.addPage([1920, 1080], 'landscape');
          pdf.addImage(image, 'JPEG', 0, 0, 1920, 1080, undefined, 'FAST');
          canvas.width = 0; canvas.height = 0;
        } finally {
          frame.style.visibility = previousVisibility;
          frame.style.opacity = previousOpacity;
        }
      }
      pdf.save('web-er-itihash-bangla.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      window.print();
    } finally { setIsExporting(false); }
  };

  const progress = useMemo(() => ((activeIndex + 1) / slides.length) * 100, [activeIndex]);

  return (
    <main className="app-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="ambient-light" />
      <div className="film-grain" />
      <div className="deck-stage" ref={deckRef}>
        <RemotionFilmLayer />
        <ThreeNetwork activeIndex={activeIndex} />
        {slides.map((slide, index) => <Slide key={slide.id} slide={slide} index={index} active={index === activeIndex} />)}
        <div className="deck-top-tools">
          <div className="deck-brand"><span className="brand-icon"><span /><span /><span /></span><span>ওয়েব / ইতিহাস</span></div>
          <div className="top-actions">
            <button className="tool-button text-tool" onClick={() => setShowChapters(true)} aria-label="অধ্যায় নির্বাচন"><Layers3 size={15} /><span>অধ্যায়</span></button>
            <button className="tool-button text-tool export-button" onClick={exportPdf} disabled={isExporting} aria-label="সব স্লাইড PDF ডাউনলোড">
              {isExporting ? <span className="spinner" /> : <ArrowDown size={15} />}<span>{isExporting ? 'তৈরি হচ্ছে…' : 'PDF'}</span>
            </button>
            <button className="tool-button icon-tool" onClick={toggleFullscreen} aria-label={isFullscreen ? 'পূর্ণপর্দা বন্ধ' : 'পূর্ণপর্দা'} title="পূর্ণপর্দা (F)"><Maximize size={16} /></button>
          </div>
        </div>
        <div className="stage-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="slide-rail" aria-label="স্লাইড নির্বাচন">
          {slides.map((slide, index) => <button key={slide.id} onClick={() => goTo(index)} aria-label={`স্লাইড ${index + 1}: ${slide.kicker}`} aria-current={index === activeIndex ? 'step' : undefined}><span /></button>)}
        </div>
        <div className="deck-controls">
          <div className="control-left"><span className="deck-counter"><b>{String(activeIndex + 1).padStart(2, '0')}</b><i>/</i>{String(slides.length).padStart(2, '0')}</span><span className="control-divider" /><button className="control-icon play-control" onClick={() => setIsPlaying((v) => !v)} aria-label={isPlaying ? 'অটো প্লে থামান' : 'অটো প্লে শুরু'}>{isPlaying ? <Pause size={15} /> : <Play size={15} />}</button><span className="play-label">{isPlaying ? 'চলছে' : 'উপস্থাপনা'}</span></div>
          <div className="control-center"><button className="nav-button" onClick={() => step(-1)} disabled={activeIndex === 0} aria-label="আগের স্লাইড"><ArrowLeft size={16} /></button><span className="control-hint"><kbd>←</kbd><kbd>→</kbd> <span>নেভিগেট</span></span><button className="nav-button" onClick={() => step(1)} disabled={activeIndex === slides.length - 1} aria-label="পরের স্লাইড"><ArrowRight size={16} /></button></div>
          <div className="control-right"><button className="control-icon help-control" onClick={() => setShowHelp(true)} aria-label="কীবোর্ড শর্টকাট"><span>?</span></button><span className="sound-label"><VolumeX size={13} /> শব্দহীন অভিজ্ঞতা</span></div>
        </div>
      </div>

      {showChapters && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowChapters(false); }}>
        <section className="dialog chapter-dialog" role="dialog" aria-modal="true" aria-label="অধ্যায়">
          <div className="dialog-head"><div><span className="dialog-eyebrow">গল্পের পথ</span><h2>অধ্যায়সমূহ</h2></div><button className="dialog-close" onClick={() => setShowChapters(false)} aria-label="বন্ধ করুন"><X size={19} /></button></div>
          <div className="chapter-list">{slides.map((slide, index) => <button key={slide.id} className={index === activeIndex ? 'selected' : ''} onClick={() => { goTo(index); setShowChapters(false); }}><span className="chapter-no">{String(index + 1).padStart(2, '0')}</span><span className="chapter-name"><b>{slide.kicker}</b><small>{slide.year}</small></span>{index === activeIndex ? <Check size={16} /> : <ArrowUpRight size={15} />}</button>)}</div>
        </section>
      </div>}
      {showHelp && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowHelp(false); }}>
        <section className="dialog help-dialog" role="dialog" aria-modal="true" aria-label="কীবোর্ড শর্টকাট">
          <div className="dialog-head"><div><span className="dialog-eyebrow">দ্রুত নিয়ন্ত্রণ</span><h2>কীবোর্ড শর্টকাট</h2></div><button className="dialog-close" onClick={() => setShowHelp(false)} aria-label="বন্ধ করুন"><X size={19} /></button></div>
          <div className="shortcut-list"><div><span>আগের / পরের স্লাইড</span><span><kbd>←</kbd><kbd>→</kbd></span></div><div><span>প্রথম / শেষ স্লাইড</span><span><kbd>Home</kbd><kbd>End</kbd></span></div><div><span>পূর্ণপর্দা</span><kbd>F</kbd></div><div><span>অধ্যায়সমূহ</span><kbd>G</kbd></div><div><span>এই সহায়িকা</span><kbd>?</kbd></div></div>
          <p className="dialog-footnote"><Command size={13} /> কীবোর্ড, টাচ বা অন-স্ক্রিন কন্ট্রোল—যেভাবে স্বচ্ছন্দ।</p>
        </section>
      </div>}
      {isExporting && <div className="export-toast"><span className="spinner" /> স্লাইডগুলো PDF-এ সাজানো হচ্ছে…</div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
