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
        if (hasHero) {
          header.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Pages without a full-screen hero always show the solid header
  var hasHero = !!document.querySelector('.hero');
  if (!hasHero) {
    header.classList.add('scrolled');
  } else {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }

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
      form_ask: 'Ask A Question',
      form_learn_more: 'Learn More',

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

      // Nav
      nav_about: 'About Us',

      // Contact page
      contact_hero_title: 'Ask A Question',
      contact_hero_subtitle: 'Curious if VR Adventures is right for you? Send us a message.',
      contact_text: 'Fill in the form and we\u2019ll get back to you as soon as possible.',
      contact_message_label: 'Your question',
      contact_message_placeholder: 'How can we help you?',
      contact_submit: 'Send',

      // About page
      about_hero_title: 'Who We Are',
      about_hero_subtitle: 'The people behind the headsets.',
      about_story_title: 'VR That Comes To You',
      about_story_text1: 'VR Adventures makes free-roam virtual reality accessible to everyone. No fixed location, no expensive trips to a faraway VR centre. We come to you, build the arena, and let your guests experience something they\u2019ve never seen before.',
      about_story_text2: 'Whether it\u2019s a corporate outing, a birthday party, a festival, or a school event: we deliver a complete VR experience at your location. All you need is a flat space and a power outlet. We handle the rest.',
      about_mission_title: 'What Drives Us',
      about_value1_title: 'Connecting People',
      about_value1_text: 'VR is at its best when you do it together. We believe in experiences that bring people together, not isolate them.',
      about_value2_title: 'Zero Hassle',
      about_value2_text: 'We take care of everything. From setup to guidance. All you need to do is enjoy.',
      about_value3_title: 'Unforgettable',
      about_value3_text: 'We aim for wow moments. Every session should create a memory your guests will talk about for weeks.',
      about_prismatic_title: 'Part of Prismatic Immersive',
      about_prismatic_text1: 'VR Adventures is a brand of <a href="https://prismatic-immersive.com" target="_blank" rel="noopener" class="about-link">Prismatic Immersive</a>, a company specialised in immersive technology. From VR entertainment to serious VR applications and custom hardware: we know the tech inside and out.',
      about_prismatic_text2: 'We leverage that expertise to make your event run flawlessly. Our team knows exactly how the technology works, so your guests don\u2019t have to worry about a thing.',

      // FAQ
      faq_nav: 'FAQ',
      faq_title: 'Frequently Asked Questions',
      faq_q1: 'What is the minimum age to participate?',
      faq_a1: 'Players must be at least 13 years old to participate. Younger children can watch along on the live screen.',
      faq_q2: 'How many players can play at the same time?',
      faq_a2: 'Up to 6 players can play simultaneously in the arena per round. With 2 arenas, that\u2019s 12 players at once.',
      faq_q3: 'How much space do you need?',
      faq_a3: 'We need a flat space of at least 10 by 10 meters per arena. This can be indoors or outdoors.',
      faq_q4: 'Can it be set up outdoors?',
      faq_a4: 'Yes, as long as the surface is flat and it\u2019s not raining. We recommend having a canopy or tent available as a backup in case of unpredictable weather.',
      faq_q5: 'Do I need VR experience?',
      faq_a5: 'Not at all. Every group gets a short briefing before their session. The controls are very intuitive and our team is always there to help.',
      faq_q6: 'How long does a session last?',
      faq_a6: 'That depends on the chosen session type: 15 minutes (convention), 20 minutes (standard), or 30 minutes (immersive). The standard 20-minute session is the most popular.',
      faq_q7: 'Can someone get motion sick from VR?',
      faq_a7: 'That rarely happens. Because our VR is free-roam, you physically walk around the space. This significantly reduces the risk of motion sickness compared to seated VR experiences.',
      faq_q8: 'What do we need to provide for the setup?',
      faq_a8: 'Just a flat space of 10x10 meters and access to one power circuit. We bring all the equipment and handle the rest.',
      faq_q9: 'How does the travel surcharge work?',
      faq_a9: 'We charge a surcharge of \u20ac0.40 per kilometer from our location in Groningen. This is communicated upfront in the quote, so no surprises.',
      faq_q10: 'Can children watch if they\u2019re too young to play?',
      faq_a10: 'Absolutely! We have a live screen where everyone can watch what the players see in VR. It\u2019s often just as entertaining as playing yourself.',
      faq_q11: 'Is it suitable for team building?',
      faq_a11: 'Definitely! Our co-op mode is perfect for team building. Teams have to work together to survive, creating a unique way to strengthen bonds. The competitive mode is also popular for friendly rivalry.',
      faq_q12: 'Can I cancel or reschedule?',
      faq_a12: 'Yes, you can cancel or reschedule free of charge up to 14 days before the event. Just get in touch and we\u2019ll find a solution together.',

      // Gallery
      nav_gallery: 'Gallery',
      gallery_hero_title: 'Gallery',
      gallery_hero_subtitle: 'See our VR experiences in action.',
      gallery_game_title: 'In-Game Screenshots',
      gallery_game_subtitle: 'This is what your guests see in VR.',
      gallery_real_title: 'Our Events',
      gallery_real_subtitle: 'Real photos from our on-location VR sessions.',
      gallery_cta_title: 'Want To Experience It?',
      gallery_cta_subtitle: 'Book VR Adventures for your event and see it for yourself.',

      // Slideshow
      slideshow_title: 'See It In Action',
      slideshow_subtitle: 'From in-game action to real events on location.',
      slideshow_more: 'View All Photos',

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
      form_ask: 'Stel Een Vraag',
      form_learn_more: 'Meer Weten',
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

      // Nav
      nav_about: 'Over Ons',

      // Contact page
      contact_hero_title: 'Stel Een Vraag',
      contact_hero_subtitle: 'Benieuwd of VR Adventures iets voor jou is? Stuur ons een bericht.',
      contact_text: 'Vul het formulier in en wij reageren zo snel mogelijk.',
      contact_message_label: 'Je vraag',
      contact_message_placeholder: 'Waar kunnen we je mee helpen?',
      contact_submit: 'Verstuur',

      // About page
      about_hero_title: 'Wie Wij Zijn',
      about_hero_subtitle: 'De mensen achter de headsets.',
      about_story_title: 'VR Die Naar Jou Toekomt',
      about_story_text1: 'VR Adventures maakt free-roam virtual reality toegankelijk voor iedereen. Geen vaste locatie, geen dure uitstapjes naar een ver weg gelegen VR centrum. Wij komen naar jou toe, bouwen de arena op en laten jouw gasten iets beleven wat ze nog nooit eerder hebben meegemaakt.',
      about_story_text2: 'Of het nu een bedrijfsuitje is, een verjaardagsfeest, een festival of een schoolevenement: wij leveren een complete VR ervaring op jouw locatie. Alles wat je nodig hebt is een vlakke ruimte en een stopcontact. Wij regelen de rest.',
      about_mission_title: 'Wat Ons Drijft',
      about_value1_title: 'Mensen Verbinden',
      about_value1_text: 'VR is op zijn best als je het samen doet. Wij geloven in ervaringen die mensen bij elkaar brengen, niet isoleren.',
      about_value2_title: 'Geen Gedoe',
      about_value2_text: 'Wij nemen alles uit handen. Van opbouw tot begeleiding. Jij hoeft je alleen maar bezig te houden met genieten.',
      about_value3_title: 'Onvergetelijk',
      about_value3_text: 'We streven naar wow-momenten. Elke sessie moet een herinnering opleveren waar je gasten nog weken over praten.',
      about_prismatic_title: 'Onderdeel van Prismatic Immersive',
      about_prismatic_text1: 'VR Adventures is een merk van <a href="https://prismatic-immersive.com" target="_blank" rel="noopener" class="about-link">Prismatic Immersive</a>, een bedrijf dat gespecialiseerd is in immersive technologie. Van VR entertainment tot serious VR toepassingen en custom hardware: wij kennen de techniek van binnen en van buiten.',
      about_prismatic_text2: 'Die expertise zetten we in om jouw event vlekkeloos te laten verlopen. Ons team weet precies hoe de techniek werkt, zodat jouw gasten zich nergens zorgen over hoeven te maken.',

      // FAQ
      faq_nav: 'FAQ',
      faq_title: 'Veelgestelde Vragen',
      faq_q1: 'Wat is de minimumleeftijd om mee te doen?',
      faq_a1: 'Spelers moeten minimaal 13 jaar oud zijn om mee te doen. Jongere kinderen kunnen wel meekijken via het live scherm.',
      faq_q2: 'Hoeveel spelers kunnen er tegelijk spelen?',
      faq_a2: 'Er kunnen maximaal 6 spelers per ronde tegelijk in de arena spelen. Met 2 arena\u2019s zijn dat 12 spelers tegelijk.',
      faq_q3: 'Hoeveel ruimte hebben jullie nodig?',
      faq_a3: 'We hebben een vlakke ruimte van minimaal 10 bij 10 meter per arena nodig. Dit kan binnen of buiten zijn.',
      faq_q4: 'Kan het ook buiten?',
      faq_a4: 'Ja, zolang de ondergrond vlak is en het niet regent. We raden aan een overkapping of tent beschikbaar te hebben als back-up bij wisselvallig weer.',
      faq_q5: 'Heb ik ervaring met VR nodig?',
      faq_a5: 'Nee, helemaal niet. Elke groep krijgt een korte briefing voor hun sessie. De bediening is heel intuitief en ons team staat altijd klaar om te helpen.',
      faq_q6: 'Hoe lang duurt een sessie?',
      faq_a6: 'Dat hangt af van het gekozen sessietype: 15 minuten (beurs), 20 minuten (standaard) of 30 minuten (uitgebreid). De standaard sessie van 20 minuten is het populairst.',
      faq_q7: 'Kan iemand misselijk worden van VR?',
      faq_a7: 'Dat komt zelden voor. Omdat onze VR free-roam is, loop je echt fysiek rond in de ruimte. Dit vermindert het risico op misselijkheid aanzienlijk ten opzichte van zittende VR ervaringen.',
      faq_q8: 'Wat hebben wij zelf nodig voor de setup?',
      faq_a8: 'Alleen een vlakke ruimte van 10x10 meter en toegang tot \u00e9\u00e9n stroomgroep. Wij brengen alle apparatuur mee en regelen de rest.',
      faq_q9: 'Hoe werkt de reistoeslag?',
      faq_a9: 'We rekenen een toeslag van \u20ac0,40 per kilometer vanaf onze locatie in Groningen. Dit wordt vooraf medegedeeld in de offerte, dus geen verrassingen.',
      faq_q10: 'Kunnen kinderen meekijken als ze te jong zijn om te spelen?',
      faq_a10: 'Absoluut! We hebben een live scherm waarop iedereen kan meekijken wat de spelers in VR zien. Dat is vaak net zo vermakelijk als zelf spelen.',
      faq_q11: 'Is het geschikt voor teambuilding?',
      faq_a11: 'Zeker! Onze co-op modus is perfect voor teambuilding. Teams moeten samenwerken om te overleven, wat zorgt voor een unieke manier om banden te versterken. De competitieve modus is ook populair voor een gezonde onderlinge strijd.',
      faq_q12: 'Kan ik annuleren of wijzigen?',
      faq_a12: 'Ja, je kunt kosteloos annuleren of wijzigen tot 14 dagen voor het event. Neem gewoon contact met ons op en we zoeken samen naar een oplossing.',

      // Gallery
      nav_gallery: 'Galerij',
      gallery_hero_title: 'Galerij',
      gallery_hero_subtitle: 'Bekijk onze VR ervaringen in actie.',
      gallery_game_title: 'In-Game Screenshots',
      gallery_game_subtitle: 'Dit is wat je gasten zien in VR.',
      gallery_real_title: 'Onze Events',
      gallery_real_subtitle: 'Echte foto\u2019s van onze VR sessies op locatie.',
      gallery_cta_title: 'Zelf Ervaren?',
      gallery_cta_subtitle: 'Boek VR Adventures voor jouw event en maak het zelf mee.',

      // Slideshow
      slideshow_title: 'Bekijk Het In Actie',
      slideshow_subtitle: 'Van in-game actie tot echte events op locatie.',
      slideshow_more: 'Bekijk Alle Foto\u2019s',

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

    var placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (strings[key] !== undefined) {
        el.placeholder = strings[key];
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

  // ── 8. Contact form (mailto) ─────────────────────────────
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = contactForm.email.value;
      var message = contactForm.message.value;
      var subject = encodeURIComponent('Vraag van ' + email + ' via VR Adventures');
      var body = encodeURIComponent('Van: ' + email + '\n\n' + message);
      window.location.href = 'mailto:hello@prismatic-immersive.com?subject=' + subject + '&body=' + body;
    });
  }

  // ── 9. FAQ accordion ────────────────────────────────────
  var faqButtons = document.querySelectorAll('.faq__question');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        answer.setAttribute('hidden', '');
      } else {
        answer.removeAttribute('hidden');
      }
    });
  });

  // ── 9. Capacity calculator ──────────────────────────────
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

  // ── 10. Homepage slideshow ─────────────────────────────
  var slideshowEl = document.getElementById('homepage-slideshow');
  if (slideshowEl && !prefersReducedMotion) {
    var slides = slideshowEl.querySelectorAll('.slideshow__slide');
    var dotsContainer = slideshowEl.querySelector('.slideshow__dots');
    var slideIdx = 0;

    // Create dots
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Foto ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.slideshow__dot');

    function goToSlide(idx) {
      slides[slideIdx].classList.remove('active');
      dots[slideIdx].classList.remove('active');
      slideIdx = idx;
      slides[slideIdx].classList.add('active');
      dots[slideIdx].classList.add('active');
    }

    setInterval(function () {
      goToSlide((slideIdx + 1) % slides.length);
    }, 4000);
  }

  // ── 11. Gallery lightbox ────────────────────────────────
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var galleryItems = document.querySelectorAll('.gallery__item');
    var lbIdx = 0;

    function openLightbox(idx) {
      lbIdx = idx;
      var item = galleryItems[lbIdx];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img').alt;
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', function () {
      openLightbox((lbIdx - 1 + galleryItems.length) % galleryItems.length);
    });

    lightboxNext.addEventListener('click', function () {
      openLightbox((lbIdx + 1) % galleryItems.length);
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }
})();
