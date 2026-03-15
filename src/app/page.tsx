"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ["Kursy", "Instruktorzy", "Cennik", "Galeria", "Kontakt"];

const TITLE_TEXT = "SZKOŁA NARCIARSKA";

const courses = [
  {
    id: 1,
    name: "Pierwszy Zjazd",
    level: "Początkujący",
    instructor: "Marta Kowalska",
    experience: "12 lat doświadczenia",
    credential: "Instruktor PZN Klasa A",
    price: "199 zł/h",
    group: "Indywidualnie",
    description: "Twoja przygoda z nartami zaczyna się tutaj. Nauczysz się prawidłowej postawy, hamowania pługiem i pierwszych skrętów. Bezpieczne, cierpliwe podejście dla tych, którzy nigdy nie stali na nartach.",
    color: "#FF6B35",
    side: "left" as const,
  },
  {
    id: 2,
    name: "Pewny Stok",
    level: "Średniozaawansowany",
    instructor: "Tomasz Nowak",
    experience: "18 lat doświadczenia",
    credential: "Były zawodnik kadry juniorów",
    price: "249 zł/h",
    group: "Do 4 osób",
    description: "Opanujesz skręt równoległy, jazda po różnym terenie i podstawy carvingu. Kurs dla tych, którzy jeżdżą pługiem i chcą przejść na wyższy poziom. Dynamiczne zajęcia na czerwonych trasach.",
    color: "#3B82F6",
    side: "right" as const,
  },
  {
    id: 3,
    name: "Carving Pro",
    level: "Zaawansowany",
    instructor: "Jakub Wiśniewski",
    experience: "22 lata doświadczenia",
    credential: "Trener kadry narodowej",
    price: "349 zł/h",
    group: "Indywidualnie",
    description: "Doskonalenie techniki carvingu, jazda po lodzie i stromych trasach, dynamiczne skręty krótkie. Dla narciarzy którzy chcą jeździć jak profesjonaliści. Analiza video Twojej jazdy w cenie.",
    color: "#10B981",
    side: "left" as const,
  },
  {
    id: 4,
    name: "Freeride Explorer",
    level: "Ekspercki",
    instructor: "Anna Zielińska",
    experience: "15 lat doświadczenia",
    credential: "Certyfikat ISIA, ratownik górski",
    price: "449 zł/h",
    group: "Do 3 osób",
    description: "Jazda poza trasami, głęboki puch, strome żleby i techniki bezpieczeństwa lawinowego. Dla doświadczonych narciarzy szukających adrenaliny. Sprzęt lawinowy zapewniony.",
    color: "#8B5CF6",
    side: "right" as const,
  },
];

const scheduleCourses = [
  { name: "Pierwszy Zjazd", level: "Początkujący", color: "#FF6B35", instructor: "M. Kowalska" },
  { name: "Pewny Stok", level: "Średniozaaw.", color: "#3B82F6", instructor: "T. Nowak" },
  { name: "Carving Pro", level: "Zaawansowany", color: "#10B981", instructor: "J. Wiśniewski" },
  { name: "Freeride Explorer", level: "Ekspercki", color: "#8B5CF6", instructor: "A. Zielińska" },
];
const scheduleDays = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const scheduleTimes = ["08:00", "10:00", "12:00", "14:00", "16:00"];
const scheduleData: Record<string, Record<string, number>> = {
  "08:00": { "Poniedziałek": 0, "Środa": 0, "Piątek": 0, "Sobota": 0, "Niedziela": 0 },
  "10:00": { "Wtorek": 1, "Czwartek": 1, "Sobota": 1, "Poniedziałek": 2 },
  "12:00": { "Poniedziałek": 1, "Środa": 2, "Piątek": 1, "Niedziela": 2 },
  "14:00": { "Wtorek": 2, "Czwartek": 3, "Sobota": 2, "Środa": 3 },
  "16:00": { "Poniedziałek": 3, "Piątek": 3, "Sobota": 3, "Niedziela": 1 },
};

function SnowDivider({ position, flip, zIndex = 40, className = '' }: {
  position: 'top' | 'bottom';
  flip?: boolean;
  zIndex?: number;
  className?: string;
}) {
  return (
    <div className={`snow-divider-${position} ${className}`} style={{
      position: 'absolute',
      [position]: 0, left: 0, right: 0,
      zIndex, pointerEvents: 'none' as const,
      transform: flip ? 'scaleY(-1)' : undefined,
    }}>
      <img src="/przejscie-removebg-preview.png" alt="" style={{
        width: '100%',
        height: 'auto',
        display: 'block',
      }} />
    </div>
  );
}

