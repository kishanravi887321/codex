# 👁️ Codex - Problem Topic Extractor

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-yellow.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)

**🚀 One-Click DSA Problem Tracking for Competitive Programmers**

[🌐 Open CPCoders Dashboard](https://cp.saksin.online) · [📖 How to Use](#-quick-start) · [🐛 Report Bug](https://github.com/yourusername/codex/issues)

---

<img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode"/>
<img src="https://img.shields.io/badge/GeeksforGeeks-2F8D46?style=for-the-badge&logo=geeksforgeeks&logoColor=white" alt="GFG"/>
<img src="https://img.shields.io/badge/InterviewBit-1A73E8?style=for-the-badge&logo=interviewbit&logoColor=white" alt="InterviewBit"/>

</div>

---

## 🎬 What is Codex?

**Codex** is a Chrome extension that supercharges your DSA preparation by automatically capturing problems from popular coding platforms and syncing them to your personal **[CPCoders Dashboard](https://cp.saksin.online)**.

> 💡 **Stop manually tracking problems!** Let Codex do the work while you focus on solving.

---

## ⚡ Quick Start

Getting started takes less than 2 minutes!

### Step 1: Install the Extension

```
📁 Download → 🧩 Load in Chrome → ✅ Done!
```

1. **Clone or Download** this repository
   ```bash
   https://github.com/kishanravi887321/codex.git
   ```

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/` in your browser
   - Enable **Developer Mode** (toggle in top-right)

3. **Load the Extension**
   - Click **"Load unpacked"**
   - Select the `codeex` folder

4. **Pin it** (optional but recommended)
   - Click the puzzle icon 🧩 in Chrome toolbar
   - Pin **"Codex - Problem Topic Extractor"**

---

### Step 2: Connect to CPCoders

```
🌐 Login → 🔄 Refresh → ✅ Connected!
```

1. **Go to** [cp.saksin.online](https://cp.saksin.online)
2. **Login** to your account (or create one)
3. **Refresh** the page
4. **Done!** The floating eye icon will show a ✅ green checkmark

> 🎉 That's it! The extension automatically syncs your authentication. No extra steps needed!

---

### Step 3: Start Capturing Problems

```
📝 Open Problem → 👁️ Click Eye → 🚀 Synced!
```

1. Go to any problem on **LeetCode**, **GeeksForGeeks**, or **InterviewBit**
2. Look for the **floating eye icon** (bottom-right corner)
3. **Click it** to capture & sync the problem
4. Check your dashboard at [cp.saksin.online/problems](https://cp.saksin.online/problems)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Smart Extraction
- Problem name & number
- Difficulty level
- Topic tags (Array, DP, Trees...)
- Company tags
- Solved/Unsolved status
- Direct problem URL

</td>
<td width="50%">

### 🔄 Seamless Sync
- One-click capture
- Auto upsert (create or update)
- Real-time sync to dashboard
- Works offline (queues sync)

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Beautiful UI
- Animated floating eye icon
- Draggable anywhere on screen
- Visual success/error feedback
- Dark theme compatible

</td>
<td width="50%">

### 🔐 Secure Auth
- Auto token sync
- Secure storage
- One-time setup
- No manual token copying

</td>
</tr>
</table>

---

## 🎨 Visual Feedback

The floating eye icon tells you everything:

| Animation | Meaning |
|:---------:|---------|
| 🔵 **Blue Pulse** | Ready to capture |
| ✅ **Green Check** | Problem saved successfully |
| 🟡 **Yellow Check** | Problem updated |
| ❌ **Red X** | Error - click "Reconnect" link |
| 💜 **Purple Glow** | On CPCoders dashboard |

---

## 🌐 Supported Platforms

| Platform | What's Captured |
|:--------:|-----------------|
| <img src="https://leetcode.com/favicon.ico" width="20"/> **LeetCode** | Name, Number, Topics, Difficulty, Solved Status |
| <img src="https://www.geeksforgeeks.org/favicon.ico" width="20"/> **GeeksForGeeks** | Name, Topics, Difficulty, Company Tags |
| <img src="https://www.interviewbit.com/favicon.ico" width="20"/> **InterviewBit** | Name, Topics, Difficulty, Company Tags |

---

## 📁 Project Structure

```
codex/
├── 📄 README.md
├── 📄 LICENSE
└── 📁 codeex/                    # Extension source
    ├── 📄 manifest.json          # Chrome MV3 manifest
    ├── 📄 popup.html/css/js      # Extension popup
    ├── 📄 content.css            # Injected styles
    ├── 📁 icons/                 # Extension icons
    └── 📁 modules/
        ├── 📄 namespace.js       # Global namespace
        ├── 📄 main.js            # Entry point
        ├── 📄 extractor.js       # Platform router
        ├── 📄 api.js             # Backend API
        ├── 📄 icon.js            # Floating icon
        ├── 📄 panel.js           # Info panel
        ├── 📄 styles.js          # Dynamic styles
        ├── 📄 auth-sync.js       # Auth sync
        └── 📁 extractors/
            ├── 📄 leetcode.js
            ├── 📄 gfg.js
            └── 📄 interviewbit.js
```

---

## 🔧 Tech Stack

- **Extension**: Chrome Manifest V3
- **Frontend**: Vanilla JS (no dependencies!)
- **Backend**: [cpbackend.saksin.online](https://cpbackend.saksin.online)
- **Dashboard**: [cp.saksin.online](https://cp.saksin.online)

---

## ❓ Troubleshooting

<details>
<summary><b>🔴 Eye icon not appearing?</b></summary>

- Make sure you're on a **problem page** (not the problem list)
- Refresh the page after installing
- Check if extension is enabled in `chrome://extensions`
</details>

<details>
<summary><b>🔴 "Reconnect Extension" error?</b></summary>

1. Go to [cp.saksin.online](https://cp.saksin.online)
2. Make sure you're logged in
3. Refresh the page
4. Go back to the coding platform and refresh
</details>

<details>
<summary><b>🔴 Problems not syncing?</b></summary>

- Check your internet connection
- Verify you're logged in to CPCoders
- Open browser console (F12) for error details
</details>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. 💻 Make your changes
4. 📤 Submit a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🔗 Quick Links

[🌐 CPCoders Dashboard](https://cp.saksin.online) · [📊 Your Problems](https://cp.saksin.online/problems) · [👤 Profile](https://cp.saksin.online/profile)

---

**Made with ❤️ for Competitive Programmers**

⭐ Star this repo if you find it helpful!

</div>
