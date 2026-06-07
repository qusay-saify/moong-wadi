/* ═══════════════════════════════════════════════════════════════════════════
   MOONG WADI – JAVASCRIPT
   ═════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────
   STATE MANAGEMENT
   ───────────────────────────────────────────────────────────────────────── */

let currentStep = 1;
let selectedType = null;
let quantity = 1;
let locationChoice = null;
let paymentMethod = null;

const prices = {
  classic: 360,
  masala: 400
};

const typeNames = {
  classic: 'Normal Wadi',
  masala: 'Masala Wadi'
};

/* ─────────────────────────────────────────────────────────────────────────
   STEP NAVIGATION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Navigate to a specific step
 * @param {number} n - Step number (1, 2, 3, or 4)
 */
function goStep(n) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });

  // Show the requested step
  const stepEl = document.getElementById('step' + n);
  if (stepEl) {
    stepEl.classList.add('active');
  }

  currentStep = n;

  // Update UI elements
  updateStepIndicator(n);
  updateNavLinks(n);

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Show/hide step indicator
  const indicator = document.getElementById('stepIndicator');
  if (indicator) {
    indicator.style.display = n === 4 ? 'none' : 'flex';
  }

  // Build payment summary if going to step 3
  if (n === 3) {
    buildPaySummary();
  }
}

/**
 * Update the step indicator progress bar
 * @param {number} n - Current step
 */
function updateStepIndicator(n) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('si' + i);
    if (el) {
      el.classList.remove('done', 'active-s');
      if (i < n) {
        el.classList.add('done');
      } else if (i === n) {
        el.classList.add('active-s');
      }
    }
  }

  // Update separators
  for (let i = 1; i <= 2; i++) {
    const sep = document.getElementById('sep' + i);
    if (sep) {
      sep.classList.toggle('done', i < n);
    }
  }
}

/**
 * Update active navigation links
 * @param {number} n - Current step
 */
