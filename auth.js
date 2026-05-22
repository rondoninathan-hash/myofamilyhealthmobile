const _UK = 'myo_users', _SK = 'myo_session';

function _hash(pw) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = (((h << 5) + h) ^ pw.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
function _users() { return JSON.parse(localStorage.getItem(_UK) || '{}'); }
function _save(u) { localStorage.setItem(_UK, JSON.stringify(u)); }

function authRegister(name, email, pw) {
  const u = _users(), k = email.toLowerCase().trim();
  if (u[k]) return { ok: false, err: 'An account with that email already exists.' };
  u[k] = { name: name.trim(), pw: _hash(pw), paid: [] };
  _save(u);
  return authLogin(email, pw);
}

function authLogin(email, pw) {
  const u = _users(), k = email.toLowerCase().trim();
  if (!u[k]) return { ok: false, err: 'No account found for that email.' };
  if (u[k].pw !== _hash(pw)) return { ok: false, err: 'Incorrect password.' };
  localStorage.setItem(_SK, JSON.stringify({ email: k, name: u[k].name }));
  return { ok: true };
}

function authSession() { return JSON.parse(localStorage.getItem(_SK) || 'null'); }
function authLogout() { localStorage.removeItem(_SK); }

function authHasPaid(sid) {
  const s = authSession();
  return s ? (_users()[s.email]?.paid || []).includes(sid) : false;
}

function authMarkPaid(sid) {
  const s = authSession();
  if (!s) return false;
  const u = _users();
  if (!u[s.email]) return false;
  if (!u[s.email].paid.includes(sid)) { u[s.email].paid.push(sid); _save(u); }
  return true;
}
