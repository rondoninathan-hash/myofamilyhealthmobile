// Update header account button
function updateHeaderAuth() {
  const s = authSession();
  const btn = document.getElementById('header-acct');
  const label = document.getElementById('header-acct-label');
  if (!btn || !label) return;
  if (s) {
    label.textContent = s.name.split(' ')[0];
    btn.href = '#';
    btn.onclick = e => {
      e.preventDefault();
      if (confirm('Sign out of ' + s.name + '?')) { authLogout(); location.reload(); }
    };
  }
}
updateHeaderAuth();

// Active bottom-nav via scroll
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');

function setActive(id) {
  navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === '#' + id));
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Appointment form feedback
const form = document.getElementById('appt-form');
if (form) {
  form.addEventListener('submit', e => {
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
