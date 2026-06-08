/* ============================================
   PAGE LOADER
   ============================================ */
function initPageLoader() {
  const style = document.createElement("style");
  style.textContent = `
    #pageLoader { position:fixed; inset:0; background:#0f172a; display:flex; align-items:center; justify-content:center; z-index:999999; transition:opacity 0.6s ease, visibility 0.6s ease; }
    .loader-inner { text-align:center; }
    .loader-logo { font-size:42px; font-weight:700; color:#fff; margin-bottom:20px; font-family:'Poppins',sans-serif; }
    .loader-logo span { color:#4f46e5; }
    .loader-bar { width:200px; height:4px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden; margin:0 auto; }
    .loader-fill { height:100%; width:0; background:linear-gradient(135deg,#4f46e5,#7c3aed); border-radius:10px; animation:loadProgress 1.5s ease forwards; }
    @keyframes loadProgress { 0%{width:0} 60%{width:70%} 100%{width:100%} }
  `;
  document.head.appendChild(style);

  const loader = document.createElement("div");
  loader.id = "pageLoader";
  loader.innerHTML = `<div class="loader-inner"><div class="loader-logo">Portfolio<span>.</span></div><div class="loader-bar"><div class="loader-fill"></div></div></div>`;
  document.body.appendChild(loader);
  document.body.style.overflow = "hidden";

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      document.body.style.overflow = "";
      setTimeout(() => loader.remove(), 600);
    }, 1600);
  });
}

/* ============================================
   PARTICLES
   ============================================ */
function initParticles() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
  hero.style.position = "relative";
  hero.insertBefore(canvas, hero.firstChild);

  const container = hero.querySelector(".container");
  if (container) { container.style.position = "relative"; container.style.zIndex = "1"; }

  const ctx = canvas.getContext("2d");
  const resize = () => { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; };
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.5 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,70,229,${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,70,229,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuBtn.querySelector("i");
      icon?.classList.toggle("fa-bars");
      icon?.classList.toggle("fa-times");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = menuBtn.querySelector("i");
        if (icon) { icon.classList.add("fa-bars"); icon.classList.remove("fa-times"); }
      });
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a[href^='#']");

  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 100 && scrollY < section.offsetTop - 100 + section.offsetHeight) {
        navItems.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
        });
      }
    });
    if (navbar) navbar.style.boxShadow = scrollY > 50 ? "0 4px 30px rgba(0,0,0,0.12)" : "0 2px 20px rgba(0,0,0,0.05)";
  });
}

/* ============================================
   CUSTOM CURSOR (desktop only)
   ============================================ */
