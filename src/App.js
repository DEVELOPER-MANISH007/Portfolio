import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Badge = ({ children }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
    className="inline-block px-3 py-1 rounded-full text-sm bg-white/20 text-white"
  >
    {children}
  </motion.span>
);

function SkillChip({ label, index }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Pop ripple */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isHovered ? { scale: 1.3, opacity: 0.25 } : { scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.25 }}
        style={{ boxShadow: '0 0 0 8px rgba(255,255,255,0.08)' }}
      />

      {/* Chip */}
      <motion.div
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-[1] inline-block px-3 py-1 rounded-full text-sm bg-white/15 text-white backdrop-blur-sm border border-white/10 shadow-sm "
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

function AnimatedSquaresBackground() {
  const containerRef = useRef(null);
  const squaresRef = useRef([]);
  const NUM_SQUARES = 28;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const squares = squaresRef.current;

    squares.forEach((el, i) => {
      if (!el) return;
      const size = gsap.utils.random(8, 16);
      const x = gsap.utils.random(0, bounds.width - size);
      const y = gsap.utils.random(0, bounds.height - size);
      gsap.set(el, {
        width: size,
        height: size,
        x,
        y,
        opacity: gsap.utils.random(0.15, 0.35),
        rotate: gsap.utils.random(-10, 10),
      });

      const floatY = gsap.utils.random(8, 18);
      const floatDur = gsap.utils.random(3, 6);
      gsap.to(el, {
        y: `+=${floatY}`,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        duration: floatDur,
        delay: i * 0.05,
      });
      gsap.to(el, {
        opacity: `+=${gsap.utils.random(0.1, 0.2)}`,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        duration: gsap.utils.random(2, 4),
      });
      gsap.to(el, {
        rotate: `+=${gsap.utils.random(-10, 10)}`,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        duration: gsap.utils.random(4, 7),
      });
    });

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      squares.forEach((el) => {
        if (!el) return;
        const pos = el.getBoundingClientRect();
        const cx = pos.left - rect.left + pos.width / 2;
        const cy = pos.top - rect.top + pos.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const influence = Math.max(0, 1 - dist / 180);
        if (influence > 0) {
          gsap.to(el, {
            scale: 1 + influence * 0.6,
            opacity: "+=" + influence * 0.2,
            filter: `brightness(${1 + influence * 0.8})`,
            duration: 0.35,
            ease: 'power2.out',
          });
          gsap.to(el, {
            scale: 1,
            filter: 'brightness(1)',
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.2,
          });
        }
      });
    };

    container.addEventListener('mousemove', handleMove);

    const onResize = () => {
      const b = container.getBoundingClientRect();
      squares.forEach((el) => {
        if (!el) return;
        const size = parseFloat(el.style.width || '12');
        gsap.set(el, {
          x: gsap.utils.random(0, b.width - size),
          y: gsap.utils.random(0, b.height - size),
        });
      });
    };
    window.addEventListener('resize', onResize);
    // parallax on scroll
    const parallaxTween = gsap.to(container, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    });

    return () => {
      container.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', onResize);
      gsap.killTweensOf(squares);
      parallaxTween && parallaxTween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10">
      {Array.from({ length: NUM_SQUARES }).map((_, i) => (
        <span
          key={i}
          ref={(el) => (squaresRef.current[i] = el)}
          className="absolute rounded-sm"
          style={{
            background:
              i % 3 === 0
                ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25))'
                : 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
        />
      ))}
    </div>
  );
}

function MidParallaxShapes() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to('.mid-orb-1', { x: 30, y: -20, duration: 6, ease: 'sine.inOut' }, 0)
      .to('.mid-orb-2', { x: -20, y: 24, duration: 7, ease: 'sine.inOut' }, 0)
      .to('.mid-orb-3', { x: 18, y: 16, duration: 5.5, ease: 'sine.inOut' }, 0.2);
    const st = gsap.to(el, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
    return () => { tl.kill(); st && st.kill(); };
  }, []);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 top-[35%] -z-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative h-72">
          <span className="mid-orb-1 absolute left-4 top-8 h-28 w-28 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35), rgba(0,0,0,0))' }} />
          <span className="mid-orb-2 absolute right-14 top-2 h-24 w-24 rounded-lg blur-2xl" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.35), rgba(0,0,0,0))' }} />
          <span className="mid-orb-3 absolute left-1/2 bottom-2 h-20 w-20 -translate-x-1/2 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.35), rgba(0,0,0,0))' }} />
        </div>
      </div>
    </div>
  );
}

