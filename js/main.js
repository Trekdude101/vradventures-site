/**
 * VR Adventures - Main JavaScript
 * Mobile nav, scroll effects, reveal animations, hero slideshow, language toggle
 */
(function () {
  'use strict';

  // ── DOM references ──────────────────────────────────────
  var header    = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu   = document.getElementById('nav-menu');
  var navLinks  = document.querySelectorAll('.nav__link');
  var sections  = document.querySelectorAll('section[id]');
  var reveals   = document.querySelectorAll('.reveal');
  var langBtn   = document.getElementById('lang-toggle');

  // ── 1. Mobile nav toggle ────────────────────────────────
  function toggleNav() {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', toggleNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleNav();
      navToggle.focus();
    }
  });

  // ── 2. Nav background on scroll ─────────────────────────
  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  header.classList.toggle('scrolled', window.scrollY > 50);

  // ── 3. Scroll reveal animations ─────────────────────────
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ── 4. Card image galleries ──────────────────────────────
  var galleries = document.querySelectorAll('.card__gallery');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    galleries.forEach(function (gallery) {
      var images = gallery.querySelectorAll('.card__image');
      if (images.length <= 1) return;
      var idx = 0;
      setInterval(function () {
        images[idx].classList.remove('active');
        idx = (idx + 1) % images.length;
        images[idx].classList.add('active');
      }, 3000);
    });
  }

  // ── 5. Active nav link based on scroll position ──────────
  function updateActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      var top    = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      var id     = section.getAttribute('id');

      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
        }
      });
    });
  }

  updateActiveLink();

  // ── 6. Booking form submission ───────────────────────────
  var form = document.getElementById('booking-form');
  var formStatus = document.getElementById('form-status');

  // Replace this URL with your deployed Google Apps Script web app URL
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQuyzXSjLeUKthsWXlw6IHH3Lels2dojfO9IqpvqAooLqrABC430JlkUpzu443hpxp/exec';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.form__submit');
      submitBtn.disabled = true;
      formStatus.textContent = '';
      formStatus.className = 'form__status';

      var data = {
        date: form.date.value,
        arenas: form.arenas.value,
        package: form.package.value,
        session_type: form.session_type.value,
        event_type: form.event_type.value,
        email: form.email.value
      };

      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function () {
        formStatus.textContent = currentLang === 'nl'
          ? 'Verstuurd! We nemen binnen 24 uur contact op.'
          : 'Sent! We\u2019ll be in touch within 24 hours.';
        formStatus.classList.add('form__status--success');
        form.reset();
      })
      .catch(function () {
        formStatus.textContent = currentLang === 'nl'
          ? 'Er ging iets mis. Probeer het opnieuw.'
          : 'Something went wrong. Please try again.';
        formStatus.classList.add('form__status--error');
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
    });
  }

  // ── 7. Language toggle (NL ↔ EN) ────────────────────────
  var translations = {
    en: {
      // Nav
      nav_how: 'How It Works',
      nav_experiences: 'Experiences',
      nav_usecases: 'Occasions',
      nav_contact: 'Contact',
      skip: 'Skip to main content',

      // Hero
      hero_title: 'We Bring VR<br>To Your Event',
      hero_subtitle: 'No venue needed. No hassle. We deliver a complete free-roam VR experience. Anywhere in the Netherlands.',
      hero_cta1: 'Book Your Event',
      hero_cta2: 'How Does It Work?',

      // Steps
      steps_title: 'Three Steps. Zero Hassle.',
      step1_title: 'Pick Your Date',
      step1_text: 'Tell us when, where, and how many guests. We handle the rest.',
      step2_title: 'We Set Up',
      step2_text: 'Our crew arrives, builds the arena, and gets everything running. At your location.',
      step3_title: 'Play Together',
      step3_text: 'Your guests jump into multiplayer VR worlds. 6 players per round, unlimited fun.',
      steps_more: 'Want To Know More?',

      // Experiences
      exp_title: 'Choose Your Adventure',
      exp_subtitle: 'Large play areas. Multiple game worlds. All unforgettable.',
      card1_title: 'Play Together',
      card1_text: 'Work together as a team in thrilling VR worlds. Survive together, protect each other, and build trust. The ultimate team building.',
      card2_title: 'Challenge Each Other',
      card2_text: 'Challenge your friends or colleagues in an epic showdown. Who\u2019s the best? Competitive, exciting, and unforgettable.',
      tag_coop: 'Co-op',
      tag_teambuilding: 'Team Building',
      tag_together: 'Together',
      tag_competitive: 'Competitive',
      tag_pvp: 'Team vs Team',
      tag_challenge: 'Challenge',

      // Use Cases
      uc_title: 'Perfect For Any Occasion',
      uc1_title: 'Corporate Team Building',
      uc1_text: 'Break the ice and build bonds in virtual worlds your team won\u2019t stop talking about.',
      uc2_title: 'Birthday Parties',
      uc2_text: 'Give the birthday star and their friends an experience they\u2019ve never had before.',
      uc3_title: 'Festivals & Fairs',
      uc3_text: 'Draw crowds with a VR attraction. We\u2019ve run events for 40+ participants at a time.',
      uc4_title: 'Schools & Youth',
      uc4_text: 'Educational, exciting, and safe. Perfect for school trips, scouting events, and more.',

      // Booking form
      book_title: 'Ready To Book?',
      book_text: 'Fill in the form and we\u2019ll send you a custom quote within 24\u00a0hours.',
      form_date: 'Preferred date',
      form_arenas: 'Number of arenas',
      form_arenas_1: '1 arena',
      form_arenas_2: '2 arenas',
      form_package: 'Package',
      form_package_half: 'Half day (4 hours)',
      form_package_full: 'Full day (8 hours)',
      form_session: 'Session type',
      form_session_convention: 'Convention (15 min)',
      form_session_standard: 'Standard (20 min)',
      form_session_immersive: 'Immersive (30 min)',
      form_placeholder: 'Select...',
      form_type: 'Type of event',
      form_type_placeholder: 'Select...',
      form_type_business: 'Business event',
      form_type_friends: 'Friends and/or family',
      form_type_other: 'Other',
      form_email: 'Email address',
      form_submit: 'Request A Quote',

      // Nav (shared)
      nav_detail: 'More Info',

      // Detail page
      detail_hero_title: 'How We Bring VR To You',
      detail_hero_subtitle: 'Everything you need to know about our setup, sessions, and pricing.',
      detail_equipment_title: 'What We Bring',
      detail_equipment_subtitle: 'We bring the complete experience. You just provide the space.',
      detail_equipment_headsets: 'VR Headsets',
      detail_equipment_headsets_text: 'Wireless headsets for full freedom of movement. No cables, no limits.',
      detail_equipment_controllers: 'Gun Controllers',
      detail_equipment_controllers_text: 'Realistic controllers that put you right in the action.',
      detail_equipment_pcs: 'Computers',
      detail_equipment_pcs_text: 'All processing power is brought by us and placed out of sight.',
      detail_setup_title: 'Setup & Crew',
      detail_setup_subtitle: 'Our team handles everything so you can focus on your event.',
      detail_setup_crew: 'Professional Crew',
      detail_setup_crew_text: 'A team of two arrives at your location and takes care of everything from start to finish.',
      detail_setup_build: 'Setup Time',
      detail_setup_build_text: 'We build the arena in approximately 45 minutes. Teardown takes roughly the same.',
      detail_setup_power: 'Power',
      detail_setup_power_text: 'A single power circuit is all we need for the entire setup.',
      detail_sessions_title: 'How Sessions Work',
      detail_sessions_subtitle: 'Simple rotation. Maximum fun.',
      detail_sessions_step1_title: 'Choose Your Game',
      detail_sessions_step1_text: 'Every group picks their mode: co-op (PVE) or competitive (PVP).',
      detail_sessions_step2_title: 'Briefing',
      detail_sessions_step2_text: 'Each group gets a short introduction before their session.',
      detail_sessions_step3_title: 'Play!',
      detail_sessions_step3_text: 'Groups of up to 6 players play in 20-minute timeslots.',
      detail_sessions_step4_title: 'Next Group',
      detail_sessions_step4_text: 'Minimal downtime between groups. The next team jumps right in.',
      detail_space_title: 'Space & Requirements',
      detail_space_arena: 'Play Area',
      detail_space_arena_text: 'We need a flat space of 10 by 10 meters per arena.',
      detail_space_arenas: 'Up To Two Arenas',
      detail_space_arenas_text: 'We can set up a maximum of two arenas at a single event.',
      detail_space_age: 'Age 13+',
      detail_space_age_text: 'Players must be 13 years or older to participate.',
      detail_pricing_title: 'Pricing',
      detail_pricing_subtitle: 'Transparent pricing. No hidden costs.',
      detail_pricing_half_title: 'Half Day',
      detail_pricing_half_duration: '4 hours',
      detail_pricing_half_price: '€500',
      detail_pricing_half_unit: 'per arena',
      detail_pricing_full_title: 'Full Day',
      detail_pricing_full_duration: '8 hours',
      detail_pricing_full_price: '€1,000',
      detail_pricing_full_unit: 'per arena',
      detail_pricing_travel: 'Netherlands-wide service. Travel surcharge: €0.40 per km.',
      detail_cta_title: 'Ready To Book?',
      detail_cta_text: 'Get in touch and we\u2019ll send you a custom quote within 24 hours.',
      detail_cta_button: 'Request A Quote',

      // Calculator
      calc_title: 'Capacity Calculator',
      calc_subtitle: 'Calculate how many guests your event can accommodate.',
      calc_arenas: 'Arenas',
      calc_package: 'Package',
      calc_half_day: 'Half Day',
      calc_full_day: 'Full Day',
      calc_session_type: 'Session Type',
      calc_convention: 'Convention (15 min)',
      calc_standard: 'Standard (20 min)',
      calc_immersive: 'Immersive (30 min)',
      calc_per_hour: 'guests per hour',
      calc_total: 'guests total',

      // Footer
      footer_rights: 'All rights reserved.'
    },
    nl: {
      nav_how: 'Hoe Werkt Het',
      nav_experiences: 'Ervaringen',
      nav_usecases: 'Gelegenheden',
      nav_contact: 'Contact',
      skip: 'Ga naar inhoud',
      hero_title: 'Wij Brengen VR<br>Naar Jouw Event',
      hero_subtitle: 'Geen locatie nodig. Geen gedoe. Wij leveren een complete free-roam VR ervaring. Overal in Nederland.',
      hero_cta1: 'Boek Jouw Event',
      hero_cta2: 'Hoe Werkt Het?',
      steps_title: 'Drie Stappen. Nul Gedoe.',
      step1_title: 'Kies Je Datum',
      step1_text: 'Vertel ons wanneer, waar en met hoeveel gasten. Wij regelen de rest.',
      step2_title: 'Wij Bouwen Op',
      step2_text: 'Ons team komt langs, bouwt de arena op en maakt alles speelklaar. Op jouw locatie.',
      step3_title: 'Speel Samen',
      step3_text: 'Jouw gasten duiken in multiplayer VR werelden. 6 spelers per ronde, oneindig veel plezier.',
      steps_more: 'Meer Weten?',
      exp_title: 'Kies Je Avontuur',
      exp_subtitle: 'Grote speelruimtes. Meerdere gamewerelden. Allemaal onvergetelijk.',
      card1_title: 'Samen Spelen',
      card1_text: 'Werk samen als team in spannende VR werelden. Overleef samen, bescherm elkaar en bouw aan vertrouwen. De ultieme teambuilding.',
      card2_title: 'Tegen Elkaar',
      card2_text: 'Daag je vrienden of collega\u2019s uit in een episch gevecht. Wie is de beste? Competitief, spannend en onvergetelijk.',
      tag_coop: 'Co-op',
      tag_teambuilding: 'Teambuilding',
      tag_together: 'Samen',
      tag_competitive: 'Competitief',
      tag_pvp: 'Team vs Team',
      tag_challenge: 'Uitdaging',
      uc_title: 'Perfect Voor Elke Gelegenheid',
      uc1_title: 'Bedrijfsuitjes & Teambuilding',
      uc1_text: 'Doorbreek het ijs en bouw banden op in virtuele werelden waar je team nog weken over praat.',
      uc2_title: 'Verjaardagen & Feesten',
      uc2_text: 'Geef de jarige en vrienden een ervaring die ze nog nooit eerder hebben gehad.',
      uc3_title: 'Festivals & Beurzen',
      uc3_text: 'Trek publiek met een VR attractie. Wij hebben ervaring met events voor 40+ deelnemers tegelijk.',
      uc4_title: 'Scholen & Jeugd',
      uc4_text: 'Educatief, spannend en veilig. Perfect voor schooluitjes, scouting en meer.',
      book_title: 'Klaar Om Te Boeken?',
      book_text: 'Vul het formulier in en wij sturen je binnen 24\u00a0uur een offerte op maat.',
      form_date: 'Gewenste datum',
      form_arenas: 'Aantal arena\u2019s',
      form_arenas_1: '1 arena',
      form_arenas_2: '2 arena\u2019s',
      form_package: 'Pakket',
      form_package_half: 'Halve dag (4 uur)',
      form_package_full: 'Hele dag (8 uur)',
      form_session: 'Sessietype',
      form_session_convention: 'Beurs (15 min)',
      form_session_standard: 'Standaard (20 min)',
      form_session_immersive: 'Uitgebreid (30 min)',
      form_placeholder: 'Selecteer...',
      form_type: 'Type evenement',
      form_type_placeholder: 'Selecteer...',
      form_type_business: 'Bedrijfsevenement',
      form_type_friends: 'Vrienden en/of familie',
      form_type_other: 'Anders',
      form_email: 'E-mailadres',
      form_submit: 'Vraag Offerte Aan',
      // Nav (shared)
      nav_detail: 'Meer Info',

      // Detail page
      detail_hero_title: 'Hoe Wij VR Bij Jou Brengen',
      detail_hero_subtitle: 'Alles wat je moet weten over onze setup, sessies en prijzen.',
      detail_equipment_title: 'Wat Wij Meenemen',
      detail_equipment_subtitle: 'Wij brengen de complete ervaring. Jij zorgt alleen voor de ruimte.',
      detail_equipment_headsets: 'VR Headsets',
      detail_equipment_headsets_text: 'Draadloze headsets voor volledige bewegingsvrijheid. Geen kabels, geen beperkingen.',
      detail_equipment_controllers: 'Gun Controllers',
      detail_equipment_controllers_text: 'Realistische controllers die je midden in de actie plaatsen.',
      detail_equipment_pcs: 'Computers',
      detail_equipment_pcs_text: 'Alle rekenkracht wordt door ons meegebracht en uit het zicht geplaatst.',
      detail_setup_title: 'Opbouw & Crew',
      detail_setup_subtitle: 'Ons team regelt alles, zodat jij je kunt focussen op je event.',
      detail_setup_crew: 'Professioneel Team',
      detail_setup_crew_text: 'Een team van twee komt naar jouw locatie en regelt alles van begin tot eind.',
      detail_setup_build: 'Opbouwtijd',
      detail_setup_build_text: 'We bouwen de arena op in ongeveer 45 minuten. Afbreken duurt ongeveer even lang.',
      detail_setup_power: 'Stroom',
      detail_setup_power_text: 'Eén stroomgroep is alles wat we nodig hebben voor de volledige setup.',
      detail_sessions_title: 'Hoe Sessies Werken',
      detail_sessions_subtitle: 'Simpele rotatie. Maximaal plezier.',
      detail_sessions_step1_title: 'Kies Je Game',
      detail_sessions_step1_text: 'Elke groep kiest hun modus: samenwerken (PVE) of competitief (PVP).',
      detail_sessions_step2_title: 'Briefing',
      detail_sessions_step2_text: 'Elke groep krijgt een korte introductie voor hun sessie.',
      detail_sessions_step3_title: 'Spelen!',
      detail_sessions_step3_text: 'Groepen van maximaal 6 spelers spelen in tijdsloten van 20 minuten.',
      detail_sessions_step4_title: 'Volgende Groep',
      detail_sessions_step4_text: 'Minimale wachttijd tussen groepen. Het volgende team stapt direct in.',
      detail_space_title: 'Ruimte & Vereisten',
      detail_space_arena: 'Speelruimte',
      detail_space_arena_text: 'We hebben een vlakke ruimte van 10 bij 10 meter per arena nodig.',
      detail_space_arenas: 'Maximaal Twee Arena\u2019s',
      detail_space_arenas_text: 'We kunnen maximaal twee arena\u2019s opzetten bij één event.',
      detail_space_age: 'Leeftijd 13+',
      detail_space_age_text: 'Spelers moeten 13 jaar of ouder zijn om mee te doen.',
      detail_pricing_title: 'Prijzen',
      detail_pricing_subtitle: 'Transparante prijzen. Geen verborgen kosten.',
      detail_pricing_half_title: 'Halve Dag',
      detail_pricing_half_duration: '4 uur',
      detail_pricing_half_price: '€500',
      detail_pricing_half_unit: 'per arena',
      detail_pricing_full_title: 'Hele Dag',
      detail_pricing_full_duration: '8 uur',
      detail_pricing_full_price: '€1.000',
      detail_pricing_full_unit: 'per arena',
      detail_pricing_travel: 'Door heel Nederland. Reistoeslag: €0,40 per km.',
      detail_cta_title: 'Klaar Om Te Boeken?',
      detail_cta_text: 'Neem contact op en wij sturen je binnen 24 uur een offerte op maat.',
      detail_cta_button: 'Vraag Offerte Aan',

      // Calculator
      calc_title: 'Capaciteit Calculator',
      calc_subtitle: 'Bereken hoeveel gasten je kunt ontvangen.',
      calc_arenas: 'Arena\u2019s',
      calc_package: 'Pakket',
      calc_half_day: 'Halve Dag',
      calc_full_day: 'Hele Dag',
      calc_session_type: 'Sessietype',
      calc_convention: 'Beurs (15 min)',
      calc_standard: 'Standaard (20 min)',
      calc_immersive: 'Uitgebreid (30 min)',
      calc_per_hour: 'gasten per uur',
      calc_total: 'gasten totaal',

      footer_rights: 'Alle rechten voorbehouden.'
    }
  };

  var currentLang = 'nl';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    langBtn.textContent = lang === 'nl' ? 'EN' : 'NL';

    var strings = translations[lang];
    var els = document.querySelectorAll('[data-i18n]');
    els.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        el.innerHTML = strings[key];
      }
    });

    try { localStorage.setItem('vra-lang', lang); } catch (e) {}
  }

  langBtn.addEventListener('click', function () {
    setLanguage(currentLang === 'nl' ? 'en' : 'nl');
  });

  // Restore saved language preference
  try {
    var savedLang = localStorage.getItem('vra-lang');
    if (savedLang && savedLang !== currentLang) {
      setLanguage(savedLang);
    }
  } catch (e) {}

  // ── 8. Capacity calculator ──────────────────────────────
  var calcArenas  = document.getElementById('calc-arenas');
  var calcPackage = document.getElementById('calc-package');
  var calcSession = document.getElementById('calc-session');

  if (calcArenas) {
    var PLAYERS_PER_SESSION = 6;
    var calcState = { arenas: 1, hours: 4, sessionMin: 20 };

    function updateCalc() {
      var groupsPerHour = 60 / calcState.sessionMin;
      var perHour = groupsPerHour * PLAYERS_PER_SESSION * calcState.arenas;
      var total   = perHour * calcState.hours;

      document.getElementById('calc-per-hour').textContent = perHour;
      document.getElementById('calc-total').textContent = total;
    }

    function bindToggle(container, stateKey) {
      var btns = container.querySelectorAll('.calc__btn');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          calcState[stateKey] = Number(btn.getAttribute('data-value'));
          updateCalc();
        });
      });
    }

    bindToggle(calcArenas, 'arenas');
    bindToggle(calcPackage, 'hours');
    bindToggle(calcSession, 'sessionMin');
  }
})();