function initCustomCursor() {
  if (window.innerWidth < 768) return;

  const dot = Object.assign(document.createElement("div"), { id: "cursorDot" });
  const ring = Object.assign(document.createElement("div"), { id: "cursorRing" });

  dot.style.cssText = "position:fixed;width:8px;height:8px;background:#4f46e5;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform 0.1s ease;";
  ring.style.cssText = "position:fixed;width:36px;height:36px;border:2px solid rgba(79,70,229,0.6);border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:all 0.15s ease;";

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.style.cursor = "none";

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + "px"; dot.style.top = mouseY + "px";
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px"; ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll("a, button, .filter-btn, .service-card, .portfolio-item, input, textarea").forEach(el => {
    el.style.cursor = "none";
    el.addEventListener("mouseenter", () => {
      dot.style.transform = "translate(-50%,-50%) scale(2)";
      ring.style.cssText += "width:56px;height:56px;border-color:rgba(79,70,229,1);background:rgba(79,70,229,0.08);";
    });
    el.addEventListener("mouseleave", () => {
      dot.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.cssText += "width:36px;height:36px;border-color:rgba(79,70,229,0.6);background:transparent;";
    });
  });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const el = document.querySelector(".typed-text");
  if (!el) return;

  const words = ["Frontend Developer 💻", "GoHighLevel Expert 🚀", "Problem Solver 🔧"];
  let wi = 0, ci = 0, deleting = false;

  el.style.cssText += "border-right:2px solid #4f46e5;padding-right:4px;animation:blink 0.7s step-end infinite;";
  const s = document.createElement("style");
  s.textContent = "@keyframes blink{0%,100%{border-color:#4f46e5}50%{border-color:transparent}}";
  document.head.appendChild(s);

  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci - 1) : word.substring(0, ci + 1);
    deleting ? ci-- : ci++;
    let speed = deleting ? 60 : 100;
    if (!deleting && ci === word.length) { speed = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 400; }
    setTimeout(type, speed);
  }
  type();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const s = document.createElement("style");
  s.textContent = `
    .fade-in-up{opacity:0;transform:translateY(40px);transition:opacity 0.7s ease,transform 0.7s ease}
    .fade-in-left{opacity:0;transform:translateX(-40px);transition:opacity 0.7s ease,transform 0.7s ease}
    .fade-in-right{opacity:0;transform:translateX(40px);transition:opacity 0.7s ease,transform 0.7s ease}
    .fade-in-up.visible,.fade-in-left.visible,.fade-in-right.visible{opacity:1;transform:translate(0)}
    .delay-1{transition-delay:0.1s}.delay-2{transition-delay:0.2s}.delay-3{transition-delay:0.3s}.delay-4{transition-delay:0.4s}.delay-5{transition-delay:0.5s}
  `;
  document.head.appendChild(s);

  [
    [".section-header", "fade-in-up"], [".service-card", "fade-in-up"],
    [".portfolio-item", "fade-in-up"], [".testimonial-card", "fade-in-up"],
    [".about-image", "fade-in-left"], [".about-text", "fade-in-right"],
    [".contact-info", "fade-in-left"], [".contact-form", "fade-in-right"],
    [".stat", "fade-in-up"],
  ].forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      if (i < 5) el.classList.add(`delay-${i + 1}`);
    });
  });

  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.12 });
  document.querySelectorAll(".fade-in-up,.fade-in-left,.fade-in-right").forEach(el => obs.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
  const stats = document.querySelectorAll(".stat h3");
  if (!stats.length) return;

  const targets = [...stats].map(el => {
    const text = el.textContent;
    const num = parseInt(text);
    const suffix = text.replace(/[0-9]/g, "");
    el.textContent = "0" + suffix;
    return { el, target: num, suffix, started: false };
  });

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = targets.find(t => t.el === entry.target);
      if (!item || item.started) return;
      item.started = true;
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / 2000, 1);
        item.el.textContent = Math.round(easeOut(p) * item.target) + item.suffix;
        if (p < 1) requestAnimationFrame(update);
      })(start);
    });
  }, { threshold: 0.5 });

  targets.forEach(item => obs.observe(item.el));
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function initToastNotification() {
  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed;bottom:30px;right:30px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:16px 24px;border-radius:14px;font-size:15px;font-weight:600;box-shadow:0 10px 40px rgba(79,70,229,0.4);z-index:99999;display:flex;align-items:center;gap:10px;transform:translateY(100px);opacity:0;transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);max-width:340px;";
  document.body.appendChild(toast);

  window.showToast = function (msg, type = "success") {
    toast.innerHTML = (type === "success" ? "✅" : "❌") + " " + msg;
    toast.style.background = type === "error" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#4f46e5,#7c3aed)";
    toast.style.boxShadow = type === "error" ? "0 10px 40px rgba(239,68,68,0.4)" : "0 10px 40px rgba(79,70,229,0.4)";
    toast.style.transform = "translateY(0)"; toast.style.opacity = "1";
    setTimeout(() => { toast.style.transform = "translateY(100px)"; toast.style.opacity = "0"; }, 3500);
  }
}

/* ============================================
   DARK MODE
   ============================================ */
