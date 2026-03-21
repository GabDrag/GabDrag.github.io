// Simple password protection for static site
// Password: bozos2026 (SHA-256 hash below)
const PASSWORD_HASH = '8e9c7f0a5e3b2d1c4f6a8b9e7d5c3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b';

// Simple hash function for client-side use
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'wedding-salt-2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if already authenticated
function isAuthenticated() {
    return sessionStorage.getItem('wedding-auth') === 'true';
}

// Set authenticated state
function setAuthenticated() {
    sessionStorage.setItem('wedding-auth', 'true');
}

// Initialize password gate
async function initPasswordGate() {
    // If already authenticated, remove the gate immediately
    if (isAuthenticated()) {
        const gate = document.getElementById('password-gate');
        if (gate) gate.remove();
        document.body.classList.remove('locked');
        return;
    }

    // Show the gate
    document.body.classList.add('locked');

    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');

    // Pre-compute the correct hash
    const correctHash = await hashPassword('bozos2026');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const enteredPassword = input.value.trim().toLowerCase();
        const enteredHash = await hashPassword(enteredPassword);

        if (enteredHash === correctHash) {
            setAuthenticated();
            const gate = document.getElementById('password-gate');
            gate.style.opacity = '0';
            setTimeout(() => {
                gate.remove();
                document.body.classList.remove('locked');
            }, 300);
        } else {
            error.style.display = 'block';
            input.value = '';
            input.focus();
        }
    });

    input.focus();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordGate);
} else {
    initPasswordGate();
}
