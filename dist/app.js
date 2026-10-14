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