function initDarkMode() {
  const btn = document.createElement("button");
  btn.id = "darkModeToggle";
  btn.style.cssText = "position:fixed;bottom:100px;right:30px;width:50px;height:50px;border-radius:50%;border:none;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:18px;cursor:pointer;z-index:9999;box-shadow:0 5px 20px rgba(79,70,229,0.4);transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;";

  const darkCSS = document.createElement("style");
  darkCSS.textContent = `
    body.dark-mode{--dark:#f1f5f9;--light:#0f172a;--white:#1e293b;--gray:#94a3b8;--gray-light:#334155;background:#0f172a;color:#f1f5f9}
    body.dark-mode .navbar{background:rgba(15,23,42,0.95)}
    body.dark-mode .hero{background:linear-gradient(135deg,#0f172a,#1e293b)}
    body.dark-mode .service-card,body.dark-mode .testimonial-card,body.dark-mode .contact-form{background:#1e293b;box-shadow:0 5px 20px rgba(0,0,0,0.3)}
    body.dark-mode .contact-form input,body.dark-mode .contact-form textarea{background:#0f172a;color:#f1f5f9}
    body.dark-mode .contact-form input::placeholder,body.dark-mode .contact-form textarea::placeholder{color:#64748b}
    body.dark-mode .filter-btn{background:#1e293b;color:#94a3b8}
    body.dark-mode footer{background:#020617}
    body.dark-mode .social-floating a,body.dark-mode .social-links a{background:#1e293b;color:#f1f5f9}
    body.dark-mode #darkModeToggle{background:linear-gradient(135deg,#fbbf24,#f59e0b);box-shadow:0 5px 20px rgba(251,191,36,0.4)}
    body.dark-mode .nav-links a { color:#f1f5f9!important;;}
    body.dark-mode .nav-links { background:rgba(15,23,42,0.98) !important;}
    body.dark-mode .footer-links a{color:rgba(255,255,255,0.7)}
  `;
  document.head.appendChild(darkCSS);
  document.body.appendChild(btn);

  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) { document.body.classList.add("dark-mode"); btn.innerHTML = `<i class="fas fa-sun"></i>`; }
  else btn.innerHTML = `<i class="fas fa-moon"></i>`;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const dark = document.body.classList.contains("dark-mode");
    btn.innerHTML = dark ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
    localStorage.setItem("darkMode", dark);
  });
  btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.15) rotate(20deg)");
  btn.addEventListener("mouseleave", () => btn.style.transform = "scale(1) rotate(0deg)");
}

/* ============================================
   SKILL BARS
   ============================================ */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-progress");
  if (!bars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.getAttribute("data-progress"); obs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  bars.forEach(b => obs.observe(b));
}

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initPortfolioFilter() {
  const s = document.createElement("style");
  s.textContent = "@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}";
  document.head.appendChild(s);

  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portfolio-item");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      items.forEach(item => {
        const show = filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = show ? "block" : "none";
        if (show) item.style.animation = "fadeInUp 0.4s ease forwards";
      });
    });
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  btn.style.cssText += "position:fixed;bottom:35px;left:30px;width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 5px 20px rgba(79,70,229,0.4);opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:9998;";
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 400 ? "1" : "0";
    btn.style.visibility = window.scrollY > 400 ? "visible" : "hidden";
  });
  btn.addEventListener("mouseenter", () => btn.style.transform = "translateY(-4px) scale(1.1)");
  btn.addEventListener("mouseleave", () => btn.style.transform = "translateY(0) scale(1)");
}

/* ============================================
   CONTACT FORM — NETLIFY FUNCTION
   ============================================ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const origText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
    btn.disabled = true;

    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        showToast("Message sent! I'll reply soon 🎉");
        form.reset();
      } else {
        showToast("Failed to send message", "error");
      }
    } catch (error) {
      showToast("Server error, please try again", "error");
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });
}

/* ============================================
   INIT ALL
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initPageLoader();
  initParticles();
  initNavigation();
  initCustomCursor();
  initTypingEffect();
  initScrollAnimations();
  initCounterAnimation();
  initToastNotification();
  initDarkMode();
  initSkillBars();
  initPortfolioFilter();
  initBackToTop();
  initContactForm();
  console.log("%c🚀 Portfolio Loaded — Ahmad Hassan", "color:#4f46e5;font-size:16px;font-weight:bold;");
});