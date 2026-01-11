// DOM Elements
const questionCard = document.getElementById('question-card');
const questionNumber = document.getElementById('question-number');
const questionName = document.getElementById('question-name');
const questionLink = document.getElementById('question-link');
const topicsList = document.getElementById('topics-list');
const topicsTitle = document.getElementById('topics-title');
const loading = document.getElementById('loading');
const noTopics = document.getElementById('no-topics');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const refreshBtn = document.getElementById('refresh-btn');
const copyBtn = document.getElementById('copy-btn');

// Store current problem data for copy functionality
let currentProblemData = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  extractProblemData();
});

// Refresh button click handler
refreshBtn.addEventListener('click', () => {
  extractProblemData();
});

// Copy button click handler
copyBtn.addEventListener('click', () => {
  if (currentProblemData) {
    copyToClipboard(JSON.stringify(currentProblemData, null, 2));
  }
});

// Main function to extract problem data from the active tab
async function extractProblemData() {
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
      showNoData();
      return;
    }

    // Inject and execute the content script to extract problem data
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractDataFromPage
    });

    if (results && results[0] && results[0].result) {
      const data = results[0].result;
      
      if (data.name || data.topics.length > 0) {
        displayProblemData(data);
      } else {
        showNoData();
      }
    } else {
      showNoData();
    }
  } catch (error) {
    console.error('Error extracting problem data:', error);
    showError('Unable to access page content');
  }
}

// Function to be injected into the page
function extractDataFromPage() {
  const data = {
    number: null,
    name: null,
    url: null,
    topics: [],
    solved: false
  };

  // Extract question info using scoped selector (future-proof)
  // div.text-title-large is the semantic container for the problem header
  const titleAnchor = document.querySelector(
    'div.text-title-large a[href^="/problems/"]'
  );
  
  if (titleAnchor) {
    const fullText = titleAnchor.innerText.trim();
    const href = titleAnchor.getAttribute('href');
    
    // Build full URL
    data.url = 'https://leetcode.com' + href;
    
    // Parse question number and name using regex (format: "85. Maximal Rectangle")
    const match = fullText.match(/^(\d+)\.\s+(.*)$/);
    
    if (match) {
      data.number = match[1];
      data.name = match[2];
    } else {
      data.name = fullText;
    }
  }

  // Extract topics using semantic selector (future-proof)
  const topicElements = document.querySelectorAll('a[href^="/tag/"]');
  const topics = Array.from(topicElements)
    .map(el => el.innerText.trim())
    .filter(topic => topic.length > 0);
  
  // Remove duplicates
  data.topics = [...new Set(topics)];

  // Check if problem is solved
  const allDivs = document.querySelectorAll('div');
  for (let i = 0; i < allDivs.length; i++) {
    if (allDivs[i].innerText.trim() === 'Solved') {
      data.solved = true;
      break;
    }
  }

  return data;
}

// Display problem data in the UI
function displayProblemData(data) {
  hideAllStates();
  currentProblemData = data;
  
  // Show question card if we have question info
  if (data.name) {
    questionCard.style.display = 'block';
    questionNumber.textContent = data.number ? `#${data.number}` : '';
    questionName.textContent = data.name;
    questionLink.href = data.url || '#';
    questionLink.title = data.url || '';
    
    // Show/hide solved badge
    const solvedBadge = document.getElementById('solved-badge');
    if (solvedBadge) {
      solvedBadge.style.display = data.solved ? 'inline-flex' : 'none';
    }
  } else {
    questionCard.style.display = 'none';
  }
  
  // Show topics if we have any
  if (data.topics.length > 0) {
    topicsTitle.innerHTML = `Topics <span class="topic-count">${data.topics.length}</span>`;
    topicsTitle.style.display = 'block';
    topicsList.style.display = 'flex';
    
    // Clear previous topics
    topicsList.innerHTML = '';
    
    // Create pill elements for each topic
    data.topics.forEach(topic => {
      const pill = document.createElement('span');
      pill.className = 'topic-pill';
      pill.textContent = topic;
      topicsList.appendChild(pill);
    });
  } else {
    topicsTitle.style.display = 'none';
    topicsList.style.display = 'none';
  }
  
  // Show copy button
  copyBtn.style.display = 'flex';
}

// Show loading state
function showLoading() {
  hideAllStates();
  loading.style.display = 'flex';
}

// Show no data state
function showNoData() {
  hideAllStates();
  noTopics.style.display = 'flex';
}

// Show error state
function showError(message) {
  hideAllStates();
  errorMessage.style.display = 'flex';
  errorText.textContent = message;
}

// Hide all states
function hideAllStates() {
  loading.style.display = 'none';
  noTopics.style.display = 'none';
  errorMessage.style.display = 'none';
  questionCard.style.display = 'none';
  topicsTitle.style.display = 'none';
  topicsList.style.display = 'none';
  copyBtn.style.display = 'none';
  currentProblemData = null;
}

// Copy to clipboard helper
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // Show feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Copied!
    `;
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('copied');
    }, 1500);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
