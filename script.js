(function () {
"use strict";
// Mark that JS is running.
document.documentElement.classList.add("js-ready");
// Safety net
window.addEventListener("load", function () {
setTimeout(function () {
document.querySelectorAll(".reveal:not(.in-view)").forEach(function (el) {
el.classList.add("in-view");
});
}, 2500);
});
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* -----------------------------------------------------------
Stat counters
----------------------------------------------------------- */
var counted = false;
function runCounters() {
if (counted) return;
counted = true;
document.querySelectorAll(".stat").forEach(function (stat) {
var target = parseFloat(stat.dataset.count);
var isDecimal = stat.dataset.decimal === "true";
var numEl = stat.querySelector(".stat-num");
if (reduceMotion) {
numEl.textContent = isDecimal ? target.toFixed(2) : target;
return;
}
var start = 0;
var duration = 1000;
var startTime = null;
function step(ts) {
if (!startTime) startTime = ts;
var progress = Math.min((ts - startTime) / duration, 1);
var value = start + (target - start) * progress;
numEl.textContent = isDecimal ? value.toFixed(2) : Math.floor(value);
if (progress < 1) {
requestAnimationFrame(step);
} else {
numEl.textContent = isDecimal ? target.toFixed(2) : target;
}
}
requestAnimationFrame(step);
});
}
/* -----------------------------------------------------------
Scroll reveal + counters
----------------------------------------------------------- */
try {
var revealEls = document.querySelectorAll(".reveal");
var statsBar = document.querySelector(".stats-bar");
if ("IntersectionObserver" in window) {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add("in-view");
io.unobserve(entry.target);
}
});
}, { threshold: 0.15 });
revealEls.forEach(function (el) {
io.observe(el);
});
if (statsBar) {
var statsIo = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
runCounters();
statsIo.disconnect();
}
});
}, { threshold: 0.4 });
statsIo.observe(statsBar);
}
} else {
revealEls.forEach(function (el) {
el.classList.add("in-view");
});
runCounters();
}
} catch (err) {
document.querySelectorAll(".reveal").forEach(function (el) {
el.classList.add("in-view");
});
}
/* -----------------------------------------------------------
Scrollspy
----------------------------------------------------------- */
try {
var sections = document.querySelectorAll("main section[id]");
var navLinks = document.querySelectorAll(".nav-link");
if ("IntersectionObserver" in window && sections.length) {
var spyIo = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
var link = document.querySelector(
'.nav-link[data-nav="' + entry.target.id + '"]'
);
if (!link) return;
if (entry.isIntersecting) {
navLinks.forEach(function (l) {
l.classList.remove("active");
});
link.classList.add("active");
}
});
}, {
rootMargin: "-45% 0px -50% 0px",
threshold: 0
});
sections.forEach(function (s) {
spyIo.observe(s);
});
}
} catch (err) {}
/* -----------------------------------------------------------
Project cards
----------------------------------------------------------- */
try {
document.querySelectorAll(".proj-card").forEach(function (card) {
card.addEventListener("click", function () {
card.classList.toggle("open");
});
card.addEventListener("keydown"
, function (e) {
if (e.key === "Enter" || e.key === " ") {
e.preventDefault();
card.classList.toggle("open");
}
});
});
} catch (err) {}
/* -----------------------------------------------------------
Copy email
----------------------------------------------------------- */
try {
var copyBtn = document.querySelector(".copy-btn");
if (copyBtn) {
copyBtn.addEventListener("click", function () {
var text = copyBtn.dataset.copy;
var done = function () {
var original = copyBtn.textContent;
copyBtn.textContent = "Copied";
copyBtn.classList.add("copied");
setTimeout(function () {
copyBtn.textContent = original;
copyBtn.classList.remove("copied");
}, 1500);
};
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(done).catch(done);
} else {
done();
}
});
}
} catch (err) {}
/* -----------------------------------------------------------
Theme Toggle
----------------------------------------------------------- */
try {
let dark = false;
const btn = document.getElementById("themeBtn");
if (btn) {
btn.onclick = function () {
dark = !dark;
document.body.classList.toggle("dark-mode");
btn.innerHTML = dark ? "☀️ Light" : "🌙 Dark";
};
}
} catch (err) {}
})();
 