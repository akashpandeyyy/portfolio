import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, push, set, onValue, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ================================================================
// FIREBASE SETUP
// ----------------------------------------------------------------
// 1. Create a project at https://console.firebase.google.com
// 2. Build > Realtime Database > Create Database (test mode)
// 3. Project Settings > General > Your apps > Web app (</>) >
//    copy the firebaseConfig object and paste it below,
//    replacing the YOUR_* placeholder values.
// ================================================================
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const isConfigured = !Object.values(firebaseConfig).some(v => String(v).startsWith("YOUR_"));

let db = null;
if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("[Firebase] Connected successfully.");
} else {
  console.warn("[Firebase] Not configured yet. Contact form and live projects running in fallback mode.");
}

/* ================================================================
   CONTACT FORM  →  /messages
================================================================ */
const form      = document.getElementById('contact-form');
const statusEl  = document.getElementById('cf-status');
const submitBtn = document.getElementById('cf-submit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    if (!name || !email || !message) return;

    if (!db) {
      statusEl.textContent = "Form isn't connected to Firebase yet — email me directly: akashpandey2599@gmail.com";
      statusEl.className = 'cf-status err';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "";
    statusEl.className = 'cf-status';

    try {
      const messagesRef = ref(db, 'messages');
      const newMsgRef   = push(messagesRef);
      await set(newMsgRef, {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        source: 'portfolio-contact-form'
      });
      form.reset();
      statusEl.textContent = "✓ Message sent — thanks! I'll get back to you within 24 hrs.";
      statusEl.className = 'cf-status ok';
    } catch (err) {
      console.error("[Firebase] Contact form error:", err);
      statusEl.textContent = "Something went wrong — please email me directly: akashpandey2599@gmail.com";
      statusEl.className = 'cf-status err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message →";
    }
  });
}

/* ================================================================
   LIVE PROJECTS  ←  /projects
   Expected shape in Realtime DB under /projects/<id>:
   {
     tag:         "FINTECH",
     title:       "Gramin E-Bank",
     icon:        "🏦",           (optional)
     description: "...",
     stack:       ["Java", "Firebase"],
     github:      "https://github.com/...",   (optional)
     live:        "https://...",              (optional)
     wip:         false                       (optional)
   }
================================================================ */
if (db) {
  const projectsRef = ref(db, 'projects');
  onValue(projectsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return; // keep static fallback cards if /projects is empty

    const grid = document.getElementById('proj-grid');
    if (!grid) return;

    grid.innerHTML = '';
    Object.values(data).forEach(p => {
      const icon   = p.icon || '📦';
      const stack  = (p.stack || []).map(s => `<span>${s}</span>`).join('');

      let linksHtml = '';
      if (p.wip) {
        linksHtml = `<span class="proj-wip">🚧 In Development</span>`;
      } else {
        if (p.github) {
          linksHtml += `
            <a class="proj-link" href="${p.github}" target="_blank" rel="noopener" aria-label="View ${p.title} on GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true" style="width:12px;height:12px;fill:currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.22 1.82 1.22 1.06 1.82 2.78 1.3 3.46 1 .1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.68.83.56C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              View Code
            </a>`;
        }
        if (p.live) {
          linksHtml += `<a class="proj-link" href="${p.live}" target="_blank" rel="noopener" aria-label="View ${p.title} live demo">↗ Live Demo</a>`;
        }
      }

      const card = document.createElement('div');
      card.className = 'proj-card reveal in';
      card.innerHTML = `
        <div class="proj-card-top">
          <div class="proj-icon">${icon}</div>
          <span class="proj-tag">${p.tag ?? ''}</span>
        </div>
        <h3>${p.title ?? ''}</h3>
        <p>${p.description ?? ''}</p>
        <div class="proj-stack">${stack}</div>
        <div class="proj-links">${linksHtml}</div>
      `;
      grid.appendChild(card);
    });

    // Show LIVE badge
    const liveBadge = document.getElementById('proj-live-badge');
    if (liveBadge) liveBadge.style.display = 'inline-flex';

  }, (err) => {
    console.warn("[Firebase] Couldn't load live projects, showing static fallback:", err.message);
  });
}
