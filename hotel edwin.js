
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Mobile menu toggle (for future enhancement)
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    
    nav.insertBefore(mobileMenuBtn, navLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = navLinks.classList.contains('mobile-active') 
            ? 'fas fa-times' 
            : 'fas fa-bars';
    });
};

// Form submission handler
document.querySelector('.booking-form form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData);
    
    // Simple validation
    if (!bookingData.checkin || !bookingData.checkout) {
        alert('Please select check-in and check-out dates');
        return;
    }
    
    if (new Date(bookingData.checkin) >= new Date(bookingData.checkout)) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    // Simulate booking submission
    alert(`Thank you ${bookingData.name}! Your booking request has been submitted. We will contact you shortly at ${bookingData.email}`);
    e.target.reset();
});

// Set minimum date for check-in to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').min = today;
    document.getElementById('checkout').min = today;
    
    // Update checkout minimum when checkin changes
    document.getElementById('checkin').addEventListener('change', (e) => {
        const checkinDate = new Date(e.target.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        document.getElementById('checkout').min = checkinDate.toISOString().split('T')[0];
    });
    
    createMobileMenu();
});

// Price calculator
const updatePrice = () => {
    const roomType = document.getElementById('room-type').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    
    if (roomType && checkin && checkout) {
        const prices = {
            'standard': 45,
            'deluxe': 65,
            'family': 95
        };
        
        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        const total = prices[roomType] * nights;
        
        let priceDisplay = document.querySelector('.price-display');
        if (!priceDisplay) {
            priceDisplay = document.createElement('div');
            priceDisplay.className = 'price-display';
            priceDisplay.style.cssText = `
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                text-align: center;
                font-weight: bold;
                color: #2c5530;
            `;
            document.querySelector('.booking-form form').appendChild(priceDisplay);
        }
        
        priceDisplay.innerHTML = `
            <div>Total: $${total} for ${nights} night${nights > 1 ? 's' : ''}</div>
            <small style="color: #666;">($${prices[roomType]} per night)</small>
        `;
    }
};

// Add event listeners for price calculation
document.getElementById('room-type').addEventListener('change', updatePrice);
document.getElementById('checkin').addEventListener('change', updatePrice);
document.getElementById('checkout').addEventListener('change', updatePrice);

// Image Slider Functionality
let currentSlideIndex = {
    standard: 1
};

function showSlide(roomType, n) {
    const slides = document.querySelectorAll(`.room-image-slider .slider-image`);
    const dots = document.querySelectorAll(`.room-image-slider .dot`);
    
    if (n > slides.length) { currentSlideIndex[roomType] = 1; }
    if (n < 1) { currentSlideIndex[roomType] = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex[roomType] - 1]) {
        slides[currentSlideIndex[roomType] - 1].classList.add('active');
    }
    if (dots[currentSlideIndex[roomType] - 1]) {
        dots[currentSlideIndex[roomType] - 1].classList.add('active');
    }
}

function changeSlide(roomType, n) {
    currentSlideIndex[roomType] += n;
    showSlide(roomType, currentSlideIndex[roomType]);
}

function currentSlide(roomType, n) {
    currentSlideIndex[roomType] = n;
    showSlide(roomType, currentSlideIndex[roomType]);
}

// Auto-slide functionality (optional)
function autoSlide() {
    changeSlide('standard', 1);
}

// Start auto-slide every 5 seconds
setInterval(autoSlide, 5000);
