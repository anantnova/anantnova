/**
 * Anant Nova — Master Interactive Logic & Dynamic Components
 * Handles: Header Glass Shrink, Lifecycle Journey Stepper, Capabilities Filtering,
 * Interactive Scope & Roadmap Estimator, FAQ Accordion, and Strategy Inquiry Modal.
 */

(function () {
  'use strict';

  function initApp() {

  // ==========================================
  // 1. Sticky Glass Header Scroll Effect
  //    - Sticks across the page
  //    - Hides up smoothly when actively scrolling down
  //    - Re-emerges smoothly when scrolling stops or on scroll up
  //    - Condenses style when scrolled past announcement bar
  // ==========================================
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let lastScrollY = window.scrollY;
    let scrollStopTimer = null;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Condensed floating capsule style once scrolled past notice bar
      if (currentScrollY > 35) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }

      // Hide navbar when actively scrolling down past initial threshold
      if (delta > 6 && currentScrollY > 80) {
        siteHeader.classList.add('nav-hidden');
      } else if (delta < 0 || currentScrollY <= 40) {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
