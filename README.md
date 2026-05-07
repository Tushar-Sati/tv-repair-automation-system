<div align="center">

# 📺 TV Repair Workflow Automation System

### *From Paper Registers to Smart Automation — Never Forget a Repair Again*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Google Sheets](https://img.shields.io/badge/Google_Sheets-API_v4-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)](https://developers.google.com/sheets/api)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Automation-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://pypi.org/project/pywhatkit/)
[![Windows](https://img.shields.io/badge/Task_Scheduler-Windows-0078D4?style=for-the-badge&logo=windows&logoColor=white)](https://docs.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)]()

---

> **Automate your TV repair shop's customer communication using Google Sheets + Python + WhatsApp.**  
> Zero missed updates. Zero manual follow-ups. Zero forgotten repairs.

</div>

---

## 📌 Table of Contents

- [🔥 Problem Statement](#-problem-statement)
- [💡 Solution](#-solution)
- [✅ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🔄 Workflow Diagram](#-workflow-diagram)
- [📊 Spreadsheet Schema](#-spreadsheet-schema)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔐 Environment Configuration](#-environment-configuration)
- [▶️ How to Run](#️-how-to-run)
- [📸 Screenshots](#-screenshots)
- [🗺️ Future Roadmap](#️-future-roadmap)
- [🤝 Contributing](#-contributing)
- [👤 Author](#-author)

---

## 🔥 Problem Statement

In traditional TV repair shops, all repair entries are recorded in **physical registers**.  
This old-school approach leads to serious operational problems:

| ❌ Problem | 💢 Impact |
|---|---|
| TVs get forgotten in the queue | Delayed repairs, unhappy customers |
| No automatic status updates | Customers call repeatedly for updates |
| Manual communication is slow | High workload for staff |
| No searchable history | Hard to track parts, warranties, serial numbers |
| Human error in register entries | Lost jobs, billing disputes |

> *"The customer called 5 times this week asking if their TV is ready."*  
> — Every repair shop owner ever.

---

## 💡 Solution

**TV Repair Workflow Automation System** replaces the physical register with a **Google Sheet as a live database** and uses **Python automation** to:

- 📋 Track all repair jobs in real time
- 🤖 Automatically detect pending jobs that need updates
- 📲 Send personalized WhatsApp messages to customers
- ✅ Mark messages as `SENT` so no duplicate messages go out
- 🔁 Run on a schedule via **Windows Task Scheduler** — fully hands-free

---

## ✅ Features

```
🚀 Core Automation
```

- [x] 📥 Fetch repair job data directly from Google Sheets via API
- [x] 🔍 Detect pending repair jobs that need customer updates
- [x] 🚚 Skip rows where `DELIVER` is marked (already delivered TVs)
- [x] 📵 Skip rows with missing or invalid phone numbers
- [x] 💬 Generate dynamic, personalized messages based on repair `STATUS`
- [x] 📺 Include TV `BRAND` in every customer message for clarity
- [x] 📲 Send WhatsApp messages automatically using **PyWhatKit**
- [x] ✅ Auto-mark `MESSAGE_STATUS` as `SENT` in Google Sheets after dispatch
- [x] ⏰ Fully scheduled automation via **Windows Task Scheduler**
- [x] 🌐 Supports multiple WhatsApp accounts (browser-based session)

```
🧠 Smart Logic
```

| Status Code | Meaning | Message Sent |
|---|---|---|
| `OK` | ✅ Repaired successfully | *"Your [BRAND] TV is ready for pickup!"* |
| `NR` | ❌ Not repairable | *"Unfortunately, your [BRAND] TV cannot be repaired."* |
| *(blank)* | 🔧 Under process | *"Your [BRAND] TV is currently under repair. We'll update you soon."* |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   TV REPAIR AUTOMATION SYSTEM                   │
├──────────────────────┬──────────────────────────────────────────┤
│   DATA LAYER         │   AUTOMATION LAYER                       │
│                      │                                          │
│  ┌───────────────┐   │   ┌──────────────────────────────────┐   │
│  │ Google Sheets │◄──┼───│  Python Script (main.py)         │   │
│  │  (Live DB)    │   │   │  - Read rows via Sheets API      │   │
│  └───────┬───────┘   │   │  - Apply status filters          │   │
│          │           │   │  - Build dynamic messages        │   │
│          ▼           │   │  - Trigger WhatsApp send         │   │
│  ┌───────────────┐   │   │  - Write SENT status back        │   │
│  │ gspread /     │   │   └──────────────┬───────────────────┘   │
│  │ google-auth   │   │                  │                        │
│  └───────────────┘   │                  ▼                        │
│                      │   ┌──────────────────────────────────┐   │
│   SCHEDULER LAYER    │   │  PyWhatKit → WhatsApp Web        │   │
│                      │   │  (Browser automation)            │   │
│  ┌───────────────┐   │   └──────────────────────────────────┘   │
│  │ Windows Task  │───┼──► Runs script on defined schedule        │
│  │ Scheduler     │   │                                          │
│  └───────────────┘   │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

---

## 🔄 Workflow Diagram

```
START
  │
  ▼
┌─────────────────────┐
│  Read Google Sheet   │
│  (All Repair Rows)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     YES
│  DELIVER == "YES"?  │──────────► SKIP ROW
└─────────┬───────────┘
          │ NO
          ▼
┌──────────────────────────┐     YES
│  MESSAGE_STATUS == SENT? │──────► SKIP ROW
└─────────┬────────────────┘
          │ NO
          ▼
┌──────────────────────────┐     YES
│  PHONE_NUMBER missing?   │──────► SKIP ROW
└─────────┬────────────────┘
          │ NO
          ▼
┌──────────────────────────┐
│  Check STATUS Field      │
│  OK / NR / Blank         │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│  Build Dynamic Message   │
│  (Include BRAND + STATUS)│
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│  Send WhatsApp Message   │
│  via PyWhatKit           │
└─────────┬────────────────┘
          │
          ▼
┌──────────────────────────┐
│  Update MESSAGE_STATUS   │
│  = "SENT" in Sheet       │
└─────────┬────────────────┘
          │
          ▼
   Process Next Row
          │
          ▼
         END
```

---

## 📊 Spreadsheet Schema

The Google Sheet acts as the central database. Below is the column structure:

| # | Column Name | Type | Description |
|---|---|---|---|
| 1 | `DATE` | Date | Date the TV was received |
| 2 | `JOB_NUMBER` | String | Unique repair job ID |
| 3 | `PHONE_NUMBER` | String | Customer's WhatsApp number |
| 4 | `CUSTOMER_NAME` | String | Customer's full name |
| 5 | `BRAND` | String | TV brand (e.g., Samsung, LG) |
| 6 | `MODEL_NO` | String | TV model number |
| 7 | `SERIAL_NO` | String | TV serial number |
| 8 | `SYMPTOMS` | String | Reported issue / fault |
| 9 | `PART_REPLACE` | String | Parts replaced during repair |
| 10 | `STATUS` | String | `OK` / `NR` / *(blank)* |
| 11 | `DELIVER` | String | `YES` if TV has been delivered |
| 12 | `MESSAGE_STATUS` | String | Auto-filled `SENT` by script |

---

## 🗂️ Project Structure

```
tv-repair-automation/
│
├── 📄 main.py                    # Core automation script
├── 📄 config.py                  # Configuration constants
├── 📄 message_builder.py         # Dynamic message generation logic
├── 📄 sheets_handler.py          # Google Sheets read/write operations
├── 📄 whatsapp_sender.py         # PyWhatKit WhatsApp send wrapper
│
├── 📁 credentials/
│   └── 🔑 service_account.json  # Google API credentials (git-ignored)
│
├── 📁 logs/
│   └── 📋 automation.log         # Daily run logs
│
├── 📁 scheduler/
│   └── 🗓️ task_setup.xml         # Windows Task Scheduler config
│
├── 📁 docs/
│   ├── 🖼️ screenshots/            # UI & output screenshots
│   └── 📐 architecture.png        # System architecture diagram
│
├── 📄 requirements.txt            # Python dependencies
├── 📄 .env.example                # Environment variable template
├── 📄 .gitignore                  # Git ignore rules
└── 📄 README.md                   # This file
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- **Python 3.10+** → [Download](https://www.python.org/downloads/)
- **Google Chrome** (required by PyWhatKit for WhatsApp Web)
- **WhatsApp** account linked to WhatsApp Web
- **Google Cloud Project** with Sheets API enabled

---

### 1️⃣ Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/YOUR_USERNAME/tv-repair-automation.git

# Navigate into the project
cd tv-repair-automation
```

### 2️⃣ Create a Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

**`requirements.txt` contents:**

```txt
gspread==5.12.0
google-auth==2.22.0
google-auth-oauthlib==1.1.0
pywhatkit==5.4
python-dotenv==1.0.0
```

### 4️⃣ Set Up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → Enable **Google Sheets API**
3. Create a **Service Account** → Download `credentials.json`
4. Rename it to `service_account.json` → Place in `/credentials/`
5. **Share your Google Sheet** with the service account email

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Google Sheets
SPREADSHEET_ID=your_google_sheet_id_here
SHEET_NAME=Repairs

# WhatsApp Config
WHATSAPP_WAIT_TIME=20        # seconds before sending message
WHATSAPP_CLOSE_TAB=True

# Logging
LOG_FILE=logs/automation.log
LOG_LEVEL=INFO
```

> ⚠️ **Never commit your `.env` or `service_account.json` to GitHub.**  
> Both are already listed in `.gitignore`.

---

## ▶️ How to Run

### Run Manually

```bash
# Activate virtual environment first
venv\Scripts\activate

# Run the automation script
python main.py
```

### Schedule with Windows Task Scheduler

1. Open **Task Scheduler** → Create Basic Task
2. Set trigger: Daily at your preferred time (e.g., `10:00 AM`)
3. Action: **Start a Program**
   - Program: `C:\path\to\project\venv\Scripts\python.exe`
   - Arguments: `main.py`
   - Start in: `C:\path\to\project\`
4. Import the pre-configured XML:

```bash
# Import task via command line (run as Administrator)
schtasks /create /xml "scheduler\task_setup.xml" /tn "TVRepairAutomation"
```

### Expected Console Output

```
[2024-01-15 10:00:01] ✅ Connected to Google Sheets
[2024-01-15 10:00:02] 📋 Fetched 12 repair jobs
[2024-01-15 10:00:02] ⏭️  Skipping Row 3 — Already delivered
[2024-01-15 10:00:02] ⏭️  Skipping Row 7 — No phone number
[2024-01-15 10:00:02] ⏭️  Skipping Row 9 — Already sent
[2024-01-15 10:00:03] 📲 Sending WhatsApp to +91XXXXXXXXXX (Samsung TV - OK)
[2024-01-15 10:00:25] ✅ Message sent! Row 4 marked as SENT
[2024-01-15 10:00:26] 📲 Sending WhatsApp to +91XXXXXXXXXX (LG TV - Under Process)
[2024-01-15 10:00:48] ✅ Message sent! Row 6 marked as SENT
[2024-01-15 10:00:48] 🎉 Automation complete — 2 messages sent, 3 skipped
```

---

## 📸 Screenshots

> *Screenshots will be added after deployment. Replace placeholders below.*

### Google Sheet — Live Database
```
[ 📷 Screenshot: Google Sheet with repair entries and SENT status ]
```

### WhatsApp Message — Customer Update
```
[ 📷 Screenshot: Sample WhatsApp message received by customer ]
```

### Task Scheduler — Automated Run Config
```
[ 📷 Screenshot: Windows Task Scheduler setup for daily automation ]
```

### Console Log — Script Execution
```
[ 📷 Screenshot: Terminal output showing script run summary ]
```

---

## 🗺️ Future Roadmap

| Phase | Feature | Status |
|---|---|---|
| 🔜 v2.0 | **Web Dashboard** — View & manage all repairs via browser UI | 📋 Planned |
| 🔜 v2.1 | **Meta WhatsApp Business API** — Replace PyWhatKit for production-grade sending | 📋 Planned |
| 🔜 v2.2 | **Analytics Dashboard** — Repair stats, turnaround time, job trends | 📋 Planned |
| 🔜 v3.0 | **Technician Task Queue** — Assign jobs to specific technicians | 📋 Planned |
| 🔜 v3.1 | **AI-Powered Reminders** — Smart follow-ups based on job age & priority | 📋 Planned |
| 🔜 v3.2 | **SMS Fallback** — Auto-switch to SMS if WhatsApp delivery fails | 📋 Planned |
| 🔜 v4.0 | **Mobile App** — Technician app for real-time job updates on the go | 💡 Ideation |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add: Amazing feature description"

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

Please make sure your code follows the existing style and includes appropriate comments.

---

## 👤 Author

**TUSHAR SATI**  
📧 tusharsati77@gmail.com.com  
🌐 [LinkedIn]([https://www.linkedin.com/in/tushar-sati-3720ab242/]) | [GitHub](https://github.com/Tushar-Sati)

---

<div align="center">

### ⭐ Star this repo if it helped you or inspired your project!

*Built with ❤️ to solve a real-world problem for small repair businesses.*

---

*© 2024 TV Repair Automation System — MIT License*

</div>
