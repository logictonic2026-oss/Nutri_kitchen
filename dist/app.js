const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = '+';
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '+';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});

const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
const statusText = document.querySelector('#status-text');
const copyText = document.querySelector('#enquiry-copy');
let enquiry = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = key => String(data.get(key) || '').trim();
  enquiry = [
    'Hello Nutriserve team,', '',
    'I would like to discuss a catering plan for our workplace.', '',
    `Name: ${value('name')}`, `Company: ${value('company')}`,
    `Phone: ${value('phone')}`, `Email: ${value('email')}`,
    `Work location: ${value('location')}`,
    `Number of employees: ${value('employees') || 'To be discussed'}`,
    `Meals required: ${data.getAll('meals').join(', ') || 'To be discussed'}`,
    `Shift timings: ${value('shifts') || 'To be discussed'}`, '',
    `Additional requirements: ${value('message') || 'To be discussed'}`, '',
    'Please contact me to discuss suitable menu and service options.'
  ].join('\n');
  const subject = `Catering enquiry — ${value('company')}`;
  const mailto = `mailto:sale.nutriserve@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry)}`;
  status.hidden = false;
  copyText.value = enquiry;
  copyText.hidden = true;
  statusText.textContent = 'Your enquiry is ready. Send it from your email app to complete your enquiry. If the app does not open, copy the details below and email sale.nutriserve@gmail.com.';
  document.querySelector('#copy-enquiry').textContent = 'Copy enquiry details ↗';
  window.location.href = mailto;
});
document.querySelector('#copy-enquiry').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(enquiry);
    button.textContent = 'Details copied ✓';
  } catch {
    copyText.hidden = false;
    copyText.focus();
    copyText.select();
    statusText.textContent = 'Select and copy the enquiry below, then send it to sale.nutriserve@gmail.com.';
  }
});

// Meal browsing uses one coordinated photo atlas, so every choice is immediate.
const mealData = {
  breakfast: { name: 'Breakfast', eyebrow: 'Breakfast for your team', title: 'Start the shift.<br>Start it well.', description: 'Traditional South Indian breakfast and rice-based options for a nourishing start to the workday.', points: ['South Indian breakfast options', 'Rice-based menu choices', 'Planned around your first shift'], alt: 'Illustrative idli and vada breakfast with sambar and coconut chutney', number: '01' },
  lunch: { name: 'Lunch', eyebrow: 'Lunch for your workplace', title: 'A complete meal.<br>A well-earned break.', description: 'Satisfying South Indian meal combinations, planned around your team’s preferences and workplace requirements.', points: ['Complete meal combinations', 'South Indian menu choices', 'Planned around your workforce'], alt: 'Illustrative South Indian lunch thali with rice, vegetables and accompaniments', number: '02' },
  snacks: { name: 'Snacks', eyebrow: 'Snacks for team breaks', title: 'A small pause.<br>A fresh burst of energy.', description: 'Discuss snack requirements as part of your customised workplace menu, planned around your employees and their breaks.', points: ['Workplace snack requirements', 'Customised menu discussions', 'Planned around team breaks'], alt: 'Illustrative tea-time snack of samosas with tea and chutney', number: '03' },
  dinner: { name: 'Dinner', eyebrow: 'Dinner for your shifts', title: 'The last shift.<br>The same care.', description: 'South Indian and North Indian options, shaped around your workforce’s evening meal and shift requirements.', points: ['South Indian and North Indian options', 'Flexible dinner menu choices', 'Planned around evening shifts'], alt: 'Illustrative North Indian dinner thali with chapati, dal, vegetables and rice', number: '04' }
};
const mealTabs = Array.from(document.querySelectorAll('[data-meal]'));
function selectMeal(key, focus = false) {
  const meal = mealData[key];
  if (!meal) return;
  mealTabs.forEach(tab => {
    const selected = tab.dataset.meal === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  document.querySelector('#meal-panel').setAttribute('aria-labelledby', `tab-${key}`);
  const art = document.querySelector('.meal-art');
  const photo = document.querySelector('#meal-image');
  const previousKey = art.dataset.view;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (previousKey !== key && !reduced && typeof photo.animate === 'function') {
    art.querySelectorAll('.meal-transition-photo').forEach(node => node.remove());
    const ghost = photo.cloneNode(false);
    ghost.removeAttribute('id');
    ghost.alt = '';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.className = 'meal-transition-photo';
    const positions = {breakfast:'translate(0,0)', lunch:'translate(-50%,0)', snacks:'translate(0,-50%)', dinner:'translate(-50%,-50%)'};
    ghost.style.transform = positions[previousKey];
    art.append(ghost);
    ghost.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-out'}).finished.then(() => ghost.remove()).catch(() => ghost.remove());
  }
  art.dataset.view = key;
  photo.alt = meal.alt;
  document.querySelector('#meal-eyebrow').textContent = meal.eyebrow;
  document.querySelector('#meal-title').innerHTML = meal.title;
  document.querySelector('#meal-description').textContent = meal.description;
  const points = document.querySelector('#meal-points');
  points.replaceChildren(...meal.points.map(point => {
    const li = document.createElement('li'); li.textContent = point; return li;
  }));
  const enquiryLink = document.querySelector('#meal-enquire');
  enquiryLink.dataset.pickMeal = meal.name;
  enquiryLink.innerHTML = `Discuss ${meal.name.toLowerCase()} for your team <span aria-hidden="true">↗</span>`;
  document.querySelector('#menu-number').textContent = `${meal.number} / 04`;
  const details = document.querySelector('.meal-description');
  if (!reduced && typeof details.animate === 'function') {
    details.getAnimations().forEach(animation => animation.cancel());
    details.animate([{opacity:.5,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'});
  }
}
mealTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectMeal(tab.dataset.meal));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % mealTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + mealTabs.length) % mealTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = mealTabs.length - 1;
    else return;
    event.preventDefault();
    selectMeal(mealTabs[next].dataset.meal, true);
  });
});
document.querySelector('#meal-enquire').addEventListener('click', event => {
  const selected = event.currentTarget.dataset.pickMeal;
  form.querySelectorAll('input[name="meals"]').forEach(input => {
    if (input.value === selected) input.checked = true;
  });
});

