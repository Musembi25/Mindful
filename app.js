// Navigation
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all nav items and sections
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked item and corresponding section
        item.classList.add('active');
        const sectionId = item.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Journal Functionality
const journalText = document.getElementById('journal-text');
const saveJournalBtn = document.getElementById('save-journal');
const journalEntries = document.getElementById('journal-entries');

// Load journal entries from localStorage
function loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    journalEntries.innerHTML = entries.map(entry => `
        <div class="journal-entry-item" data-id="${entry.id}">
            <p class="entry-date">${new Date(entry.date).toLocaleString()}</p>
            <p class="entry-text">${entry.text}</p>
            <div class="journal-entry-actions">
                <button class="delete-btn" onclick="deleteJournalEntry(${entry.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Save journal entry
saveJournalBtn.addEventListener('click', () => {
    const text = journalText.value.trim();
    if (text) {
        const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries.unshift({
            id: Date.now(),
            text,
            date: new Date().toISOString()
        });
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        journalText.value = '';
        loadJournalEntries();
    }
});

// Delete journal entry
function deleteJournalEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        loadJournalEntries();
    }
}

// Mood Tracker Functionality
const moodButtons = document.querySelectorAll('.mood-btn');
const moodNotes = document.getElementById('mood-notes');
const saveMoodBtn = document.getElementById('save-mood');
const moodEntries = document.getElementById('mood-entries');
let selectedMood = null;
let moodChart;

// Initialize mood chart
function initMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodData = JSON.parse(localStorage.getItem('moodData')) || [];
    
    if (moodChart) {
        moodChart.destroy();
    }
    
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()),
            datasets: [{
                label: 'Mood',
                data: moodData.map(entry => entry.value),
                borderColor: '#6B4E71',
                backgroundColor: 'rgba(107, 78, 113, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = ['', 'Awful', 'Bad', 'Neutral', 'Good', 'Great'];
                            return labels[value];
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labels = ['', 'Awful', 'Bad', 'Neutral', 'Good', 'Great'];
                            return `Mood: ${labels[context.raw]}`;
                        }
                    }
                }
            }
        }
    });
}

// Select mood
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedMood = button.getAttribute('data-mood');
    });
});

// Save mood entry
saveMoodBtn.addEventListener('click', () => {
    if (!selectedMood) {
        alert('Please select a mood first!');
        return;
    }

    const moodValues = {
        'great': 5,
        'good': 4,
        'neutral': 3,
        'bad': 2,
        'awful': 1
    };

    const moodData = JSON.parse(localStorage.getItem('moodData')) || [];
    const newEntry = {
        id: Date.now(),
        value: moodValues[selectedMood],
        notes: moodNotes.value.trim(),
        date: new Date().toISOString()
    };

    moodData.unshift(newEntry);
    localStorage.setItem('moodData', JSON.stringify(moodData));

    // Reset form
    moodNotes.value = '';
    selectedMood = null;
    moodButtons.forEach(btn => btn.classList.remove('selected'));

    // Update UI
    initMoodChart();
    loadMoodEntries();
});

// Load mood entries
function loadMoodEntries() {
    const moodData = JSON.parse(localStorage.getItem('moodData')) || [];
    const moodLabels = {
        5: 'Great',
        4: 'Good',
        3: 'Neutral',
        2: 'Bad',
        1: 'Awful'
    };

    moodEntries.innerHTML = moodData.map(entry => `
        <div class="mood-entry" data-id="${entry.id}">
            <div class="mood-entry-content">
                <div class="mood-entry-date">
                    ${new Date(entry.date).toLocaleString()}
                </div>
                <div class="mood-entry-mood">
                    Mood: ${moodLabels[entry.value]}
                </div>
                ${entry.notes ? `<div class="mood-entry-notes">${entry.notes}</div>` : ''}
            </div>
            <div class="mood-entry-actions">
                <button class="delete-btn" onclick="deleteMoodEntry(${entry.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Delete mood entry
function deleteMoodEntry(id) {
    if (confirm('Are you sure you want to delete this mood entry?')) {
        let moodData = JSON.parse(localStorage.getItem('moodData')) || [];
        moodData = moodData.filter(entry => entry.id !== id);
        localStorage.setItem('moodData', JSON.stringify(moodData));
        initMoodChart();
        loadMoodEntries();
    }
}

// Affirmations Functionality
const affirmations = [
    "I am capable of amazing things.",
    "I choose to be confident and self-assured.",
    "I am worthy of love and respect.",
    "I trust in my abilities and inner wisdom.",
    "I am becoming better and stronger every day.",
    "I radiate positivity and attract positive energy.",
    "I am in charge of my own happiness.",
    "I believe in myself and my abilities.",
    "I am surrounded by love and support.",
    "I am grateful for all that I have."
];

const currentAffirmation = document.getElementById('current-affirmation');
const newAffirmationBtn = document.getElementById('new-affirmation');
const favoritesList = document.getElementById('favorites-list');

// Load random affirmation
function loadRandomAffirmation() {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    currentAffirmation.textContent = affirmations[randomIndex];
}

// Add to favorites
currentAffirmation.addEventListener('click', () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteAffirmations')) || [];
    if (!favorites.includes(currentAffirmation.textContent)) {
        favorites.push(currentAffirmation.textContent);
        localStorage.setItem('favoriteAffirmations', JSON.stringify(favorites));
        loadFavorites();
    }
});

