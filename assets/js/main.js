/**
 * Anant Nova — Master Interactive Logic & Dynamic Components
 * Handles: Header Glass Shrink, Lifecycle Journey Stepper, Capabilities Filtering,
 * Interactive Scope & Roadmap Estimator, FAQ Accordion, and Strategy Inquiry Modal.
 */

(function () {
  'use strict';

  function initApp() {

  // ==========================================
  // 1. Sticky Glass Header Scroll Effect & Dynamic Notice Bar Sync
  //    - Measures notice bar height dynamically (handles 1 or multi-line wrap)
  //    - Keeps header cleanly below notice bar at all scroll positions
  //    - Hides up smoothly when actively scrolling down
  //    - Re-emerges smoothly when scrolling stops or on scroll up
  //    - Condenses style when scrolled past announcement bar
  // ==========================================
  const siteHeader = document.querySelector('.site-header');
  const topNoticeBar = document.querySelector('.top-notice-bar');

  function getNoticeBarHeight() {
    return topNoticeBar ? topNoticeBar.offsetHeight : 0;
  }

  function updateHeaderScroll() {
    if (!siteHeader) return;
    const currentScrollY = window.scrollY;
    const noticeHeight = getNoticeBarHeight();
    const remainingNotice = Math.max(0, noticeHeight - currentScrollY);

    // Keep header positioned directly below whatever of the notice bar is visible
    document.documentElement.style.setProperty('--notice-offset', `${remainingNotice}px`);

    // Condense capsule once scrolled past the announcement bar
    if (noticeHeight > 0 ? currentScrollY >= noticeHeight : currentScrollY > 25) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  function syncNoticeBar() {
    const height = getNoticeBarHeight();
    document.documentElement.style.setProperty('--notice-bar-height', `${height}px`);
    updateHeaderScroll();
  }

  // Initial measurement and resize tracking
  syncNoticeBar();
  window.addEventListener('resize', syncNoticeBar, { passive: true });

  if (siteHeader) {
    let lastScrollY = window.scrollY;
    let scrollStopTimer = null;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      updateHeaderScroll();

      // Hide navbar when actively scrolling down past initial threshold
      const noticeHeight = getNoticeBarHeight();
      if (delta > 6 && currentScrollY > (noticeHeight + 35)) {
        siteHeader.classList.add('nav-hidden');
      } else if (delta < 0 || currentScrollY <= noticeHeight) {
        // Immediately reveal when scrolling up or near page top
        siteHeader.classList.remove('nav-hidden');
      }

      lastScrollY = currentScrollY;

      // Reveal navbar with smooth slide-down animation when user stops scrolling
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        siteHeader.classList.remove('nav-hidden');
      }, 120);
    }, { passive: true });

    // Instantaneous stop-reveal when scroll motion completes
    window.addEventListener('scrollend', () => {
      siteHeader.classList.remove('nav-hidden');
    }, { passive: true });
  }

  // ==========================================
  // 2. Mobile Navigation Drawer & Hamburger
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-toggle-btn') || document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer') || document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay') || document.querySelector('.mobile-nav-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('mobile-nav-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('mobile-nav-open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1060 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileNav();
    }
  }, { passive: true });

  // ==========================================
  // 2b. Smooth Scroll with Dynamic Header Offset
  // Ensures #problem, #capabilities start cleanly at top
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerEl = document.querySelector('.site-header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 76;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, targetPosition - headerHeight - 14);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeMobileNav();
        }

        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // ==========================================
  // 3. The Business Journey Data & Stepper
  // ==========================================
  const journeyStages = {
    start: {
      number: '01',
      badge: 'STAGE 01 — FOUNDATION',
      title: 'Business Setup & Legal Foundation',
      tagline: 'Turn your intention into a legally structured, compliant business.',
      desc: 'Instead of searching for different accountants, lawyers, and documentation agents, Anant Nova manages your business incorporation, registrations, and regulatory compliance under one roof.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'A completely legal, registered, compliant company ready to invoice and bank.',
      deliveryType: 'MANAGED NETWORK + IN-HOUSE',
      visualTitle: 'Foundation Architecture',
      checklist: [
        'Business Consultation & Model Planning',
        'Company / LLP / Partnership Registration',
        'GST & MSME / Udyam Certification',
        'Trademark Filing & Intellectual Property',
        'Corporate Bank Account Connections',
        'Legal Contracts & Founders Agreements'
      ]
    },
    brand: {
      number: '02',
      badge: 'STAGE 02 — IDENTITY',
      title: 'Building How Your Business is Seen',
      tagline: 'A business needs more than a name. It needs an unmistakable visual presence.',
      desc: 'We craft comprehensive brand systems that establish instant market authority across digital, print, and physical touchpoints.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'A cohesive, luxury brand identity that attracts high-value clients.',
      deliveryType: 'IN-HOUSE CORE CAPABILITY',
      visualTitle: 'Visual Systems & Design',
      checklist: [
        'Brand Strategy & Market Positioning',
        'Logo Design & Dynamic Iconography',
        'Brand Guidelines & Design Tokens',
        'Typography & Color Harmonization',
        'Presentation Decks & Pitch Documents',
        'Social Media Assets & Marketing Collaterals'
      ]
    },
    build: {
      number: '03',
      badge: 'STAGE 03 — TECHNOLOGY',
      title: 'Turning Ideas Into High-Performance Tech',
      tagline: 'World-class engineering built around your real business requirements.',
      desc: 'From ultra-converting landing pages to complex SaaS architectures, internal business systems, and mobile applications, our engineering core develops scalable, robust software.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Production-ready, ultra-fast digital products engineered to scale.',
      deliveryType: 'IN-HOUSE CORE CAPABILITY',
      visualTitle: 'Software & Cloud Engineering',
      checklist: [
        'High-Converting Landing Pages & Portals',
        'Full-Stack Custom Web Applications',
        'Mobile Apps (iOS, Android, Cross-Platform)',
        'SaaS Platforms, Dashboards & ERP/CRM',
        'Robust API & Database Architecture',
        'Cloud Infrastructure & CI/CD Pipelines'
      ]
    },
    intelligence: {
      number: '04',
      badge: 'STAGE 04 — ARTIFICIAL INTELLIGENCE',
      title: 'AI & Intelligent Technology Integration',
      tagline: 'Put frontier AI to work to multiply operational leverage.',
      desc: 'We integrate generative AI, autonomous agentic workflows, and LLM-powered business tools directly into your products and internal pipelines.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Intelligent systems that automate complex thinking and augment team velocity.',
      deliveryType: 'IN-HOUSE CORE CAPABILITY',
      visualTitle: 'Agentic AI & Neural Systems',
      checklist: [
        'Custom Generative AI Applications',
        'Autonomous Business AI Agents',
        'Enterprise LLM & Vector Search Workflows',
        'Document & Unstructured Data Intelligence',
        'Intelligent Recommendation Engines',
        'Automated AI Content & Asset Engines'
      ]
    },
    automate: {
      number: '05',
      badge: 'STAGE 05 — EFFICIENCY',
      title: 'Turning Repetitive Work Into Systems',
      tagline: 'Eliminate manual bottlenecks with seamless workflow automation.',
      desc: 'We analyze your recurring daily operational tasks and engineer automated triggers, data syncs, notifications, and sales pipelines.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Less manual overhead, faster operations, and zero dropped leads.',
      deliveryType: 'IN-HOUSE + NETWORK INTEGRATION',
      visualTitle: 'System Orchestration',
      checklist: [
        'End-to-End Business Process Automation',
        'Lead Capture & Sales Pipeline Automation',
        'Customer Onboarding & Retention Flows',
        'Automated Multi-Channel Notifications',
        'Cross-Platform API & Webhook Syncs',
        'Automated Financial & Performance Reporting'
      ]
    },
    grow: {
      number: '06',
      badge: 'STAGE 06 — VISIBILITY & AEO',
      title: 'Modern SEO, AEO & Growth Marketing',
      tagline: 'Engineered for visibility in Google and modern AI search engines.',
      desc: 'Building a great product is only half the battle. We optimize your brand to dominate traditional organic search and ensure your business is recommended by Perplexity, SearchGPT, and AI Overviews.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Compound organic discovery, high search rankings, and predictable customer acquisition.',
      deliveryType: 'IN-HOUSE CORE + EXPERT NETWORK',
      visualTitle: 'Search & Answer Engine Authority',
      checklist: [
        'Technical & On-Page SEO Architecture',
        'Answer Engine Optimization (AEO for AI Engines)',
        'Schema.org Entity & Knowledge Graph Setup',
        'High-Intent Performance Advertising',
        'Local SEO & Google Business Optimization',
        'Content Strategy & Thought Leadership'
      ]
    },
    source: {
      number: '07',
      badge: 'STAGE 07 — PHYSICAL SOURCING',
      title: 'Products, Packaging & Vendor Coordination',
      tagline: 'Seamlessly bridging digital capabilities with physical supply chains.',
      desc: 'Businesses frequently require physical assets alongside digital systems. Anant Nova coordinates packaging, printing, merchandise, and trusted supplier connections.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Premium tangible brand assets manufactured and delivered reliably.',
      deliveryType: 'CURATED VENDOR NETWORK',
      visualTitle: 'Physical Production & Sourcing',
      checklist: [
        'Custom Packaging & Structural Box Design',
        'Product Labels, Stickers & Finishes',
        'Signboards, Retail Banners & Store Branding',
        'Corporate Merchandise & Promotional Goods',
        'Verified Manufacturer & Wholesaler Sourcing',
        'Quality Assurance & Fulfillment Coordination'
      ]
    },
    evolve: {
      number: '08',
      badge: 'STAGE 08 — CONTINUOUS EVOLUTION',
      title: 'Scale, Ongoing Support & Nova Labs R&D',
      tagline: 'A business or product should never stop improving.',
      desc: 'As your business scales, your requirements evolve. We provide 24/7 infrastructure monitoring, feature expansion, and direct access to emerging technologies through Nova Labs.',
      outcomeLabel: 'DELIVERABLE OUTCOME',
      outcomeText: 'Continuous competitive advantage through relentless iteration.',
      deliveryType: 'FULL ECOSYSTEM SUPPORT',
      visualTitle: 'Continuous Scaling & R&D',
      checklist: [
        '24/7 Application & Cloud Infrastructure Maintenance',
        'Performance & Database Optimization',
        'Quarterly Feature Engineering & Roadmapping',
        'Nova Labs Experimental AI Technology Access',
        'Security Audits & Compliance Upgrades',
        'Market Expansion & Venture Support'
      ]
    }
  };

  const stageBtns = document.querySelectorAll('.stage-btn');
  const journeyDisplay = document.querySelector('.journey-display-card');

  if (stageBtns.length > 0 && journeyDisplay) {
    stageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stageKey = btn.getAttribute('data-stage');
        const data = journeyStages[stageKey];
        if (!data) return;

        // Update active class
        stageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Smoothly update content
        journeyDisplay.style.opacity = '0.4';
        journeyDisplay.style.transform = 'translateY(8px)';
        journeyDisplay.style.transition = 'all 0.25s ease';

        setTimeout(() => {
          document.getElementById('j-badge').textContent = data.badge;
          document.getElementById('j-title').textContent = data.title;
          document.getElementById('j-tagline').textContent = data.tagline;
          document.getElementById('j-desc').textContent = data.desc;
          document.getElementById('j-outcome-label').textContent = data.outcomeLabel;
          document.getElementById('j-outcome-text').textContent = data.outcomeText;
          document.getElementById('j-panel-num').textContent = data.number;
          document.getElementById('j-panel-title').textContent = data.visualTitle;
          document.getElementById('j-panel-type').textContent = data.deliveryType;

          // Populate checklist
          const checklistEl = document.getElementById('j-checklist');
          checklistEl.innerHTML = data.checklist.map(item => `
            <li class="cap-check-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${item}</span>
            </li>
          `).join('');

          journeyDisplay.style.opacity = '1';
          journeyDisplay.style.transform = 'translateY(0)';
        }, 250);
      });
    });
  }

  // ==========================================
  // 4. Master Capabilities Filtering
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const capabilityCards = document.querySelectorAll('.capability-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        capabilityCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.3s ease';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // 5. Interactive Scope & Roadmap Estimator
  // ==========================================
  const estimatorLabels = document.querySelectorAll('.estimator-checkbox-label');
  const resTime = document.getElementById('res-time');
  const resStages = document.getElementById('res-stages');
  const resLayers = document.getElementById('res-layers');
  const resPhasesList = document.getElementById('res-phases-list');
  const estimatorBtn = document.getElementById('estimator-cta-btn');

  function updateEstimator() {
    const selected = document.querySelectorAll('.estimator-checkbox-label.selected');
    const selectedPhases = new Set();
    const selectedLayers = new Set();
    let totalScore = 0;

    selected.forEach(item => {
      const phase = item.getAttribute('data-phase');
      const layer = item.getAttribute('data-layer');
      const score = parseInt(item.getAttribute('data-score') || '1', 10);

      if (phase) selectedPhases.add(phase);
      if (layer) selectedLayers.add(layer);
      totalScore += score;
    });

    // Calculate time estimate
    let timelineText = '2 - 3 Weeks';
    if (totalScore > 12) {
      timelineText = '8 - 12 Weeks';
    } else if (totalScore > 6) {
      timelineText = '4 - 6 Weeks';
    } else if (totalScore === 0) {
      timelineText = 'Select services to estimate';
    }

    if (resTime) resTime.textContent = timelineText;
    if (resStages) resStages.textContent = selectedPhases.size > 0 ? `${selectedPhases.size} Stages Involved` : '—';
    if (resLayers) resLayers.textContent = selectedLayers.size > 0 ? Array.from(selectedLayers).join(', ') : '—';

    // Render phase pills
    if (resPhasesList) {
      if (selectedPhases.size === 0) {
        resPhasesList.innerHTML = '<span class="phase-pill">Choose your requirements</span>';
      } else {
        resPhasesList.innerHTML = Array.from(selectedPhases)
          .map(phase => `<span class="phase-pill">${phase}</span>`)
          .join('');
      }
    }
  }

  if (estimatorLabels.length > 0) {
    estimatorLabels.forEach(label => {
      label.addEventListener('click', () => {
        label.classList.toggle('selected');
        updateEstimator();
      });
    });
    // Initial calculate
    updateEstimator();
  }

  if (estimatorBtn) {
    estimatorBtn.addEventListener('click', () => {
      openModal('Custom Scope & Roadmap Consultation');
    });
  }

  // ==========================================
  // 6. FAQ Accordion (AEO Optimized)
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const answer = faqItem.querySelector('.faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const ans = item.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        faqItem.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // ==========================================
  // 7. Project Inquiry & Strategy Call Modal
  // ==========================================
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-inquiry-modal');
  const inquiryForm = document.getElementById('inquiry-form');
  const modalTopicSelect = document.getElementById('modal-topic-select');

  function openModal(topic = '') {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (modalTopicSelect && topic) {
      modalTopicSelect.value = topic;
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = btn.getAttribute('data-topic') || '';
      openModal(topic);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Strategy Brief...';

      setTimeout(() => {
        inquiryForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); color: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.75rem;">✓</div>
            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Requirement Received</h3>
            <p style="color: #64748B; font-size: 0.95rem; line-height: 1.6; max-width: 440px; margin: 0 auto 1.5rem;">Thank you. Anant Nova's executive team will analyze your project scope and contact you within 24 hours with an execution roadmap.</p>
            <button class="btn btn-primary" onclick="location.reload()" style="margin: 0 auto;">Close</button>
          </div>
        `;
      }, 1200);
    });
  }

  // ==========================================
  // 8. Scroll-Triggered Reveal Engine (Fade In / Up / Stagger)
  // ==========================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ==========================================
  // 9. Glass Card Spotlight Sheen (Cursor Microinteraction)
  // ==========================================
  const glassCards = document.querySelectorAll('.glass-card-sheen, .layer-card, .comp-card, .capability-card, .labs-item-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  // ==========================================
  // 10. Subtle Floating Microinteractions
  // ==========================================
  const parallaxFloating = document.querySelectorAll('.hero-badge-wrap .pill-badge');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < 900) {
          parallaxFloating.forEach((target) => {
            target.style.transform = `translateY(${scrolled * 0.04}px)`;
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ==========================================
  // 11. Smooth Page Transitions
  // ==========================================
  const internalPageLinks = document.querySelectorAll('a[href$=".html"]');
  internalPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      if (!targetUrl || targetUrl.startsWith('#') || link.target === '_blank' || e.metaKey || e.ctrlKey) {
        return;
      }

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      if (targetUrl === currentPath) return;

      e.preventDefault();
      document.body.classList.add('page-transitioning');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 220);
    });
  });

  // ==========================================
  // 12. Legal Documents Navigation & Sticky Floating Mobile TOC
  // ==========================================
  function initLegalNavigation() {
    const desktopTocAside = document.querySelector('.legal-toc-aside');
    const mobileTocCard = document.getElementById('legal-mobile-toc');
    if (!desktopTocAside && !mobileTocCard) return;

    const legalCards = Array.from(document.querySelectorAll('.legal-card[id]'));
    if (legalCards.length === 0) return;

    const desktopLinks = Array.from(document.querySelectorAll('.legal-toc-link'));
    const mobileTrigger = document.getElementById('mobile-toc-trigger');
    const mobileCurrentLabel = document.getElementById('mobile-toc-current-label');
    const mobileNextBtn = document.getElementById('mobile-toc-next-btn');
    const mobileLinks = Array.from(document.querySelectorAll('.mobile-toc-item-link'));

    let currentActiveIndex = 0;

    function scrollToSection(targetId) {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const isMobile = window.innerWidth <= 1024;
      const headerEl = document.querySelector('.site-header');
      const headerH = headerEl ? headerEl.offsetHeight : 64;
      const topNoticeBar = document.querySelector('.top-notice-bar');
      const noticeH = topNoticeBar ? topNoticeBar.offsetHeight : 0;
      const remainingNotice = Math.max(0, noticeH - window.scrollY);
      const mobileCardH = (mobileTocCard && isMobile) ? mobileTocCard.offsetHeight : 0;

      const offset = isMobile 
        ? (headerH + remainingNotice + mobileCardH + 16) 
        : (headerH + 28);

      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - offset);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    function setActiveSection(idx) {
      if (idx < 0 || idx >= legalCards.length) return;
      currentActiveIndex = idx;

      // Update Desktop Sidebar
      desktopLinks.forEach((link, i) => {
        if (i === idx) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update Mobile Elements
      mobileLinks.forEach((link, i) => {
        if (i === idx) {
          link.classList.add('is-active');
          const label = link.getAttribute('data-label') || link.querySelector('.item-text')?.textContent || '';
          if (mobileCurrentLabel && label) {
            mobileCurrentLabel.textContent = label;
          }
        } else {
          link.classList.remove('is-active');
        }
      });
    }

    // Desktop TOC Anchor Click
    desktopLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').replace('#', '');
        scrollToSection(targetId);
        setActiveSection(idx);
      });
    });

    // Mobile Menu Toggle
    function openMobileMenu() {
      if (!mobileTocCard) return;
      mobileTocCard.classList.add('is-open');
      if (mobileTrigger) mobileTrigger.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      if (!mobileTocCard) return;
      mobileTocCard.classList.remove('is-open');
      if (mobileTrigger) mobileTrigger.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileMenu() {
      if (!mobileTocCard) return;
      if (mobileTocCard.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    if (mobileTrigger) {
      mobileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });
    }

    // Mobile Next Button Click
    if (mobileNextBtn) {
      mobileNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentActiveIndex + 1) % legalCards.length;
        const targetCard = legalCards[nextIndex];
        if (targetCard) {
          scrollToSection(targetCard.id);
          setActiveSection(nextIndex);
        }
      });
    }

    // Mobile Dropdown Item Click
    mobileLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(link.getAttribute('data-index'), 10);
        const targetId = link.getAttribute('href').replace('#', '');

        closeMobileMenu();

        // If not already active, navigate and set active
        if (!link.classList.contains('is-active')) {
          scrollToSection(targetId);
          setActiveSection(idx);
        }
      });
    });

    // Close mobile dropdown when clicking header or outside
    const mobileHeader = mobileTocCard ? mobileTocCard.querySelector('.mobile-toc-header') : null;
    if (mobileHeader) {
      mobileHeader.addEventListener('click', (e) => {
        if (mobileTocCard && mobileTocCard.classList.contains('is-open')) {
          e.stopPropagation();
          closeMobileMenu();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (mobileTocCard && mobileTocCard.classList.contains('is-open')) {
        if (!mobileTocCard.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Real-Time ScrollSpy
    let scrollSpyTicking = false;
    function updateScrollSpy() {
      const isMobile = window.innerWidth <= 1024;
      const headerEl = document.querySelector('.site-header');
      const headerH = headerEl ? headerEl.offsetHeight : 64;
      const topNoticeBar = document.querySelector('.top-notice-bar');
      const noticeH = topNoticeBar ? topNoticeBar.offsetHeight : 0;
      const remainingNotice = Math.max(0, noticeH - window.scrollY);
      const mobileCardH = (mobileTocCard && isMobile) ? mobileTocCard.offsetHeight : 0;

      const probeY = window.scrollY + headerH + remainingNotice + mobileCardH + 100;

      let activeIdx = 0;
      for (let i = 0; i < legalCards.length; i++) {
        const card = legalCards[i];
        if (card.offsetTop <= probeY) {
          activeIdx = i;
        } else {
          break;
        }
      }

      if (activeIdx !== currentActiveIndex) {
        setActiveSection(activeIdx);
      }
    }

    window.addEventListener('scroll', () => {
      if (!scrollSpyTicking) {
        window.requestAnimationFrame(() => {
          updateScrollSpy();
          scrollSpyTicking = false;
        });
        scrollSpyTicking = true;
      }
    }, { passive: true });

    // Initial sync
    updateScrollSpy();
  }

  initLegalNavigation();

  // ==========================================
  // 12. Hero Conversational Question Cards & Responsive Trust Architecture
  //     - 10 Ecosystem Conversations (Client Inquiries & Execution Answers)
  //     - Desktop: 5 Cards (2 large left focus, 3 compact right), staggered ambient floating
  //     - Mobile: 1 Card below CTAs, 10-dot pagination + '10 / 10' counter
  //     - Staggered, layout-stable crossfade auto-rotation (never causes CLS or layout shift)
  //     - Touch swipe and dot navigation support with pause on hover/interaction
  // ==========================================
  function initHeroConversations() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const HERO_CONVERSATIONS = [
      {
        id: "01",
        num: "01",
        category: "Business Setup",
        question: "I want to start a business. Where do I begin?",
        answer: "From setup to launch, we help you build it step by step.",
        time: "9:40 AM",
        avatar: "assets/images/avatars/avatar_1.jpg",
        userAlt: "Founder starting a business"
      },
      {
        id: "02",
        num: "02",
        category: "Premium Website",
        question: "Who can build a premium website that actually feels like my brand?",
        answer: "We design and build premium digital experiences around your brand.",
        time: "9:42 AM",
        avatar: "assets/images/avatars/avatar_2.jpg",
        userAlt: "Brand Founder"
      },
      {
        id: "03",
        num: "03",
        category: "Branding + Growth",
        question: "Can someone handle my branding, marketing & growth together?",
        answer: "Yes. One ecosystem, one point of contact, built to grow with you.",
        time: "9:41 AM",
        avatar: "assets/images/avatars/avatar_4.jpg",
        userAlt: "Growth Lead"
      },
      {
        id: "04",
        num: "04",
        category: "Packaging & Printing",
        question: "Where can I get my packaging, labels & printing done reliably?",
        answer: "From packaging to print, we connect you with trusted execution partners.",
        time: "9:43 AM",
        avatar: "assets/images/avatars/avatar_3.jpg",
        userAlt: "Product Entrepreneur"
      },
      {
        id: "05",
        num: "05",
        category: "Legal & Compliance",
        question: "Who can help with company registration, legal & compliance?",
        answer: "We help coordinate the right professionals for your business requirements.",
        time: "9:44 AM",
        avatar: "assets/images/avatars/avatar_4.jpg",
        userAlt: "Business Owner"
      },
      {
        id: "06",
        num: "06",
        category: "Multiple Vendors",
        question: "Do I really need to manage ten different vendors?",
        answer: "No. Anant Nova brings your business needs together in one place.",
        time: "9:45 AM",
        avatar: "assets/images/avatars/avatar_5.jpg",
        userAlt: "Operations Lead"
      },
      {
        id: "07",
        num: "07",
        category: "Software & Apps",
        question: "Can you build the software or app my business actually needs?",
        answer: "From web apps to custom software, we build technology around your goals.",
        time: "9:46 AM",
        avatar: "assets/images/avatars/avatar_1.jpg",
        userAlt: "Tech Founder"
      },
      {
        id: "08",
        num: "08",
        category: "AI & Automation",
        question: "Where can I use AI and automation to make my business smarter?",
        answer: "We identify opportunities and build practical AI-powered workflows for your business.",
        time: "9:47 AM",
        avatar: "assets/images/avatars/avatar_3.jpg",
        userAlt: "Operations Director"
      },
      {
        id: "09",
        num: "09",
        category: "Marketing & Visibility",
        question: "How do I get my business seen by the right customers?",
        answer: "From marketing to SEO and AEO, we help your business get discovered and grow.",
        time: "9:48 AM",
        avatar: "assets/images/avatars/avatar_2.jpg",
        userAlt: "Marketing Director"
      },
      {
        id: "10",
        num: "10",
        category: "Main Hero Question",
        question: "Can one team handle everything I need to build my business?",
        answer: "That’s exactly what Anant Nova is built for.",
        time: "9:41 AM",
        avatar: "assets/images/avatars/avatar_1.jpg",
        userAlt: "Startup Founder"
      }
    ];

    // Helper: update card contents with smooth physical vertical 3D card flip
    function updateCardElements(cardEl, convo) {
      if (!cardEl || !convo) return;

      // Phase 1: Card rotates up & away around horizontal axis (-90deg)
      cardEl.classList.remove('is-flipping-in', 'is-flipping-prep');
      cardEl.classList.add('is-flipping-out');

      setTimeout(() => {
        // Swap content while completely edge-on / hidden
        const avatarImg = cardEl.querySelector('.convo-avatar-img');
        const questionText = cardEl.querySelector('.convo-question-text');
        const timeText = cardEl.querySelector('.convo-timestamp');
        const answerText = cardEl.querySelector('.convo-answer-text');

        if (avatarImg) {
          avatarImg.src = convo.avatar;
          avatarImg.alt = convo.userAlt;
        }
        if (questionText) questionText.textContent = convo.question;
        if (timeText) timeText.textContent = convo.time;
        if (answerText) answerText.textContent = convo.answer;

        // Phase 2: Instantly set preparation state at +90deg (without animation)
        cardEl.classList.remove('is-flipping-out');
        cardEl.classList.add('is-flipping-prep');

        // Force synchronous reflow to ensure the prep state is rendered
        void cardEl.offsetWidth;

        // Phase 3: Smoothly rotate down into resting 0deg position
        requestAnimationFrame(() => {
          cardEl.classList.remove('is-flipping-prep');
          cardEl.classList.add('is-flipping-in');

          setTimeout(() => {
            cardEl.classList.remove('is-flipping-in');
          }, 450);
        });
      }, 340);
    }

    // --- Desktop Rotation Setup ---
    const desktopCards = [
      document.getElementById('desktop-convo-0'),
      document.getElementById('desktop-convo-1'),
      document.getElementById('desktop-convo-2'),
      document.getElementById('desktop-convo-3'),
      document.getElementById('desktop-convo-4')
    ];

    // Check if desktop cards exist in DOM
    if (desktopCards[0]) {
      // Slot 0 starts with #10 (idx 9), Slot 1 with #02 (idx 1), Slot 2 with #04 (idx 3), etc.
      const desktopSlotIndices = [9, 1, 3, 4, 5];
      const secondarySlotsToRotate = [2, 3, 4, 1, 0];
      const rotationPool = [0, 2, 6, 7, 8, 9, 1, 3, 4, 5];
      let poolPointer = 0;
      let desktopSlotPointer = 0;
      let isDesktopHovered = false;

      const desktopCardsLeft = document.querySelector('.hero-floating-cards-left');
      const desktopCardsRight = document.querySelector('.hero-floating-cards-right');

      [desktopCardsLeft, desktopCardsRight].forEach(col => {
        if (!col) return;
        col.addEventListener('mouseenter', () => { isDesktopHovered = true; });
        col.addEventListener('mouseleave', () => { isDesktopHovered = false; });
      });

      function rotateDesktopSlot() {
        if (isDesktopHovered) return;
        if (window.innerWidth <= 1024) return;

        const targetSlot = secondarySlotsToRotate[desktopSlotPointer];
        const targetCard = desktopCards[targetSlot];
        if (!targetCard) return;

        let attempts = 0;
        let nextIndex = rotationPool[poolPointer];
        while (desktopSlotIndices.includes(nextIndex) && attempts < rotationPool.length) {
          poolPointer = (poolPointer + 1) % rotationPool.length;
          nextIndex = rotationPool[poolPointer];
          attempts++;
        }

        poolPointer = (poolPointer + 1) % rotationPool.length;
        desktopSlotIndices[targetSlot] = nextIndex;

        updateCardElements(targetCard, HERO_CONVERSATIONS[nextIndex]);
        desktopSlotPointer = (desktopSlotPointer + 1) % secondarySlotsToRotate.length;
      }

      setInterval(rotateDesktopSlot, 5600);
    }

    // --- Restrained Desktop Mouse Parallax Controller ---
    const heroStage = document.querySelector('.hero-stage');

    if (heroSection && heroStage && window.matchMedia('(min-width: 1025px)').matches) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isMouseInside = false;
      let parallaxRafId = null;

      function updateParallax() {
        // Smooth linear interpolation (lerp)
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Apply restrained CSS properties to the stage:
        // translateX ±6px, translateY ±4px, rotateX ±1deg, rotateY ±1deg
        const px = (currentX * 12).toFixed(2);
        const py = (currentY * 8).toFixed(2);
        const rotX = (-currentY * 1.8).toFixed(2);
        const rotY = (currentX * 2.0).toFixed(2);

        heroStage.style.setProperty('--parallax-x', `${px}px`);
        heroStage.style.setProperty('--parallax-y', `${py}px`);
        heroStage.style.setProperty('--parallax-rot-x', `${rotX}deg`);
        heroStage.style.setProperty('--parallax-rot-y', `${rotY}deg`);

        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001 || isMouseInside) {
          parallaxRafId = requestAnimationFrame(updateParallax);
        } else {
          parallaxRafId = null;
        }
      }

      function startParallaxLoop() {
        if (!parallaxRafId) {
          parallaxRafId = requestAnimationFrame(updateParallax);
        }
      }

      heroSection.addEventListener('mousemove', (e) => {
        isMouseInside = true;
        const rect = heroSection.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) - 0.5;
        targetY = ((e.clientY - rect.top) / rect.height) - 0.5;
        startParallaxLoop();
      }, { passive: true });

      heroSection.addEventListener('mouseleave', () => {
        isMouseInside = false;
        targetX = 0;
        targetY = 0;
        startParallaxLoop();
      }, { passive: true });
    }

    // --- Mobile Rotation & Pagination Setup ---
    const mobileCard = document.getElementById('mobile-hero-convo-card');
    const mobileDotsContainer = document.getElementById('mobile-convo-dots');
    const mobileCounter = document.getElementById('mobile-convo-counter');
    let currentMobileIndex = 9; // Starts with #10
    let isMobileInteracting = false;
    let mobileTimer = null;

    function renderMobilePagination() {
      if (!mobileDotsContainer) return;
      mobileDotsContainer.innerHTML = '';
      for (let i = 0; i < HERO_CONVERSATIONS.length; i++) {
        const dot = document.createElement('button');
        dot.className = `mobile-convo-dot ${i === currentMobileIndex ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', `Conversation ${HERO_CONVERSATIONS[i].num}`);
        dot.addEventListener('click', () => {
          goToMobileConversation(i);
        });
        mobileDotsContainer.appendChild(dot);
      }
    }

    function updateMobilePagination() {
      if (mobileDotsContainer) {
        const dots = mobileDotsContainer.querySelectorAll('.mobile-convo-dot');
        dots.forEach((dot, idx) => {
          if (idx === currentMobileIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      if (mobileCounter) {
        mobileCounter.textContent = `${HERO_CONVERSATIONS[currentMobileIndex].num} / 10`;
      }
    }

    function goToMobileConversation(index) {
      if (index === currentMobileIndex) return;
      currentMobileIndex = index;
      updateCardElements(mobileCard, HERO_CONVERSATIONS[currentMobileIndex]);
      updateMobilePagination();
      resetMobileTimer();
    }

    function rotateMobileNext() {
      if (isMobileInteracting) return;
      if (window.innerWidth > 1024) return;
      currentMobileIndex = (currentMobileIndex + 1) % HERO_CONVERSATIONS.length;
      updateCardElements(mobileCard, HERO_CONVERSATIONS[currentMobileIndex]);
      updateMobilePagination();
    }

    function resetMobileTimer() {
      if (mobileTimer) clearInterval(mobileTimer);
      mobileTimer = setInterval(rotateMobileNext, 5600);
    }

    // Touch swipe support on mobile card
    if (mobileCard) {
      let touchStartX = 0;
      let touchEndX = 0;

      mobileCard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isMobileInteracting = true;
      }, { passive: true });

      mobileCard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(() => { isMobileInteracting = false; }, 2000);
      }, { passive: true });

      mobileCard.addEventListener('mouseenter', () => { isMobileInteracting = true; });
      mobileCard.addEventListener('mouseleave', () => { isMobileInteracting = false; });

      function handleSwipe() {
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            goToMobileConversation((currentMobileIndex + 1) % HERO_CONVERSATIONS.length);
          } else {
            goToMobileConversation((currentMobileIndex - 1 + HERO_CONVERSATIONS.length) % HERO_CONVERSATIONS.length);
          }
        }
      }
    }

    renderMobilePagination();
    updateMobilePagination();
    resetMobileTimer();
  }

  initHeroConversations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
