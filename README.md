# Codex - Problem Topic Extractor

<p align="center">
  <img src="codeex/icons/icon128.svg" alt="Codex Logo" width="128" height="128">
</p>

<p align="center">
  <strong>A Chrome Extension for DSA Problem Tracking</strong><br>
  Seamlessly extract and sync coding problems from LeetCode, GeeksForGeeks, and InterviewBit to your CPCoders dashboard.
</p>

<p align="center">
  <a href="https://cp.saksin.online">🌐 CPCoders Dashboard</a> •
  <a href="#installation">📦 Installation</a> •
  <a href="#features">✨ Features</a> •
  <a href="#usage">📖 Usage</a>
</p>

---

## 🎯 What is Codex?

**Codex** is a browser extension that works alongside the [CPCoders Dashboard](https://cp.saksin.online) - a comprehensive platform for managing your DSA (Data Structures & Algorithms) problem-solving journey.

When you're solving problems on coding platforms like LeetCode, GeeksForGeeks, or InterviewBit, Codex automatically extracts problem details and syncs them to your personal dashboard with just one click.

---

## ✨ Features

### 🔍 Problem Extraction
- **One-Click Capture**: Click the floating eye icon to instantly capture problem details
- **Auto-Detection**: Automatically detects problem name, number, difficulty, and topics
- **Multi-Platform Support**: Works on LeetCode, GeeksForGeeks, and InterviewBit

### 📊 Data Captured
| Field | Description |
|-------|-------------|
| Problem Name | Full problem title |
| Problem Number | Unique problem identifier |
| Difficulty | Easy / Medium / Hard |
| Topics | Algorithm/DS tags (Array, DP, Trees, etc.) |
| Company Tags | Companies that asked this problem |
| Solved Status | Whether you've solved the problem |
| Problem URL | Direct link to the problem |

### 🔄 Seamless Sync
- **Real-time Sync**: Problems are instantly synced to your CPCoders dashboard
- **Upsert Logic**: Automatically creates new entries or updates existing ones
- **Visual Feedback**: Animated icon shows success (✓) or error (✗) status

### 🎨 Beautiful UI
- **Floating Eye Icon**: Draggable icon that stays out of your way
- **Animated Feedback**: Smooth animations for all interactions
- **Dark Theme**: Matches modern coding platforms

---

## 📦 Installation

### Method 1: Load Unpacked (Developer Mode)

1. **Download/Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/codex.git
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `codeex` folder from this repository

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Pin "Codex - Problem Topic Extractor"

---

## 🔐 Authentication Setup

Codex requires authentication with your CPCoders account to sync problems.

### Step 1: Create an Account
1. Visit [cp.saksin.online](https://cp.saksin.online)
2. Sign up or log in to your account

### Step 2: Connect the Extension
1. After logging in, go to your **Profile** page
2. Click on **"Connect Extension"** or navigate to the token page
3. The extension will automatically detect your authentication
4. You'll see a **green checkmark animation** on the floating icon confirming successful connection

### Step 3: Verify Connection
- The floating eye icon on `cp.saksin.online` shows connection status:
  - ✅ **Green pulse**: Successfully connected
  - ❌ **Red X + "Reconnect" link**: Connection issue - click to re-authenticate

---

## 📖 Usage

### On Coding Platforms (LeetCode, GFG, InterviewBit)

1. **Navigate to a Problem Page**
   - Open any problem on LeetCode, GeeksForGeeks, or InterviewBit

2. **Look for the Floating Eye Icon**
   - A circular eye icon appears in the bottom-right corner
   - You can drag it anywhere on the screen

3. **Click to Capture**
   - Click the eye icon to extract and sync the problem
   - **Green animation** = New problem saved
   - **Yellow animation** = Existing problem updated
   - **Red animation** = Error (check authentication)

4. **View on Dashboard**
   - Visit [cp.saksin.online/problems](https://cp.saksin.online/problems) to see all your captured problems

### On CPCoders Dashboard

- The floating icon appears on the left side (near sidebar)
- It shows your extension connection status
- Click for status information

---

## 🌐 Supported Platforms

| Platform | URL | Features |
|----------|-----|----------|
| **LeetCode** | leetcode.com | Problem name, number, topics, difficulty, solved status |
| **GeeksForGeeks** | geeksforgeeks.org | Problem name, topics, difficulty, company tags |
| **InterviewBit** | interviewbit.com | Problem name, topics, difficulty, company tags |

---

## 🏗️ Project Structure

```
codex/
├── codeex/                    # Extension source code
│   ├── manifest.json          # Chrome extension manifest (MV3)
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Popup styles
│   ├── popup.js               # Popup logic
│   ├── content.css            # Content script styles
│   ├── icons/                 # Extension icons
│   │   ├── icon16.svg
│   │   ├── icon48.svg
│   │   └── icon128.svg
│   └── modules/               # Core modules
│       ├── namespace.js       # Global Codex namespace
│       ├── main.js            # Entry point & orchestrator
│       ├── extractor.js       # Platform detection & delegation
│       ├── api.js             # Backend API communication
│       ├── icon.js            # Floating eye icon & animations
│       ├── panel.js           # Info panel UI
│       ├── styles.js          # Dynamic styling
│       ├── auth-sync.js       # Authentication sync for dashboard
│       └── extractors/        # Platform-specific extractors
│           ├── leetcode.js    # LeetCode extractor
│           ├── gfg.js         # GeeksForGeeks extractor
│           └── interviewbit.js # InterviewBit extractor
├── make.txt                   # Build/development notes
└── README.md                  # This file
```

---

## 🔧 Technical Details

### Manifest V3
This extension uses Chrome's Manifest V3 for enhanced security and performance.

### API Endpoints
- **Backend**: `https://cpbackend.saksin.online/api`
- **Frontend Dashboard**: `https://cp.saksin.online`

### Permissions
| Permission | Purpose |
|------------|---------|
| `activeTab` | Access current tab content |
| `scripting` | Inject content scripts |
| `storage` | Store authentication token |

### Host Permissions
- `https://cp.saksin.online/*` - Dashboard integration
- `https://cpbackend.saksin.online/*` - API communication

---

## 🐛 Troubleshooting

### Extension Icon Not Showing
- Make sure you're on a supported problem page (not the problem list)
- Refresh the page after installing the extension
- Check if the extension is enabled in `chrome://extensions`

### "Reconnect Extension" Error
1. Visit [cp.saksin.online](https://cp.saksin.online)
2. Log out and log back in
3. Go to Profile → Connect Extension
4. Refresh the coding platform page

### Problems Not Syncing
- Check your internet connection
- Verify you're logged in to CPCoders dashboard
- Look for error messages in the browser console (F12 → Console)

### Icon Not Draggable
- The icon becomes draggable after holding click for a moment
- Quick clicks trigger the capture action

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **CPCoders Dashboard**: [cp.saksin.online](https://cp.saksin.online)
- **Report Issues**: [GitHub Issues](https://github.com/yourusername/codex/issues)

---

<p align="center">
  Made with ❤️ for the competitive programming community
</p>