function updateNavLinks(n) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
  });

  if (n === 1) {
    const homeLink = document.getElementById('nav-home');
    if (homeLink) homeLink.classList.add('active');
  }

  if (n === 2 || n === 3) {
    const orderLink = document.getElementById('nav-order');
    if (orderLink) orderLink.classList.add('active');
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 2: TYPE SELECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Select a wadi type (classic or masala)
 * @param {string} type - Type name ('classic' or 'masala')
 */
function selectType(type) {
  selectedType = type;

  // Update card UI
  const classicCard = document.getElementById('card-classic');
  const masalaCard = document.getElementById('card-masala');

  if (classicCard) {
    classicCard.classList.toggle('selected', type === 'classic');
  }
  if (masalaCard) {
    masalaCard.classList.toggle('selected', type === 'masala');
  }

  // Enable proceed button
  const proceedBtn = document.getElementById('toPayBtn');
  if (proceedBtn) {
    proceedBtn.disabled = false;
  }

  // Update summary
  updateStep2Summary();
}

/**
 * Change quantity with increment/decrement
 * @param {number} delta - Amount to change (e.g., 0.5 or -0.5)
 */
function changeQ(delta) {
  // Calculate new quantity, minimum 0.5
  quantity = Math.max(0.5, Math.round((quantity + delta) * 10) / 10);

  // Update display
  const qdisplay = document.getElementById('qdisplay');
  if (qdisplay) {
    qdisplay.textContent = quantity % 1 === 0 ? quantity : quantity.toFixed(1);
  }

  updateStep2Summary();
}

/**
 * Update step 2 summary display
 */
function updateStep2Summary() {
  if (!selectedType) {
    return;
  }

  const subtotal = prices[selectedType] * quantity;
  const quantityDisplay = quantity % 1 === 0 ? quantity : quantity.toFixed(1);

  const selLabel = document.getElementById('sel-label');
  const selPrice = document.getElementById('sel-price');

  if (selLabel) {
    selLabel.textContent = typeNames[selectedType] + ' · ' + quantityDisplay + ' kg';
  }

  if (selPrice) {
    selPrice.textContent = '₹' + subtotal.toLocaleString('en-IN');
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 3: LOCATION & PAYMENT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Set delivery location
 * @param {string} location - 'ujjain' or 'outside'
 */
function setLocation(location) {
  locationChoice = location;

  // Update button states
  const ujjainBtn = document.getElementById('loc-ujjain');
  const outsideBtn = document.getElementById('loc-outside');

  if (ujjainBtn) {
    ujjainBtn.classList.toggle('selected', location === 'ujjain');
  }
  if (outsideBtn) {
    outsideBtn.classList.toggle('selected', location === 'outside');
  }

  // Show/hide courier note
  const courierNote = document.getElementById('courier-note');
  if (courierNote) {
    courierNote.classList.toggle('show', location === 'outside');
  }

  // Show/hide packaging charge row
  const pkgRow = document.getElementById('ps-pkg-row');
  if (pkgRow) {
    pkgRow.style.display = location === 'outside' ? 'flex' : 'none';
  }

  buildPaySummary();
}

/**
 * Build and update payment summary
 */
function buildPaySummary() {
  if (!selectedType) {
    return;
  }

  const subtotal = prices[selectedType] * quantity;
  const packaging = locationChoice === 'outside' ? 30 : 0;
  const total = subtotal + packaging;
  const quantityDisplay = quantity % 1 === 0 ? quantity : quantity.toFixed(1);

  // Update order summary fields
  const psType = document.getElementById('ps-type');
  const psSubtotal = document.getElementById('ps-subtotal');
  const psTotal = document.getElementById('ps-total');

  if (psType) {
    psType.textContent = typeNames[selectedType] + ' · ' + quantityDisplay + ' kg';
  }
  if (psSubtotal) {
    psSubtotal.textContent = '₹' + subtotal.toLocaleString('en-IN');
  }
  if (psTotal) {
    psTotal.textContent = '₹' + total.toLocaleString('en-IN');
  }

  // Show packaging row if needed
  const pkgRow = document.getElementById('ps-pkg-row');
  if (pkgRow && locationChoice === 'outside') {
    pkgRow.style.display = 'flex';
  }
}

/**
 * Set payment method and show relevant details
 * @param {string} method - Payment method ('upi', 'bank', or 'qr')
 */
function setMethod(method) {
  paymentMethod = method;

  // Update button states
  ['upi', 'bank', 'qr'].forEach(methodType => {
    const moptBtn = document.getElementById('mopt-' + methodType);
    if (moptBtn) {
      moptBtn.classList.toggle('sel', methodType === method);
    }

    // Show/hide detail sections
    let detailElement;
    if (methodType === 'bank') {
      detailElement = document.getElementById('bank-detail');
    } else {
      detailElement = document.getElementById(methodType + '-detail');
    }

    if (detailElement) {
      detailElement.classList.toggle('show', methodType === method);
    }
  });
}

/**
 * Navigate to payment step
 */
function goToPayment() {
  if (!selectedType) {
    alert('Please select a wadi type first.');
    return;
  }

  goStep(3);
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP 4: CONFIRMATION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Confirm order and show success message
 */
function confirmOrder() {
  // Validate form fields
  const name = document.getElementById('cname');
  const phone = document.getElementById('cphone');
  const address = document.getElementById('caddress');

  if (!name || !name.value.trim()) {
    alert('Please enter your full name.');
    return;
  }

  if (!phone || !phone.value.trim()) {
    alert('Please enter your WhatsApp / Phone number.');
    return;
  }

  if (!address || !address.value.trim()) {
    alert('Please enter your delivery address.');
    return;
  }

  if (!locationChoice) {
    alert('Please select your location (Ujjain or Outside).');
    return;
  }

  if (!paymentMethod) {
    alert('Please select a payment method.');
    return;
  }

  // Calculate final total
  const subtotal = prices[selectedType] * quantity;
  const packaging = locationChoice === 'outside' ? 30 : 0;
  const total = subtotal + packaging;
  const quantityDisplay = quantity % 1 === 0 ? quantity : quantity.toFixed(1);

  // Build success message
  const successMsg =
    name.value.trim() + ' · ' +
    typeNames[selectedType] + ' · ' +
    quantityDisplay + ' kg · ₹' +
    total.toLocaleString('en-IN') +
    (locationChoice === 'outside' ? ' (incl. ₹30 packaging)' : '');

  const successDetail = document.getElementById('successDetail');
  if (successDetail) {
    successDetail.textContent = successMsg;
  }

  // Go to success step
  goStep(4);
}

/**
 * Reset order form and go back to step 1
 */
function resetOrder() {
  // Reset state
  selectedType = null;
  quantity = 1;
  locationChoice = null;
  paymentMethod = null;

  // Reset Step 2 UI
  const classicCard = document.getElementById('card-classic');
  const masalaCard = document.getElementById('card-masala');
  if (classicCard) classicCard.classList.remove('selected');
  if (masalaCard) masalaCard.classList.remove('selected');

  const qdisplay = document.getElementById('qdisplay');
  if (qdisplay) qdisplay.textContent = '1';

  const selLabel = document.getElementById('sel-label');
  if (selLabel) selLabel.textContent = '— Please select a type above —';

  const selPrice = document.getElementById('sel-price');
  if (selPrice) selPrice.textContent = '₹0';

  const toPayBtn = document.getElementById('toPayBtn');
  if (toPayBtn) toPayBtn.disabled = true;

  // Reset Step 3 UI
  const ujjainBtn = document.getElementById('loc-ujjain');
  const outsideBtn = document.getElementById('loc-outside');
  if (ujjainBtn) ujjainBtn.classList.remove('selected');
  if (outsideBtn) outsideBtn.classList.remove('selected');

  const courierNote = document.getElementById('courier-note');
  if (courierNote) courierNote.classList.remove('show');

  const psKgRow = document.getElementById('ps-pkg-row');
  if (psKgRow) psKgRow.style.display = 'none';

  // Clear form fields
  const cname = document.getElementById('cname');
  const cphone = document.getElementById('cphone');
  const caddress = document.getElementById('caddress');

  if (cname) cname.value = '';
  if (cphone) cphone.value = '';
  if (caddress) caddress.value = '';

  // Reset payment methods
  ['upi', 'bank', 'qr'].forEach(methodType => {
    const moptBtn = document.getElementById('mopt-' + methodType);
    if (moptBtn) moptBtn.classList.remove('sel');

    let detailElement;
    if (methodType === 'bank') {
      detailElement = document.getElementById('bank-detail');
    } else {
      detailElement = document.getElementById(methodType + '-detail');
    }

    if (detailElement) detailElement.classList.remove('show');
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   CONTACT MODAL
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Open contact modal
 */
function openContact() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

/**
 * Close contact modal
 */
function closeContact() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeContact();
      }
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Add shadow to topbar when scrolled
 */
window.addEventListener('scroll', function() {
  const topbar = document.getElementById('topbar');
  if (topbar) {
    topbar.classList.toggle('raised', window.scrollY > 10);
  }
});

/* ─────────────────────────────────────────────────────────────────────────
   INITIALIZATION
   ───────────────────────────────────────────────────────────────────────── */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  updateStepIndicator(1);
  updateNavLinks(1);

  // Disable initial proceed button
  const toPayBtn = document.getElementById('toPayBtn');
  if (toPayBtn) {
    toPayBtn.disabled = true;
  }
});

// Console log for debugging
console.log('Moong Wadi website loaded successfully! 🌿');
