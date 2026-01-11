// DOM Elements
const topicsList = document.getElementById('topics-list');
const loading = document.getElementById('loading');
const noTopics = document.getElementById('no-topics');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const refreshBtn = document.getElementById('refresh-btn');
const sectionTitle = document.querySelector('.section-title');

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  extractTopics();
});

// Refresh button click handler
refreshBtn.addEventListener('click', () => {
  extractTopics();
});

// Main function to extract topics from the active tab
async function extractTopics() {
  showLoading();

  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      showError('No active tab found');
      return;
    }

    // Check if we're on a supported page
    if (!tab.url || (!tab.url.includes('leetcode.com') && !tab.url.includes('leetcode.cn'))) {
      showNoTopics();
      return;
    }

    // Inject and execute the content script to extract topics
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractTopicsFromPage
    });

    if (results && results[0] && results[0].result) {
      const topics = results[0].result;
      
      if (topics.length > 0) {
        displayTopics(topics);
      } else {
        showNoTopics();
      }
    } else {
      showNoTopics();
    }
  } catch (error) {
    console.error('Error extracting topics:', error);
    showError('Unable to access page content');
  }
}

// Function to be injected into the page
function extractTopicsFromPage() {
  // Use semantic selector to find topic links (future-proof, not relying on class names)
  const topicElements = document.querySelectorAll('a[href^="/tag/"]');
  const topics = Array.from(topicElements)
    .map(el => el.innerText.trim())
    .filter(topic => topic.length > 0);
  
  // Remove duplicates
  return [...new Set(topics)];
}

// Display topics in the UI
function displayTopics(topics) {
  hideAllStates();
  topicsList.style.display = 'flex';
  
  // Update section title with count
  sectionTitle.innerHTML = `Detected Topics <span class="topic-count">${topics.length}</span>`;
  
  // Clear previous topics
  topicsList.innerHTML = '';
  
  // Create pill elements for each topic
  topics.forEach(topic => {
    const pill = document.createElement('span');
    pill.className = 'topic-pill';
    pill.textContent = topic;
    topicsList.appendChild(pill);
  });
}

// Show loading state
function showLoading() {
  hideAllStates();
  loading.style.display = 'flex';
  sectionTitle.innerHTML = 'Detected Topics';
}

// Show no topics state
function showNoTopics() {
  hideAllStates();
  noTopics.style.display = 'flex';
  sectionTitle.innerHTML = 'Detected Topics';
}

// Show error state
function showError(message) {
  hideAllStates();
  errorMessage.style.display = 'flex';
  errorText.textContent = message;
  sectionTitle.innerHTML = 'Detected Topics';
}

// Hide all states
function hideAllStates() {
  loading.style.display = 'none';
  noTopics.style.display = 'none';
  errorMessage.style.display = 'none';
  topicsList.style.display = 'none';
}
