// Smooth scrolling and nav highlight
const navLinks = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 60;
    navLinks.forEach(link => {
        const section = document.querySelector(link.hash);
        if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
        ) {
            navLinks.forEach(l=>l.classList.remove("active"));
            link.classList.add('active');
        }
    });
});
// Initial
if (navLinks.length > 0) navLinks[0].classList.add('active');