function FooterSection() {
  const wrapperRef = useRef(null);
  const orbsRef = useRef([]);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const orbs = orbsRef.current;
    orbs.forEach((el, i) => {
      if (!el) return;
      const float = gsap.utils.random(10, 26);
      const dur = gsap.utils.random(4, 8);
      gsap.to(el, { y: `-=${float}`, yoyo: true, repeat: -1, duration: dur, ease: 'sine.inOut', delay: i * 0.2 });
      gsap.to(el, { x: `+=${gsap.utils.random(-14, 14)}`, yoyo: true, repeat: -1, duration: dur * 1.2, ease: 'sine.inOut' });
    });
    const st = gsap.to(wrapper, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });
    return () => { gsap.killTweensOf(orbs); st && st.kill(); };
  }, []);
  return (
    <footer className="relative mt-24 py-16">
      <div ref={wrapperRef} className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (orbsRef.current[i] = el)}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${gsap.utils.random(5, 90)}%`,
              top: `${gsap.utils.random(10, 80)}%`,
              width: gsap.utils.random(80, 140),
              height: gsap.utils.random(80, 140),
              background: i % 2 === 0 ? 'radial-gradient(circle, rgba(99,102,241,0.25), rgba(0,0,0,0))' : 'radial-gradient(circle, rgba(168,85,247,0.25), rgba(0,0,0,0))',
            }}
          />
        ))}
      </div>
      <div className="text-center text-slate-300">
        <p className="text-sm">© {new Date().getFullYear()} Manish Kumar</p>
        <p className="text-xs opacity-70 mt-1">Built with React, Tailwind, Framer Motion, and GSAP</p>
      </div>
    </footer>
  );
}
function GlobalCursorTrail() {
  const containerRef = useRef(null);
  const dotsRef = useRef([]);
  const DOT_COUNT = 100;
  const spotlightRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dots = dotsRef.current;
    const colors = [
      'rgba(99,102,241,0.6)',
      'rgba(168,85,247,0.6)',
      'rgba(56,189,248,0.6)',
      'rgba(255,255,255,0.45)'
    ];

    dots.forEach((el, i) => {
      if (!el) return;
      const size = gsap.utils.random(8, 18);
      const isSquare = i % 3 === 0;
      gsap.set(el, {
        width: size,
        height: size,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        backgroundColor: colors[i % colors.length],
        opacity: 0,
        borderRadius: isSquare ? '3px' : '9999px',
        rotate: isSquare ? gsap.utils.random(-20, 20) : 0,
        filter: 'blur(0.8px)'
      });

      if (isSquare) {
        gsap.to(el, {
          rotate: `+=${gsap.utils.random(-45, 45)}`,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          duration: gsap.utils.random(3, 6),
        });
      }
    });

    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let ticking = false;

    const handleMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      // move spotlight
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: lastX,
          y: lastY,
          opacity: 0.6,
          duration: 0.18,
          ease: 'power3.out',
        });
      }
      if (!ticking) {
        window.requestAnimationFrame(() => {
          dots.forEach((el, i) => {
            if (!el) return;
            const delay = i * 0.01;
            gsap.to(el, {
              x: lastX + gsap.utils.random(-18, 18),
              y: lastY + gsap.utils.random(-18, 18),
              scale: 1,
              opacity: gsap.utils.clamp(0.3, 0.95, 0.95 - i * 0.007),
              duration: 0.16 + delay,
              ease: 'power3.out',
            });
            gsap.to(el, {
              opacity: 0,
              scale: 0.95,
              duration: 0.9,
              ease: 'power2.out',
              delay: 0.2 + delay,
            });
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    const handleLeave = () => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      }
    };
    window.addEventListener('mouseleave', handleLeave);

    const handleClick = (e) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const burst = dots.slice(0, 25);
      burst.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          x: cx + gsap.utils.random(-40, 40),
          y: cy + gsap.utils.random(-40, 40),
          scale: 1.15,
          opacity: 1,
          duration: 0.22 + i * 0.005,
          ease: 'power3.out',
        });
        gsap.to(el, {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2,
        });
      });
    };
    window.addEventListener('click', handleClick);

    // scroll-linked fade + slight y parallax
    const fadeTween = gsap.to(container, {
      opacity: 0.85,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });
    const yTween = gsap.to(container, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('click', handleClick);
      gsap.killTweensOf(dots);
      fadeTween && fadeTween.kill();
      yTween && yTween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-10 mix-blend-screen">
      {/* spotlight that follows cursor */}
      <span
        ref={spotlightRef}
        className="absolute"
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          width: 560,
          height: 560,
          borderRadius: '9999px',
          background:
            'radial-gradient(closest-side, rgba(99,102,241,0.8), rgba(168,85,247,0.6) 45%, rgba(0,0,0,0) 72%)',
          filter: 'blur(14px)',
          opacity: 0,
          boxShadow: '0 0 120px rgba(167,139,250,0.5)'
        }}
      />
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <span
          key={i}
          ref={(el) => (dotsRef.current[i] = el)}
          className="absolute"
          style={{ boxShadow: '0 0 60px rgba(255,255,255,0.28)' }}
        />
      ))}
    </div>
  );
}
function TypingEffect({ words = [], speed = 80, pause = 1200 }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const word = words[index % words.length] || '';
    if (typing) {
      if (display.length < word.length) {
        timeout = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(display.slice(0, -1)), Math.max(30, speed / 2));
      } else {
        setTyping(true);
        setIndex((i) => i + 1);
      }
    }
    return () => clearTimeout(timeout);
  }, [display, typing, index, words, speed, pause]);

  return <span>{display}</span>;
}

function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative flex flex-col md:flex-row items-center gap-10 py-16"
    >
      <AnimatedSquaresBackground />
      {/* background accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.15 }}
      />

      {/* avatar with gradient ring + shine */}
      <Tilt glareEnable={true} glareMaxOpacity={0.15} scale={1.04}>
        <motion.div
          className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-fuchsia-500 shadow-xl"
          whileHover={{ rotate: 1 }}
        >
          <div className="relative rounded-full overflow-hidden bg-slate-900">
            <motion.img
              src="/profile.jpg"
              alt="Profile"
              className="w-60 h-60 rounded-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
            {/* shine */}
            <motion.span
              className="pointer-events-none absolute inset-0"
              initial={{ x: '-120%' }}
              whileHover={{ x: '120%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{
                background:
                  'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
              }}
            />
          </div>
        </motion.div>
      </Tilt>

      {/* text + ctas */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300 border border-emerald-400/20">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Available for work
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-fuchsia-200">
          Manish Kumar
        </h1>
        <h2 className="text-2xl text-slate-200 mt-2">
          <TypingEffect words={["Full Stack Developer","React Enthusiast","Problem Solver"]} />
        </h2>
        <p className="mt-4 text-slate-200/90 max-w-xl md:max-w-2xl">
          Aspiring Full Stack Developer passionate about building scalable apps, solving real-world problems,
          and crafting smooth user experiences. With knowledge of React, Node.js, and modern tools, I aim to
          deliver impactful solutions.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500 transition"
          >
            <span>Download Resume</span>
            <svg className="h-4 w-4 opacity-90 group-hover:translate-y-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/></svg>
          </a>
          <a
            href="mailto:manish8755026341@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
            Contact
          </a>
          <a
            href="https://github.com/DEVELOPER-MANISH007"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56l-.01-2.03c-3.21.7-3.89-1.55-3.89-1.55-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.19 1.75 1.19 1.02 1.75 2.68 1.25 3.34.95.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.28 1.19-3.08-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.65.23 2.87.11 3.17.74.8 1.19 1.82 1.19 3.08 0 4.43-2.7 5.41-5.28 5.69.41.36.77 1.08.77 2.17l-.01 3.22c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" clipRule="evenodd"/></svg>
          </a>
          <a
            href="https://www.linkedin.com/in/mitansh-kumar-aaabb333b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition"
            aria-label="LinkedIn"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23h-4V8.5z"/></svg>
          </a>
        </div>
      </div>
    </motion.section>
  );
}

function SkillsSection() {
  const skills = ['React','Node.js','JavaScript','MongoDB','Tailwind','GSAP','Java (Basic)','Python (Basic)'];
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-12"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Skills</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((s, i) => (
          <SkillChip key={s} label={s} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsSection() {
  const projects = [
    { name: 'User Management System', link: 'https://github.com/DEVELOPER-MANISH007/USER-MANAGEMENT-SYSTEM' },
    { name: 'VirtualR', link: 'https://github.com/DEVELOPER-MANISH007/VirtualR' },
    { name: 'Task Management System', link: 'https://github.com/DEVELOPER-MANISH007/TASK-MANAGEMENT-SYSTEM' },
    { name: 'GitHub Profile', link: 'https://github.com/DEVELOPER-MANISH007' }
  ];
  return (
    <section className="py-12">
      <h3 className="text-2xl font-semibold text-white mb-6">Projects</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-white/10 shadow hover:shadow-lg hover:bg-white/20 block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <h4 className="font-medium text-white">{p.name}</h4>
            <p className="text-slate-200 mt-2">Check out my project: {p.name}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
  const toEmail = process.env.REACT_APP_CONTACT_TO || 'manish8755026341@gmail.com';

  // Initialize EmailJS once with public key (safer across versions)
  useEffect(() => {
    if (publicKey && !['YOUR_PUBLIC_KEY', ''].includes(publicKey)) {
      try { emailjs.init({ publicKey }); } catch (e) { /* noop */ }
    }
  }, [publicKey]);

  const validate = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill out all fields.');
      return false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!validate()) return;

    // Guard against missing configuration
    const isMissingConfig = [serviceId, templateId, publicKey].some((v) => !v || v.startsWith('YOUR_'));
    if (isMissingConfig) {
      setErrorMessage('Email is not configured. Set SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY.');
      return;
    }
    // Guard against missing recipient
    const recipient = (toEmail || '').trim();
    if (!recipient || !recipient.includes('@')) {
      setErrorMessage('Recipient email is missing. Set REACT_APP_CONTACT_TO or update your template “To” field.');
      return;
    }
    setIsSending(true);
    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        reply_to: email,
        to_email: recipient,
        to: recipient,
        message,
      };
      // Works whether init() was called or not
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setSuccessMessage('Thanks! Your message has been sent.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      // Surface readable reason if available
      const reason = (err && (err.text || err.message)) ? String(err.text || err.message) : 'Unknown error';
      console.error('EmailJS send failed:', err);
      if (/recipient/i.test(reason) && /empty/i.test(reason)) {
        setErrorMessage('Failed to send: Recipient is empty. In EmailJS template, set the “To” field to your email or {{to_email}} and ensure REACT_APP_CONTACT_TO is set.');
      } else {
        setErrorMessage(`Failed to send: ${reason}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-12"
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Contact</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-slate-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-slate-200 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-md bg-white/10 border border-white/15 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your message..."
            />
          </div>

          {errorMessage && (
            <div className="text-red-400 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-emerald-400 text-sm">{successMessage}</div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {isSending ? 'Sending…' : 'Send Message'}
          </button>
        </form>

        <div className="space-y-2 text-slate-200">
          <p>Email: <a href="mailto:manish8755026341@gmail.com" className="underline">manish8755026341@gmail.com</a></p>
          <p>Phone: 7456861606</p>
          <p>GitHub: <a href="https://github.com/DEVELOPER-MANISH007" className="underline">github.com/DEVELOPER-MANISH007</a></p>
          <p>LinkedIn: <a href="https://www.linkedin.com/in/mitansh-kumar-aaabb333b" className="underline">linkedin.com/in/mitansh-kumar</a></p>
          <div className="text-xs text-slate-400 pt-2">
           
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Portfolio() {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen relative overflow-hidden">
      <GlobalCursorTrail />
      <MidParallaxShapes />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <FooterSection />
      </div>
    </div>
  );
}
