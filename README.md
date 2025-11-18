# Unified Civic Voice Platform | एकीकृत नागरिक आवाज मंच

A complete municipal complaint management system with AI-powered voice interactions, multi-role access, and intelligent complaint routing.

## 🌟 Features

### 1. **Rural Kiosk Portal** (Voice-Only Interface)
- 100% voice-driven interface with Hindi TTS/STT
- 3-step complaint submission (Name → Problem → Address)
- Real-time visual feedback during voice interaction
- Automatic photo capture simulation
- AI-powered category detection
- **No login required** - Accessible to all citizens

### 2. **Officer Portal** 🔐
- **Secure login system** with username/password authentication
- Dashboard with complaint statistics
- Status management (pending → in-progress → resolved)
- Mandatory remark system for status updates
- Category change request feature
- Complete remark history tracking
- View only assigned complaints (department-specific)
- Logout functionality

### 3. **Super Admin Dashboard** 🔒
- **Strong authentication** with admin credentials
- System-wide overview and statistics
- Officer management (create, view, track workload)
- Category change approval workflow
- Department-wise complaint distribution
- Real-time monitoring
- Secure logout with session management

### 4. **Citizen Portal**
- Public transparency - view all complaints
- Filter by status and search functionality
- Track complaint progress
- Read-only access for citizens

### 5. **AI ChatBot**
- Available in all portals
- Document requirement assistance
- Process guidance for municipal services
- Knowledge base for 8+ services

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Modern browser (Chrome/Edge recommended for voice features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd someeee
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 🎯 Demo Credentials

### 🔐 Super Admin Login:
- **Username**: `superadmin`
- **Password**: `admin@2025`

### 👮 Officer Portal Login:
- **Electricity Dept**: `raj.patil` / `pass123`
- **Water Supply Dept**: `priya.sharma` / `pass123`
- **Medical Dept**: `amit.kumar` / `pass123`
- **Road Maintenance**: `sunita.d` / `pass123`
- **Garbage Collection**: `vikas.y` / `pass123`
- **Infrastructure Dept**: `ramesh.k` / `pass123`
- **Safety/Security Dept**: `deepak.s` / `pass123`

### 🏛️ Citizen Portal:
- No login required - public access for transparency

## 🔧 Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Voice**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **State Management**: React useState
- **Build Tool**: Vite
- **Storage**: In-memory (upgradeable to localStorage)

## 📱 Portals Overview

### 1. Rural Kiosk
**Path**: Click "Rural Kiosk" on home screen

**How to Use**:
1. Click "START" button
2. Speak your name when prompted (in Hindi or English)
3. Describe your problem
4. Tell your address
5. Review and submit

**Note**: Requires microphone access. Best experience in Chrome/Edge browsers.

### 2. Officer Portal
**Path**: Click "Officer Portal" on home screen

**Features**:
- View assigned complaints only
- Add remarks (mandatory for status updates)
- Change status: pending → in-progress → resolved
- Request category changes with reason
- Track all previous remarks

### 3. Super Admin Dashboard
**Path**: Click "Super Admin" on home screen

**Features**:
- System overview with statistics
- Create new officers
- Approve/reject category change requests
- Monitor all complaints
- View department-wise distribution

### 4. Citizen Portal
**Path**: Click "Citizen Portal" on home screen

**Features**:
- View all complaints (transparency)
- Search and filter
- Track complaint status
- Read remarks and progress updates

## 🤖 AI Features

### Category Detection
The system automatically detects complaint categories using AI:
- **Medical**: ambulance, hospital, emergency → CRITICAL priority
- **Electricity**: light, power, transformer → MEDIUM/HIGH priority
- **Water**: pipe, leak, supply → HIGH priority
- **Road**: pothole, street → MEDIUM/HIGH priority
- **Garbage**: waste, trash → MEDIUM priority
- **Safety**: theft, crime → HIGH priority
- **Infrastructure**: default category

### Auto-Assignment
Complaints are automatically assigned to officers based on:
- Department match
- Current workload (load balancing)
- Least busy officer selection

### ChatBot Knowledge Base
AI assistant provides information on:
- Birth Certificate
- Water Connection
- Ration Card
- Property Tax
- Trade License
- Death Certificate
- Building Plan
- Electricity Connection

## 📂 Project Structure

```
src/
├── components/
│   ├── RoleSelector.jsx        # Landing page
│   ├── RuralKiosk.jsx          # Voice interface
│   ├── OfficerPortal.jsx       # Officer dashboard
│   ├── SuperAdminDashboard.jsx # Admin panel
│   ├── CitizenPortal.jsx       # Public tracking
│   └── ChatBot.jsx             # AI assistant
├── utils/
│   ├── voiceUtils.js           # Voice synthesis/recognition
│   ├── categoryDetection.js   # AI category detection
│   └── assignmentLogic.js     # Officer assignment
├── data/
│   ├── initialComplaints.js   # Sample complaints
│   ├── initialOfficers.js     # Sample officers
│   └── chatbotKnowledge.js    # Knowledge base
├── styles/
│   └── index.css               # Tailwind CSS
├── App.jsx                      # Main app component
└── main.jsx                     # Entry point
```

## 🎨 Design Features

### Color Palette
- **Primary Green** (#10b981): Kiosk, success states
- **Primary Blue** (#3b82f6): Officers, info states
- **Primary Purple** (#a855f7): Admin, AI elements
- **Alert Red** (#ef4444): Critical, listening state
- **Warning Yellow** (#f59e0b): Pending status

### Animations
- Pulsing microphone during voice listening
- Animated sound wave bars during AI speech
- Smooth transitions between steps
- Progress bar fill animations
- Hover scale effects on buttons

## 🌐 Browser Support

### Voice Features
- ✅ Chrome (recommended)
- ✅ Edge (recommended)
- ✅ Safari (limited)
- ❌ Firefox (no Hindi support)

### General Features
- ✅ All modern browsers
- ✅ Mobile responsive

## 🔒 Security Notes

- Passwords are stored in plain text (demo only)
- No authentication backend (in-memory only)
- For production: implement proper auth, encryption, and backend

## 📈 Future Enhancements

1. **Backend Integration**
   - RESTful API
   - Database (MongoDB/PostgreSQL)
   - Real-time updates (WebSocket)

2. **Advanced Features**
   - Real camera integration
   - GPS location capture
   - SMS/Email notifications
   - Data export (CSV/PDF)
   - Analytics dashboard with charts

3. **Multi-language**
   - Marathi support
   - English voice interface
   - Regional language options

4. **Offline Support**
   - Service workers
   - Local storage sync
   - Queue system for offline submissions

## 🐛 Troubleshooting

### Voice Recognition Not Working
- Ensure microphone permissions are granted
- Use Chrome or Edge browser
- Check microphone in system settings
- Speak clearly in Hindi

### Complaints Not Showing
- Check if you're logged in (Officer Portal)
- Verify you have assigned complaints
- Refresh the page

### ChatBot Not Responding
- Check console for errors
- Try refreshing the page
- Ensure query matches knowledge base topics

## 📝 License

This project is for educational and demonstration purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for Rural India | ग्रामीण भारत के लिए बनाया गया**
