'use strict';

// 1. تغییر استایل Navbar موقع اسکرول
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. انیمیشن ساده برای المان‌های ورودی

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// 3. نمایش پیام
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    
    // اگر کانتینر نبود، بسازش
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', info: '💬', warning: '⚠️' };
    const icon = icons[type] || '💬';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);

    // حذف خودکار بعد از 3.5 ثانیه
    setTimeout(() => {
        toast.remove();
    }, 3500);
}
window.showToast = showToast;

// 4. چک کردن ورود کاربر 
async function requireAuth(redirectTo = 'login.html') {
    try {
        const response = await fetch('../php/auth.php?action=me');
        const data = await response.json();

        if (!data.success) {
            window.location.href = redirectTo;
            return null;
        }
        return data.user;
    } catch (error) {
        return null;
    }
}
window.requireAuth = requireAuth;

// 5. مدیریت کلیک روی   فیلترها (کد تکراری رو با یک تابع ساده مدیریت می‌کنیم)
function setupActiveClass(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.addEventListener('click', function() {
            elements.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

setupActiveClass('.category-pill');
setupActiveClass('.filter-btn[data-sort]');

// 6. هماهنگ کردن دو اینپوت سرچ (Sync)
const input1 = document.getElementById('searchInput');
const input2 = document.getElementById('searchInput2');

if (input1 && input2) {
    input1.addEventListener('input', () => input2.value = input1.value);
    input2.addEventListener('input', () => input1.value = input2.value);
}

// 7. خروج از حساب کاربری (Logout)
async function logout() {
    try {
        await fetch('../php/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=logout'
        });
    } finally {
        window.location.href = 'login.html';
    }
}
window.logout = logout;

// 8. تبدیل زمان به عبارت فارسی (Time Ago)
function timeAgo(dateStr) {
    if (!dateStr) return '—';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);

    if (diff < 60) return 'لحظاتی پیش';
    if (diff < 3600) return Math.floor(diff / 60) + ' دقیقه پیش';
    if (diff < 86400) return Math.floor(diff / 3600) + ' ساعت پیش';
    if (diff < 604800) return Math.floor(diff / 86400) + ' روز پیش';
    
    return dateStr.split(' ')[0]; // فقط تاریخ رو نشون بده
}
window.timeAgo = timeAgo;

// 9. تبدیل اعداد به فارسی
function toPersian(n) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return n.toString().replace(/\d/g, d => persianDigits[d]);
}
window.toPersian = toPersian;

// 10. افکت Fade-in صفحه هنگام لود شدن
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    // یک تاخیر خیلی کم برای اجرای انیمیشن
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});

// خروجی نهایی برای دسترسی جهانی
window.QA = { showToast, requireAuth, logout, timeAgo, toPersian };
