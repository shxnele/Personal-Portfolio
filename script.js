const PROFILE = {
    email:     "shanneligana@gmail.com",
    github:    "https://github.com/shxnele",
    instagram: "https://www.instagram.com/shxnele"
};

document.querySelectorAll("[data-social]").forEach(el => {
    const url = PROFILE[el.dataset.social];
    if (url) el.href = url;
});
const emailLink = document.getElementById("email-link");
if (emailLink) {
    emailLink.href = "mailto:" + PROFILE.email;
    emailLink.textContent = PROFILE.email;
}
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

function setMenu(open) {
    navbar.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuToggle.classList.toggle("is-open", open);
}
menuToggle.addEventListener("click", () => setMenu(!navbar.classList.contains("open")));
navbar.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

const navLinks = [...navbar.querySelectorAll("a")];
const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

function updateActiveLink() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));
}
window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

const revealTargets = document.querySelectorAll(".card, .section-head");
if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => { el.classList.add("reveal"); io.observe(el); });
}

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

function validate(field) {
    const wrap = field.closest(".field");
    const err = wrap.querySelector(".error");
    let msg = "";
    if (!field.value.trim()) {
        msg = "This field is required.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        msg = "Please enter a valid email address.";
    }
    wrap.classList.toggle("invalid", Boolean(msg));
    err.textContent = msg;
    return !msg;
}

form.querySelectorAll("input, textarea").forEach(f => {
    f.addEventListener("blur", () => validate(f));
    f.addEventListener("input", () => { if (f.closest(".field").classList.contains("invalid")) validate(f); });
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input, textarea")];
    const allValid = fields.map(validate).every(Boolean);
    if (!allValid) {
        statusEl.className = "form-status";
        statusEl.textContent = "Please fix the highlighted fields.";
        fields.find(f => f.closest(".field").classList.contains("invalid")).focus();
        return;
    }
    const { name, email, message } = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent("Portfolio message from " + name.trim());
    const body = encodeURIComponent(message.trim() + "\n\n" + name.trim() + "\n" + email.trim());
    window.location.href = "mailto:" + PROFILE.email + "?subject=" + subject + "&body=" + body;
    statusEl.className = "form-status ok";
    statusEl.textContent = "Opening your email app. If nothing happens, email me directly at " + PROFILE.email + ".";
    form.reset();
});
