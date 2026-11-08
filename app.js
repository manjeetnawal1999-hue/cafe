import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); if(toggle) toggle.textContent='☰';
}));

const filters = document.querySelectorAll('.filter');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.menu-card').forEach(card => {
    card.hidden = btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter;
  });
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();
const dateInput = document.querySelector('[name="booking_date"]');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
dateInput.min = localToday;

function setStatus(id, message, error=false) {
  const el = document.getElementById(id); el.textContent = message; el.classList.toggle('error', error);
}
function phoneValid(value) { return /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g,'')); }
function clean(value) { return value.trim(); }

document.getElementById('booking-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form).entries());
  if (values.website) return;
  values.full_name = clean(values.full_name); values.phone = values.phone.replace(/[\s()-]/g,'');
  values.email = clean(values.email) || null; values.special_requests = clean(values.special_requests) || null;
  if (!phoneValid(values.phone)) { setStatus('booking-status','Please enter a valid phone number (10–15 digits).',true); return; }
  if (values.booking_date < localToday) { setStatus('booking-status','Please choose today or a future date.',true); return; }
  if (!supabase) { setStatus('booking-status','Database is not configured yet. Please contact us at +91 1234567890.',true); return; }
  const button = form.querySelector('button[type=submit]'); button.disabled = true; button.textContent = 'Sending request…';
  try {
    const { data, error } = await supabase.from('cafe_bookings').insert({
      full_name: values.full_name, phone: values.phone, email: values.email,
      booking_date: values.booking_date, booking_time: values.booking_time,
      guests: Number(values.guests), special_requests: values.special_requests
    }).select('reference_code').single();
    if (error) throw error;
    form.reset(); dateInput.min = localToday;
    setStatus('booking-status', `Thank you! Your request ${data?.reference_code ? '('+data.reference_code+') ' : ''}has been received. Our team will contact you to confirm your table.`);
  } catch (err) {
    console.error(err); setStatus('booking-status','We could not send your request right now. Please call +91 1234567890.',true);
  } finally { button.disabled = false; button.innerHTML = 'Request my table <span>↗</span>'; }
});

document.getElementById('inquiry-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form).entries());
  if (values.website) return;
  values.full_name=clean(values.full_name); values.subject=clean(values.subject); values.message=clean(values.message);
  values.phone=values.phone.replace(/[\s()-]/g,''); values.email=clean(values.email)||null; values.phone=values.phone||null;
  if (values.phone && !phoneValid(values.phone)) { setStatus('inquiry-status','Please enter a valid phone number.',true); return; }
  if (!supabase) { setStatus('inquiry-status','Database is not configured yet. Please call +91 1234567890.',true); return; }
  const button=form.querySelector('button[type=submit]'); button.disabled=true; button.textContent='Sending…';
  try {
    const {error}=await supabase.from('cafe_inquiries').insert({
      full_name:values.full_name,phone:values.phone,email:values.email,subject:values.subject,message:values.message
    });
    if(error) throw error;
    form.reset(); setStatus('inquiry-status','Thanks for reaching out! Your message has been received.');
  } catch(err) {
    console.error(err); setStatus('inquiry-status','We could not send your message. Please call +91 1234567890.',true);
  } finally {button.disabled=false;button.innerHTML='Send your message <span>↗</span>';}
});