function CourseCard({ course }: { course: typeof courses[number] }) {
  const isLeft = course.side === "left";

  return (
    <div
      className={`course-card course-card-${course.id} ${isLeft ? 'card-left' : 'card-right'} absolute top-1/2
        left-1/2 -translate-x-1/2
        ${isLeft ? "md:left-[5%] md:translate-x-0" : "md:left-auto md:right-[5%] md:translate-x-0"}
      `}
      style={{
        width: "min(90vw, 480px)",
        opacity: 0,
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Color bar */}
        <div style={{ height: "4px", background: course.color }} />

        <div className="p-6 md:p-8">
          {/* Level badge */}
          <span
            className="inline-block text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4"
            style={{
              fontFamily: "var(--font-exo2), sans-serif",
              background: `${course.color}20`,
              color: course.color,
              border: `1px solid ${course.color}40`,
            }}
          >
            {course.level}
          </span>

          {/* Course name */}
          <h3
            className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2"
            style={{ fontFamily: "var(--font-teko), sans-serif" }}
          >
            {course.name}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: course.color }}
            >
              {course.instructor.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
                {course.instructor}
              </p>
              <p className="text-white/50 text-xs" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
                {course.credential}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-white/70 text-sm leading-relaxed mb-5"
            style={{ fontFamily: "var(--font-exo2), sans-serif" }}
          >
            {course.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-teko), sans-serif", color: course.color }}>
                {course.price}
              </p>
              <p className="text-white/40 text-[0.65rem] uppercase tracking-wider" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
                Cena
              </p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-teko), sans-serif" }}>
                {course.experience.split(" ")[0]}
              </p>
              <p className="text-white/40 text-[0.65rem] uppercase tracking-wider" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
                Lat doświadcz.
              </p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-teko), sans-serif" }}>
                {course.group}
              </p>
              <p className="text-white/40 text-[0.65rem] uppercase tracking-wider" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
                Grupa
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full font-semibold uppercase tracking-widest text-white text-sm py-3 rounded-xl cursor-pointer"
            style={{
              fontFamily: "var(--font-exo2), sans-serif",
              background: course.color,
              boxShadow: `0 4px 20px ${course.color}40`,
              border: "none",
              minHeight: "44px",
              transition: "transform 250ms ease, box-shadow 250ms ease, filter 250ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Zapisz się →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const burstVideoRef = useRef<HTMLVideoElement>(null);
  const coursesRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);

  // === LENIS SMOOTH SCROLL ===
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    console.log("Hero animations starting...");

    const tl = gsap.timeline({ delay: 0.3 });

    /* 1 — Video fade in */
    tl.to(".hero-video", { opacity: 1, duration: 1, ease: "power2.out" }, 0);

    /* 2 — Navbar slide down */
    tl.to(
      ".hero-navbar",
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.1
    );

    /* 3 — Icy letter fly-in + snow wave */
    const letters = heroRef.current?.querySelectorAll('.hero-letter');
    const snowWave = heroRef.current?.querySelector('.snow-wave-element');

    const burstVideo = burstVideoRef.current;
    const goggles = heroRef.current?.querySelector('.hero-goggles');

    // Gogle: ukryte na dole, mniejsze, lekko obrócone
    if (goggles) gsap.set(goggles, { opacity: 0, y: 200, scale: 0.8, rotation: 5 });
    // Burst video: niewidoczny
    if (burstVideo) gsap.set(burstVideo, { opacity: 0 });

    // Initial states: letters fly from left with rotation
    if (letters) {
      gsap.set(letters, {
        opacity: 0,
        x: -80,
        y: () => gsap.utils.random(-12, 12),
        rotation: () => gsap.utils.random(-18, -5),
        scale: 0.6,
      });
    }

    // Initial state: snow wave off-screen left
    if (snowWave) gsap.set(snowWave, { x: '-120%', opacity: 0.9 });

    // Step A: Snow wave sweeps left to right
    if (snowWave) {
      tl.to(snowWave, {
        x: '130%', opacity: 0, duration: 0.9, ease: "power2.inOut"
      }, 0.3);
    }

    // Step B: Letters fly in from left behind the wave
    if (letters && letters.length > 0) {
      tl.to(letters, {
        opacity: 0.8, x: 0, y: 0, rotation: 0, scale: 1,
        duration: 0.6,
        stagger: { each: 0.035, from: "start" },
        ease: "back.out(1.4)",
      }, 0.45);
    }

    // Step C: Snow particle burst — per-letter + dust cloud
    tl.add(() => {
      if (!letters || !titleRef.current) return;

      // Phase 1: Per-letter particles (8-12 per letter)
      letters.forEach((letter) => {
        const lRect = letter.getBoundingClientRect();
        const count = 8 + Math.floor(Math.random() * 5);
        for (let j = 0; j < count; j++) {
          const particle = document.createElement('div');
          const size = 2 + Math.random() * 8;
          particle.style.cssText = `
            position: fixed;
            width: ${size}px; height: ${size}px;
            background: white; border-radius: 50%;
            pointer-events: none; z-index: 100;
            left: ${lRect.left + lRect.width / 2}px;
            top: ${lRect.top + lRect.height / 2}px;
            opacity: ${0.6 + Math.random() * 0.4};
          `;
          document.body.appendChild(particle);
          const distance = 40 + Math.random() * 120;
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6;
          gsap.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0, scale: gsap.utils.random(0.3, 1.5),
            duration: 0.5 + Math.random() * 0.7,
            ease: "power2.out",
            onComplete: () => particle.remove(),
          });
        }
      });

      // Phase 2: Snow dust (35 fine particles around title)
      const titleRect = titleRef.current.getBoundingClientRect();
      for (let k = 0; k < 35; k++) {
        const dust = document.createElement('div');
        const dustSize = 1 + Math.random() * 2.5;
        dust.style.cssText = `
          position: fixed;
          left: ${titleRect.left + Math.random() * titleRect.width}px;
          top: ${titleRect.top + Math.random() * titleRect.height}px;
          width: ${dustSize}px; height: ${dustSize}px;
          background: white; border-radius: 50%;
          pointer-events: none; z-index: 100;
          opacity: ${0.4 + Math.random() * 0.4};
          box-shadow: 0 0 ${dustSize * 3}px rgba(255,255,255,0.6);
        `;
        document.body.appendChild(dust);
        gsap.to(dust, {
          x: (Math.random() - 0.5) * 200,
          y: -30 + Math.random() * 100,
          opacity: 0, scale: 0,
          duration: 1.0 + Math.random() * 0.8,
          delay: Math.random() * 0.5,
          ease: "power1.out",
          onComplete: () => dust.remove(),
        });
      }
    }, 0.45);

    /* 5 — Snow burst video + Goggles rise from bottom */

    // Krok A: Filmik wybuchu startuje (play + fade in) @ 0.8s
    tl.add(() => {
      if (burstVideo) {
        burstVideo.currentTime = 0;
        burstVideo.play().catch(() => {});
      }
    }, 0.8);

    if (burstVideo) {
      tl.to(burstVideo, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1);
    }

    // Krok B: Gogle wyjeżdżają z dołu @ 1.0s
    if (goggles) {
      tl.to(goggles, {
        opacity: 1, y: 0, scale: 1.05, rotation: -2,
        duration: 1.0, ease: "power4.out",
      }, 2.0);
    }

    // Krok C: Gogle stabilizacja @ 2.8s
    if (goggles) {
      tl.to(goggles, {
        scale: 1, rotation: 0,
        duration: 0.4, ease: "power2.inOut",
      }, 2.8);
    }

    // Krok D: Micro shake @ 3.0s
    if (goggles) {
      tl.to(goggles, {
        keyframes: [
          { rotation: 2.5, x: 6, duration: 0.07 },
          { rotation: -2, x: -5, duration: 0.07 },
          { rotation: 1.5, x: 3, duration: 0.06 },
          { rotation: -0.8, x: -2, duration: 0.06 },
          { rotation: 0, x: 0, duration: 0.1 },
        ],
        ease: "none"
      }, 3.0);
    }

    // Krok E: Burst video fade out @ 3.2s
    if (burstVideo) {
      tl.to(burstVideo, { opacity: 0, duration: 1.5, ease: "power2.inOut" }, 3.2);
    }

    // Krok F: Pause video @ 3.7s
    tl.add(() => { if (burstVideo) burstVideo.pause(); }, 4.7);

    // Krok G: Cząsteczki śniegu spadające z gogli @ 2.0s
    tl.add(() => {
      if (!goggles) return;
      const rect = (goggles as HTMLElement).getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        const size = 3 + Math.random() * 6;
        p.style.cssText = `
          position:fixed; width:${size}px; height:${size}px;
          background:white; border-radius:50%; pointer-events:none; z-index:100;
          box-shadow: 0 0 ${size*2}px rgba(255,255,255,0.8);
          left:${rect.left + rect.width*0.15 + Math.random()*rect.width*0.7}px;
          top:${rect.top + rect.height*0.4 + Math.random()*rect.height*0.4}px;
        `;
        document.body.appendChild(p);
        gsap.to(p, {
          y: 40 + Math.random() * 100,
          x: -20 + Math.random() * 40,
          opacity: 0, scale: 0,
          duration: 0.6 + Math.random() * 0.6,
          delay: Math.random() * 0.3,
          ease: "power2.in",
          onComplete: () => p.remove()
        });
      }
    }, 3.0);

    /* 6 — Snow bottom rise */
    tl.to(
      ".hero-snow-bottom",
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      2.5
    );

    /* 7 — Subtitle */
    tl.to(
      ".hero-subtitle",
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      3.0
    );

    /* 8 — Price */
    tl.to(
      ".hero-price",
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      3.2
    );

    /* 9 — CTA button */
    tl.to(
      ".hero-cta",
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      3.2
    );

    console.log("Timeline created, duration:", tl.duration());

    return () => {
      tl.kill();
    };
  }, []);

  // === COURSES SECTION — ScrollTrigger ===
  useEffect(() => {
    const section = coursesRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.course-card') as NodeListOf<HTMLElement>;
    const totalCards = cards.length;
    const triggers: ScrollTrigger[] = [];

    // Ustaw WSZYSTKIE karty jako niewidoczne na start
    cards.forEach((card) => {
      const isLeft = card.classList.contains('card-left');
      gsap.set(card, {
        opacity: 0,
        x: isLeft ? -120 : 120,
        scale: 0.88,
        rotation: isLeft ? -4 : 4,
      });
    });

    // Nagłówek — lepsza animacja z parallaxem
    const headerAnim = gsap.from('.courses-header', {
      opacity: 0, y: 60, scale: 0.95, duration: 1, ease: "power3.out",
      scrollTrigger: {
        trigger: section, start: "top 70%",
        toggleActions: "play none none reverse",
      }
    });
    if (headerAnim.scrollTrigger) triggers.push(headerAnim.scrollTrigger);

    // Hero fade out przy scrollu
    const heroFade = gsap.to('.hero-wrapper > div', {
      ease: "none",
      scrollTrigger: {
        trigger: '.courses-section',
        start: "top 85%",
        end: "top 30%",
        scrub: 1.5,
      }
    });
    if (heroFade.scrollTrigger) triggers.push(heroFade.scrollTrigger);

    // Główny ScrollTrigger — TYLKO karty + progress bar + dots + overlay
    const mainTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        const activeIndex = Math.min(totalCards - 1, Math.floor(progress * totalCards));
        const localProgress = (progress * totalCards) - activeIndex;

        // Progress bar
        const bar = section.querySelector('.courses-progress-bar') as HTMLElement;
        if (bar) bar.style.width = `${progress * 100}%`;

        // Karty — ulepszona animacja z blur, stagger, micro parallax
        cards.forEach((el, i) => {
          const isLeft = el.classList.contains('card-left');
          const innerEls = el.querySelectorAll('.course-card span, .course-card h3, .course-card p, .course-card .grid, .course-card button') as NodeListOf<HTMLElement>;

          if (i === activeIndex) {
            if (localProgress < 0.20) {
              // Faza wejścia — easeOutCubic + blur
              const enterProgress = localProgress / 0.20;
              const eased = 1 - Math.pow(1 - enterProgress, 3);
              const blurVal = 4 * (1 - eased);
              el.style.opacity = String(eased);
              el.style.filter = `blur(${blurVal}px)`;
              el.style.transform = `translateX(${(isLeft ? -120 : 120) * (1 - eased)}px) translateY(-50%) scale(${0.88 + 0.12 * eased}) rotate(${(isLeft ? -4 : 4) * (1 - eased)}deg)`;
              // Stagger wewnętrznych elementów
              innerEls.forEach((inner, idx) => {
                const delay = idx * 0.06;
                const innerEased = Math.max(0, Math.min(1, (enterProgress - delay) / (1 - delay)));
                const innerSmooth = 1 - Math.pow(1 - innerEased, 3);
                inner.style.opacity = String(innerSmooth);
                inner.style.transform = `translateY(${8 * (1 - innerSmooth)}px)`;
              });
            } else if (localProgress > 0.80 && i < totalCards - 1) {
              // Faza wyjścia — easeInCubic + blur
              const exitProgress = (localProgress - 0.80) / 0.20;
              const eased = exitProgress * exitProgress * exitProgress;
              const blurVal = 3 * eased;
              el.style.opacity = String(1 - eased);
              el.style.filter = `blur(${blurVal}px)`;
              el.style.transform = `translateX(${(isLeft ? -80 : 80) * eased}px) translateY(${-50 - 30 * eased}%) scale(${1 - 0.08 * eased}) rotate(0deg)`;
              innerEls.forEach((inner) => {
                inner.style.opacity = '1';
                inner.style.transform = 'translateY(0)';
              });
            } else {
              // Faza widoczna — micro parallax (sinusoidalne falowanie)
              const visibleProgress = (localProgress - 0.20) / 0.60;
              const microY = Math.sin(visibleProgress * Math.PI) * 5;
              el.style.opacity = '1';
              el.style.filter = 'blur(0px)';
              el.style.transform = `translateX(0) translateY(calc(-50% + ${microY}px)) scale(1) rotate(0deg)`;
              innerEls.forEach((inner) => {
                inner.style.opacity = '1';
                inner.style.transform = 'translateY(0)';
              });
            }
          } else {
            el.style.opacity = '0';
            el.style.filter = 'blur(4px)';
            el.style.transform = `translateX(${isLeft ? -120 : 120}px) translateY(-50%) scale(0.88) rotate(${(isLeft ? -4 : 4)}deg)`;
            innerEls.forEach((inner) => {
              inner.style.opacity = '0';
              inner.style.transform = 'translateY(8px)';
            });
          }
        });

        // Dot navigation
        courses.forEach((c, i) => {
          const dot = section.querySelector(`.course-dot-${i}`) as HTMLElement;
          if (!dot) return;
          if (i === activeIndex) {
            dot.style.background = c.color;
            dot.style.transform = 'scale(1.4)';
            dot.style.boxShadow = `0 0 10px ${c.color}60`;
          } else {
            dot.style.background = 'rgba(255,255,255,0.3)';
            dot.style.transform = 'scale(1)';
            dot.style.boxShadow = 'none';
          }
        });

        // Overlay kolor
        const overlay = section.querySelector('.courses-overlay') as HTMLElement;
        if (overlay) {
          const color = courses[activeIndex].color;
          overlay.style.background = `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, ${color}15 50%, rgba(0,0,0,0.5) 100%)`;
        }
      },
    });
    triggers.push(mainTrigger);

    // Snow cover text animations
    const snowText = document.querySelector('.snow-cover-text');
    if (snowText) {
      const label = snowText.querySelector('.brush-label');
      const title = snowText.querySelector('.brush-title');
      const desc = snowText.querySelector('.brush-desc');

      gsap.set([label, title, desc], { opacity: 0, y: 25 });

      // Text fade-in when courses-section enters viewport
      const brushIn = gsap.to([label, title, desc], {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.courses-section',
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      });
      if (brushIn.scrollTrigger) triggers.push(brushIn.scrollTrigger);

      // Snow slides up + fades out in first 15% of courses scroll
      const snowOut = gsap.to('.snow-cover', {
        y: '-100%',
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: '.courses-section',
          start: "top top",
          end: "15% top",
          scrub: 1,
        }
      });
      if (snowOut.scrollTrigger) triggers.push(snowOut.scrollTrigger);

      // Text fades out faster than snow image
      const textOut = gsap.to('.snow-cover-text', {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: '.courses-section',
          start: "top top",
          end: "10% top",
          scrub: 1,
        }
      });
      if (textOut.scrollTrigger) triggers.push(textOut.scrollTrigger);
    }

    // Śnieg od dołu — opacity + y animation
    const snowBottom = section.querySelector('.courses-snow-bottom') as HTMLElement;
    if (snowBottom) {
      console.log("✅ Snow bottom found, setting up ScrollTrigger");

      gsap.set(snowBottom, { y: 80, opacity: 0 });

      const snowTween = gsap.to(snowBottom, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "45% top",
          end: "70% top",
          scrub: 1,
        }
      });
      triggers.push(snowTween.scrollTrigger!);
    } else {
      console.log("❌ Snow bottom NOT found!");
    }

    // Biały pas pod śniegiem — animacja wjazdu
    const snowFill = section.querySelector('.courses-snow-fill') as HTMLElement;
    if (snowFill) {
      gsap.set(snowFill, { y: 80, opacity: 0 });
      const fillTween = gsap.to(snowFill, {
        opacity: 1, y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "45% top",
          end: "70% top",
          scrub: 1,
        }
      });
      triggers.push(fillTween.scrollTrigger!);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // === SCHEDULE SECTION — ScrollTrigger ===
  useEffect(() => {
    const section = scheduleRef.current;
    if (!section) return;
    console.log("Schedule animations starting...");

    const scheduleTriggers: ScrollTrigger[] = [];

    // 1) Title + subtitle — toggleActions, fires once
    const titleAnim = gsap.to('.schedule-snow-text', {
      opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none none",
      }
    });
    if (titleAnim.scrollTrigger) scheduleTriggers.push(titleAnim.scrollTrigger);

    // 2) Legend — toggleActions, slight delay
    const legendAnim = gsap.to('.schedule-legend', {
      opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none none",
      }
    });
    if (legendAnim.scrollTrigger) scheduleTriggers.push(legendAnim.scrollTrigger);

    // 3) Table rows — scrub-driven, row by row
    const headerRow = section.querySelector('.schedule-header-row');
    const rows = gsap.utils.toArray('.schedule-row');

    gsap.set([headerRow, ...rows], { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom bottom",
        scrub: 0.6,
      }
    });

    tl.to(headerRow, { opacity: 1, y: 0, duration: 0.08 });
    tl.to(rows, { opacity: 1, y: 0, duration: 0.08, stagger: 0.06 });

    if (tl.scrollTrigger) scheduleTriggers.push(tl.scrollTrigger);

    // 4) Optional parallax on top snow divider
    const parallaxAnim = gsap.to('.snow-divider-top', {
      y: -20,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      }
    });
    if (parallaxAnim.scrollTrigger) scheduleTriggers.push(parallaxAnim.scrollTrigger);

    // 5) Snowfall particles
    const snowfallContainer = section.querySelector('.schedule-snowfall');
    if (snowfallContainer) {
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        const size = 2 + Math.random() * 4;

        p.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 ${size * 2}px rgba(255,255,255,0.5);
          pointer-events: none;
          left: ${Math.random() * 100}%;
          top: -2%;
        `;

        snowfallContainer.appendChild(p);

        const animateSnowflake = () => {
          const startX = Math.random() * 100;
          const drift = (Math.random() - 0.5) * 80;
          const duration = 5 + Math.random() * 8;
          const delay = Math.random() * 6;

          gsap.set(p, {
            left: `${startX}%`,
            top: '-2%',
            opacity: 0,
          });

          gsap.to(p, {
            top: '102%',
            left: `${startX + drift / 100 * 10}%`,
            opacity: 0.3 + Math.random() * 0.4,
            duration: duration,
            delay: delay,
            ease: "none",
            onComplete: () => {
              gsap.to(p, {
                opacity: 0,
                duration: 0.5,
                onComplete: animateSnowflake,
              });
            }
          });

          // Kołysanie na boki
          gsap.to(p, {
            x: `+=${drift}`,
            duration: duration * 0.7,
            delay: delay,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        };

        animateSnowflake();
      }
    }

    return () => {
      tl.kill();
      scheduleTriggers.forEach((t) => t.kill());
      const container = document.querySelector('.schedule-snowfall');
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <>
    <div className="hero-wrapper" style={{
      position: 'relative',
      zIndex: 20,
      height: '100vh',
      overflow: 'hidden',
      border: 'none',
      outline: 'none',
      background: '#E8F4F8',
    }}>
    <div ref={heroRef} className="relative w-full h-screen overflow-hidden border-none outline-none shadow-none" style={{
      position: 'sticky',
      top: 0,
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
    }}>
      {/* ═══ Layer 1 — Sky gradient (z-10) ═══ */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #FFFFFF 100%)",
        }}
      />

      {/* ═══ Layer 2 — Snow video (z-[15]) ═══ */}
      <video
        className="hero-video absolute inset-0 z-[15] w-full h-full object-cover"
        style={{ opacity: 0, mixBlendMode: "screen" }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/snow-video.mp4" type="video/mp4" />
      </video>

      {/* ═══ Layer 3 — Title "SZKOŁA NARCIARSKA" (z-20) ═══ */}
      <div className="absolute inset-0 z-20 flex items-start justify-center pt-[25vh] pointer-events-none">
        <div className="relative">
          <h1
            ref={titleRef}
            className="hero-title flex flex-wrap justify-center"
            style={{
              fontFamily: "var(--font-teko), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 10vw, 12rem)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#ffffff",
              lineHeight: 1,
              margin: 0,
              position: "relative",
              gap: "0.3em",
            }}
          >
            {TITLE_TEXT.split(" ").map((word, wordIndex) => {
              const charOffset = TITLE_TEXT.split(" ").slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0);
              return (
                <span key={wordIndex} className="flex" style={{ display: "flex" }}>
                  {word.split("").map((char, i) => (
                    <span
                      key={charOffset + i}
                      className="hero-letter"
                      style={{
                        display: "inline-block",
                        opacity: 0,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
            <div className="snow-wave-element" style={{ opacity: 0 }} />
          </h1>
        </div>
      </div>

      {/* ═══ Layer 3.5 — Snow burst video (z-[24]) ═══ */}
      <video
        ref={burstVideoRef}
        className="hero-burst absolute pointer-events-none"
        muted
        playsInline
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '1200px',
          height: 'auto',
          mixBlendMode: 'screen',
          opacity: 0,
          zIndex: 24,
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 30%, transparent 40%)',
          maskImage: 'radial-gradient(circle at center, black 0%, black 30%, transparent 40%)',
        }}
      >
        <source src="/snow-burst.mp4" type="video/mp4" />
      </video>

      {/* ═══ Layer 4 — Goggles (z-[25]) ═══ */}
      <div className="absolute inset-0 z-[25] flex items-center justify-center pointer-events-none">
        <img
          src="/goggles.png"
          alt="Gogle narciarskie"
          className="hero-goggles w-[clamp(280px,50vw,700px)]"
          style={{
            opacity: 0,
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ═══ Layer 5 — Snow bottom (z-30) ═══ */}
      <div
        className="absolute bottom-0 left-0 w-full z-30 pointer-events-none"
        style={{ height: '60%' }}
      >
        <img
          src="/snow-bottom.png"
          alt=""
          className="hero-snow-bottom w-full h-full object-cover object-top block"
          style={{
            opacity: 0,
            transform: "translateY(60px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ═══ Layer 6 — Subtitle + Price + CTA (z-[35]) ═══ */}
      <div className="absolute inset-0 z-[35] flex flex-col items-center justify-end pb-[18vh] pointer-events-none">
        <p
          className="hero-subtitle text-center pointer-events-auto"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            fontFamily: "var(--font-exo2), sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
            color: "#64748B",
            marginBottom: "8px",
          }}
        >
          Profesjonalna szkoła narciarska
        </p>

        <p
          className="hero-price text-center pointer-events-auto"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            fontFamily: "var(--font-exo2), sans-serif",
            fontWeight: 600,
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)",
            color: "#1A1A2E",
            marginBottom: "24px",
          }}
        >
          Lekcje indywidualne od{" "}
          <span style={{ color: "#FF6B35" }}>199 zł/h</span>
        </p>

        <button
          className="hero-cta cta-button pointer-events-auto"
          style={{
            opacity: 0,
            transform: "translateY(20px) scale(0.9)",
          }}
        >
          Zarezerwuj lekcję
        </button>
      </div>

      {/* ═══ Layer 7 — Navbar (z-50) ═══ */}
      <nav
        className="hero-navbar fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[clamp(16px,4vw,48px)] py-4"
        style={{
          opacity: 0,
          transform: "translateY(-20px)",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
        }}
      >
        {/* Logo */}
        <a className="nav-logo" href="#">
          <svg
            className="nav-logo-icon"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 22h20L12 2z" />
            <path d="M7 14h10" />
          </svg>
          <span className="nav-logo-text">SKIMASTER</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-[clamp(16px,2.5vw,32px)]">
          {NAV_LINKS.map((link) => (
            <a key={link} className="nav-link" href="#">
              {link}
            </a>
          ))}
        </div>
      </nav>
    </div>
    </div>

    {/* ═══ COURSES SECTION ═══ */}
    <section ref={coursesRef} className="courses-section relative" style={{ height: "300vh", position: 'relative', zIndex: 10 }}>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Skier video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ zIndex: 1 }}
        >
          <source src="/skier-video-opt.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div
          className="courses-overlay absolute inset-0 transition-colors duration-700"
          style={{
            background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.55) 100%)",
            zIndex: 2,
          }}
        />

        {/* Section header */}
        <div className="courses-header absolute top-8 left-0 right-0 text-center" style={{ zIndex: 10, opacity: 0 }}>
          <span
            className="text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-exo2), sans-serif", color: "#FF6B35" }}
          >
            Nasze kursy
          </span>
          <h2
            className="text-white font-bold uppercase tracking-wider mt-1"
            style={{
              fontFamily: "var(--font-teko), sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Wybierz swój poziom
          </h2>
        </div>

        {/* Course cards */}
        <div className="courses-cards absolute inset-0 flex items-center" style={{ zIndex: 10 }}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}>
          <div className="courses-progress w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="courses-progress-bar h-full bg-[#FF6B35] rounded-full" style={{ width: "0%" }} />
          </div>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3" style={{ zIndex: 10 }}>
          {courses.map((_, i) => (
            <div
              key={i}
              className={`course-dot-${i} w-2.5 h-2.5 rounded-full transition-all duration-300`}
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>

        {/* Snow cover overlay — slides up on scroll to reveal video */}
        <div className="snow-cover" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          pointerEvents: 'none',
        }}>
          <img
            src="/przejscie-removebg-preview.png"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transform: 'scaleY(1.5)',
              transformOrigin: 'top center',
            }}
          />
          <div className="snow-cover-text" style={{
            position: 'absolute',
            top: '10%',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 41,
            pointerEvents: 'auto',
          }}>
            <p className="brush-label" style={{
              fontFamily: 'var(--font-exo2), sans-serif',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.25em', color: '#FF6B35', marginBottom: '8px', opacity: 0,
            }}>▸ Oferta kursów</p>
            <h2 className="brush-title" style={{
              fontFamily: 'var(--font-teko), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#FF6B35', lineHeight: 1, marginBottom: '12px', opacity: 0,
              textShadow: `0 1px 0 #e55a2b, 0 2px 0 #cc4f26, 0 3px 0 #b34421, 0 4px 0 #99391c, 0 5px 0 #802e17, 0 6px 1px rgba(0,0,0,0.15), 0 0 5px rgba(255,107,53,0.3), 0 1px 3px rgba(0,0,0,0.2), 0 3px 5px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.05)`,
            }}>Wybierz swój kurs</h2>
            <p className="brush-desc" style={{
              fontFamily: 'var(--font-exo2), sans-serif',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', fontWeight: 400, color: '#1A1A2E',
              maxWidth: '500px', margin: '0 auto', lineHeight: 1.5, opacity: 0,
            }}>Od pierwszych kroków na stoku po freeride w głębokim puchu</p>
          </div>
        </div>

        {/* Śnieg od dołu — pojawia się na końcu scrollu */}
        <div className="courses-snow-bottom" style={{
          position: 'absolute',
          bottom: '-2px',
          left: 0,
          right: 0,
          zIndex: 45,
          pointerEvents: 'none',
          opacity: 0,
        }}>
          <img
            src="/przejscie-removebg-preview.png"
            alt=""
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transform: 'rotate(180deg)',
            }}
          />
        </div>

        {/* Biały pas pod śniegiem — łączy z harmonogramem */}
        <div className="courses-snow-fill" style={{
          position: 'absolute',
          bottom: '-50px',
          left: 0,
          right: 0,
          height: '60px',
          background: 'white',
          zIndex: 44,
          pointerEvents: 'none',
          opacity: 0,
        }} />
      </div>
    </section>

    {/* ═══ SCHEDULE SECTION ═══ */}
    <section ref={scheduleRef} className="schedule-section relative" style={{ height: '250vh', position: 'relative', zIndex: 5 }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Biały gradient na górze — łączy ze śniegiem z kursów */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '100px',
          background: 'linear-gradient(180deg, white 0%, white 60%, transparent 100%)',
          zIndex: 6,
          pointerEvents: 'none',
        }} />

        {/* Z-1: Ice texture background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/ice-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }} />

        {/* Z-2: Dark overlay gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,20,40,0.25) 0%, rgba(0,20,40,0.25) 50%, rgba(0,20,40,0.25) 100%)',
          zIndex: 2,
        }} />

        {/* Z-3: Ice glow radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(135,206,235,0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(135,206,235,0.04) 0%, transparent 50%)',
          zIndex: 3,
        }} />

        {/* Z-4: Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          zIndex: 4,
        }} />

        {/* Z-10: Content — header + legend + table */}
        <div className="schedule-content absolute inset-0 flex flex-col justify-center items-center px-[3%]" style={{ zIndex: 10 }}>

          {/* Color legend */}
          <div className="schedule-legend" style={{
            display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center',
            opacity: 0, transform: 'translateY(20px)',
          }}>
            {scheduleCourses.map((sc) => (
              <div key={sc.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: sc.color, boxShadow: `0 0 6px ${sc.color}60`,
                }} />
                <span style={{
                  fontFamily: 'var(--font-exo2), sans-serif',
                  color: 'rgba(0,0,0,0.5)', fontSize: '0.7rem', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {sc.name}
                </span>
              </div>
            ))}
          </div>

          {/* ICE CRACKS TABLE */}
          <div className="schedule-table" style={{ width: '100%', maxWidth: '1100px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 0 60px rgba(100,180,220,0.15), 0 0 1px rgba(255,255,255,0.3)',
            }}>
              {/* Frost line top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 20%, rgba(200,230,255,0.8) 50%, rgba(255,255,255,0.6) 80%, transparent)',
                zIndex: 5,
              }} />

              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '3px', background: 'rgba(255,255,255,0.15)' }}>
                <thead>
                  <tr className="schedule-header-row" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                    <th style={{
                      padding: '14px 10px', background: 'rgba(255,255,255,0.3)',
                      color: '#1A3A5C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                      fontFamily: 'var(--font-teko), sans-serif', fontSize: '0.95rem', borderRadius: '4px',
                    }}>⏰</th>
                    {scheduleDays.map(day => (
                      <th key={day} style={{
                        padding: '14px 4px', background: 'rgba(255,255,255,0.3)',
                        color: '#1A3A5C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: 'var(--font-teko), sans-serif', fontSize: '0.8rem', borderRadius: '4px',
                      }}>{day.slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleTimes.map(time => (
                    <tr key={time} className="schedule-row" style={{ opacity: 0, transform: 'translateY(40px)' }}>
                      <td style={{
                        padding: '10px', color: '#1A3A5C', fontWeight: 700,
                        fontFamily: 'var(--font-teko), sans-serif', fontSize: '1rem',
                        background: 'rgba(255,255,255,0.2)', borderRadius: '4px', textAlign: 'center',
                      }}>{time}</td>
                      {scheduleDays.map(day => {
                        const courseIdx = scheduleData[time]?.[day];
                        const cls = courseIdx !== undefined ? scheduleCourses[courseIdx] : null;
                        return (
                          <td key={day} style={{
                            padding: '4px', borderRadius: '6px',
                            background: cls ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.08)',
                          }}>
                            {cls ? (
                              <div className="schedule-cell" style={{
                                padding: '10px 6px', borderRadius: '6px', textAlign: 'center',
                                background: `rgba(255,255,255,0.3)`,
                                border: `1px solid ${cls.color}50`,
                                borderLeft: `3px solid ${cls.color}`,
                                boxShadow: `0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)`,
                                backdropFilter: 'blur(5px)',
                                position: 'relative', overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                ['--cell-glow' as string]: `${cls.color}40`,
                              }}>
                                {/* Frost line on cell */}
                                <div style={{
                                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                                  background: `linear-gradient(90deg, transparent, ${cls.color}50, transparent)`,
                                }} />
                                <div style={{
                                  fontFamily: 'var(--font-exo2), sans-serif',
                                  color: cls.color, fontWeight: 700, fontSize: '0.65rem',
                                  textTransform: 'uppercase', letterSpacing: '0.02em',
                                }}>
                                  {cls.name}
                                </div>
                                <div style={{
                                  fontFamily: 'var(--font-exo2), sans-serif',
                                  color: 'rgba(0,0,0,0.7)', fontSize: '0.6rem', fontWeight: 500, marginTop: '3px',
                                }}>
                                  {cls.instructor}
                                </div>
                              </div>
                            ) : (
                              <div style={{ padding: '10px', textAlign: 'center' }}>
                                <span style={{ color: 'rgba(0,0,0,0.12)', fontSize: '0.7rem' }}>—</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Z-40: Snow overlay top */}
        <SnowDivider position="top" zIndex={40} />

        {/* Schedule title — extracted from snow */}
        <div className="schedule-snow-text" style={{
          position: 'absolute',
          top: '4%', left: 0, right: 0,
          textAlign: 'center', zIndex: 41,
          opacity: 0, transform: 'translateY(30px)',
        }}>
          <p style={{
            fontFamily: 'var(--font-exo2), sans-serif',
            fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.25em', color: '#FF6B35', marginBottom: '8px',
          }}>
            ▸ Harmonogram
          </p>
          <h2 style={{
            fontFamily: 'var(--font-teko), sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#FF6B35', lineHeight: 1, marginBottom: '10px',
            textShadow: '0 1px 0 #e55a2b, 0 2px 0 #cc4f26, 0 3px 0 #b34421, 0 4px 0 #99391c, 0 5px 0 #802e17, 0 6px 1px rgba(0,0,0,0.15), 0 0 5px rgba(255,107,53,0.3), 0 1px 3px rgba(0,0,0,0.2)',
          }}>
            Harmonogram zajęć
          </h2>
          <p style={{
            fontFamily: 'var(--font-exo2), sans-serif',
            fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)', fontWeight: 400, color: '#1A1A2E',
            maxWidth: '450px', margin: '0 auto',
          }}>
            Zaplanuj swój tydzień na stoku — zajęcia codziennie
          </p>
        </div>

        {/* Spadający śnieg — cząsteczki */}
        <div className="schedule-snowfall absolute inset-0 pointer-events-none" style={{ zIndex: 35 }} />

        {/* Z-40: Snow bottom (mirrored) */}
        {/* Z-40: Snow bottom (mirrored) — dedykowany niższy dla harmonogramu */}
        <div className="snow-divider-bottom" style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          zIndex: 40, pointerEvents: 'none' as const,
          transform: 'scaleY(-1)',
        }}>
          <img src="/przejscie-removebg-preview.png" alt="" style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transform: 'scaleY(0.8)',
            transformOrigin: 'top center',
          }} />
        </div>

      </div>
    </section>
    </>
  );
}