// Load favorites
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favoriteAffirmations')) || [];
    favoritesList.innerHTML = favorites.map((affirmation, index) => `
        <li>
            ${affirmation}
            <button class="delete-btn" onclick="deleteFavorite(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');
}

// Delete favorite affirmation
function deleteFavorite(index) {
    if (confirm('Are you sure you want to remove this affirmation from favorites?')) {
        let favorites = JSON.parse(localStorage.getItem('favoriteAffirmations')) || [];
        favorites.splice(index, 1);
        localStorage.setItem('favoriteAffirmations', JSON.stringify(favorites));
        loadFavorites();
    }
}

// Reminders Functionality
const reminderText = document.getElementById('reminder-text');
const reminderTime = document.getElementById('reminder-time');
const addReminderBtn = document.getElementById('add-reminder');
const remindersContainer = document.getElementById('reminders-container');

// Load reminders
function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    remindersContainer.innerHTML = reminders.map(reminder => `
        <li data-id="${reminder.id}">
            <span>${reminder.text}</span>
            <span>${new Date(reminder.time).toLocaleString()}</span>
            <button class="delete-btn" onclick="deleteReminder(${reminder.id})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');
}

// Add reminder
addReminderBtn.addEventListener('click', () => {
    const text = reminderText.value.trim();
    const time = reminderTime.value;
    
    if (text && time) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.push({
            id: Date.now(),
            text,
            time
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        reminderText.value = '';
        reminderTime.value = '';
        loadReminders();
    }
});

// Delete reminder
function deleteReminder(id) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders = reminders.filter(reminder => reminder.id !== id);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        loadReminders();
    }
}

// Check for due reminders
function checkReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const now = new Date();
    
    reminders.forEach(reminder => {
        const reminderTime = new Date(reminder.time);
        if (reminderTime <= now && !reminder.notified) {
            alert(`Reminder: ${reminder.text}`);
            reminder.notified = true;
        }
    });
    
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Profile Name Functionality
function loadUserName() {
    const name = localStorage.getItem('userName') || '';
    const displayName = document.getElementById('display-name');
    const userNameInput = document.getElementById('user-name');
    if (name) {
        displayName.textContent = `Hello, ${name}!`;
        userNameInput.value = name;
    } else {
        displayName.textContent = '';
        userNameInput.value = '';
    }
}

const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userName = document.getElementById('user-name').value.trim();
        if (userName) {
            localStorage.setItem('userName', userName);
            loadUserName();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
    initMoodChart();
    loadMoodEntries();
    loadRandomAffirmation();
    loadFavorites();
    loadReminders();
    loadUserName();
    
    // Event listeners
    newAffirmationBtn.addEventListener('click', loadRandomAffirmation);
    
    // Check reminders every minute
    setInterval(checkReminders, 60000);

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
        }
    });

    // Prevent clicks inside sidebar from closing it
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Navigation
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all nav items and sections
            navLinks.forEach(li => li.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked item and corresponding section
            link.classList.add('active');
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 900) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        });
    });
}); 