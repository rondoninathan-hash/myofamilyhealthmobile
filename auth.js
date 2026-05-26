const _UK = 'myo_users', _SK = 'myo_session';
const _MAX = 15;

function _hash(pw) {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = (((h << 5) + h) ^ pw.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
function _users() { return JSON.parse(localStorage.getItem(_UK) || '{}'); }
function _save(u) { localStorage.setItem(_UK, JSON.stringify(u)); }

function authRegister(name, email, pw, secQ, secA) {
  const u = _users(), k = email.toLowerCase().trim();
  if (u[k]) return { ok: false, err: 'An account with that email already exists.' };
  u[k] = { name: name.trim(), pw: _hash(pw), paid: [], secQ, secA: _hash(secA.toLowerCase().trim()), attempts: 0, locked: false };
  _save(u);
  return authLogin(email, pw);
}

function authLogin(email, pw) {
  const u = _users(), k = email.toLowerCase().trim();
  if (!u[k]) return { ok: false, err: 'No account found for that email.' };
  if (u[k].locked) return { ok: false, err: 'Account locked — too many failed attempts. Use \"Forgot Password?\" to regain access.', locked: true };
  if (u[k].pw !== _hash(pw)) {
    u[k].attempts = (u[k].attempts || 0) + 1;
    if (u[k].attempts >= _MAX) u[k].locked = true;
    _save(u);
    const left = _MAX - u[k].attempts;
    return u[k].locked
      ? { ok: false, err: 'Account locked after 15 failed attempts. Use \"Forgot Password?\" below to reset access.', locked: true }
      : { ok: false, err: `Incorrect password — ${left} attempt${left !== 1 ? 's' : ''} remaining.` };
  }
  u[k].attempts = 0;
  _save(u);
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

function authEmailExists(email) {
  const u = _users(), k = email.toLowerCase().trim();
  return !!u[k];
}

function authGetSecQ(email) {
  const u = _users(), k = email.toLowerCase().trim();
  return u[k]?.secQ || null;
}

function authResetPassword(email, secA, newPw) {
  const u = _users(), k = email.toLowerCase().trim();
  if (!u[k]) return { ok: false, err: 'No account found for that email.' };
  if (!u[k].secA) return { ok: false, err: 'No security question on file. Please call us at (707) 631-1550.' };
  if (u[k].secA !== _hash(secA.toLowerCase().trim())) return { ok: false, err: 'Security answer is incorrect.' };
  u[k].pw = _hash(newPw);
  u[k].locked = false;
  u[k].attempts = 0;
  _save(u);
  return { ok: true };
}