// Native scrolling stays intact. Movement is small and respects motion preferences.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const header = document.querySelector('.header');
const heroPhoto = document.querySelector('.hero-photo-wrap');
const stamp = document.querySelector('.meal-stamp');
const steps = Array.from(document.querySelectorAll('.process-step'));
const stepContainer = document.querySelector('.process-steps');
let scrollFrame = 0;
function renderScroll() {
  scrollFrame = 0;
  // Read geometry together before writing styles, to avoid layout work per step.
  const viewport = window.innerHeight;
  const scrollY = window.scrollY;
  const height = Math.max(1, root.scrollHeight - viewport);
  const photoPosition = heroPhoto.getBoundingClientRect();
  const headerHeight = header.offsetHeight;
  const stepBoxes = steps.map(step => step.getBoundingClientRect());
  const progress = Math.min(1, Math.max(0, scrollY / height));
  let active = 0;
  let distance = Infinity;
  stepBoxes.forEach((box, index) => {
    const currentDistance = Math.abs(box.top + box.height / 2 - viewport * .5);
    if (currentDistance < distance) { active = index; distance = currentDistance; }
  });
  root.style.setProperty('--scroll-progress', progress.toFixed(4));
  header.classList.toggle('scrolled', scrollY > 20);
  if (!motionPreference.matches && photoPosition.bottom > 0 && photoPosition.top < viewport) {
    const offset = Math.max(-12, Math.min(12, (headerHeight - photoPosition.top) * .05));
    heroPhoto.style.setProperty('--photo-y', `${offset.toFixed(1)}px`);
    stamp.style.setProperty('--stamp-rotation', `${-8 + Math.min(10, scrollY / 90)}deg`);
  }
  steps.forEach((step, index) => step.classList.toggle('is-active', index === active));
  document.querySelector('.process-current').textContent = String(active + 1).padStart(2, '0');
  document.querySelector('.process-indicator-line').style.setProperty('--process-scale', String((active + 1) / steps.length));
}
function scheduleScroll() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(renderScroll);
}
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible'); reveals.unobserve(entry.target);
      }
    });
  }, {threshold: .06, rootMargin: '0px 0px -25px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(element => reveals.observe(element));
  function syncMotion() {
    root.classList.toggle('motion-enabled', !motionPreference.matches);
    stepContainer.classList.toggle('motion-steps', !motionPreference.matches);
    scheduleScroll();
  }
  syncMotion();
  motionPreference.addEventListener('change', syncMotion);
}
window.addEventListener('scroll', scheduleScroll, {passive: true});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
  scheduleScroll();
}, {passive: true});
window.addEventListener('load', scheduleScroll, {once: true});
scheduleScroll();

