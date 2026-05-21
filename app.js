// Highlight active bottom-nav item based on scroll
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

function setActive(id) {
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === '#' + id);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Appointment form feedback
const form = document.getElementById('appt-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Request Sent ✓';
    btn.style.background = '#4D8E8A';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Request';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}
