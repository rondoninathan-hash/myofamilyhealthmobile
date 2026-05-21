// Highlight the active bottom-nav item based on scroll position
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

const sectionIds = ['home', 'services', 'about', 'contact'];

function setActive(id) {
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    item.classList.toggle('active', href === '#' + id);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Appointment form feedback
const form = document.querySelector('.appt-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Request Sent!';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = 'Send Request';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}
