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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('.form__submit');
    submitBtn.disabled = true;
    formStatus.textContent = '';
    formStatus.className = 'form__status';

    var data = {
      date: form.date.value,
      guests: form.guests.value,
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
      step3_text: 'Your guests jump into multiplayer VR worlds. 6\u20138 players per round, unlimited fun.',

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
      form_guests: 'Number of people',
      form_guests_placeholder: 'Select...',
      form_guests_more: 'More than 32',
      form_type: 'Type of event',
      form_type_placeholder: 'Select...',
      form_type_business: 'Business event',
      form_type_friends: 'Friends and/or family',
      form_type_other: 'Other',
      form_email: 'Email address',
      form_submit: 'Request A Quote',

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
      step3_text: 'Jouw gasten duiken in multiplayer VR werelden. 6-8 spelers per ronde, oneindig veel plezier.',
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
      form_guests: 'Aantal personen',
      form_guests_placeholder: 'Selecteer...',
      form_guests_more: 'Meer dan 32',
      form_type: 'Type evenement',
      form_type_placeholder: 'Selecteer...',
      form_type_business: 'Bedrijfsevenement',
      form_type_friends: 'Vrienden en/of familie',
      form_type_other: 'Anders',
      form_email: 'E-mailadres',
      form_submit: 'Vraag Offerte Aan',
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
  }

  langBtn.addEventListener('click', function () {
    setLanguage(currentLang === 'nl' ? 'en' : 'nl');
  });
})();
