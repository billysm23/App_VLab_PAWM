# CT Lab (Computational Thinking Virtual Lab)

CT Lab is an interactive mobile application designed to help users learn computational thinking concepts through a structured, engaging learning experience. The app provides lessons, quizzes, and progress tracking to enhance computational thinking skills essential for problem-solving in technology and everyday life.

## 🌟 Features

- **Interactive Learning Modules**
  - Structured lessons with progressive difficulty
  - Interactive quizzes for knowledge assessment
  - Real-time feedback and progress tracking
  - Prerequisites system for guided learning

- **User Experience**
  - Dark/Light theme support
  - Responsive design for various screen sizes
  - Intuitive navigation with bottom navbar
  - Progress visualization

- **Authentication & Security**
  - Secure user registration and login
  - JWT-based authentication
  - Session management
  - Rate limiting and security headers

## 🛠️ Technology Stack

### Frontend
- React Native & Expo
- React Navigation
- AsyncStorage
- Linear Gradient
- React Native Gesture Handler

### Backend
- Node.js & Express
- Supabase (Backend-as-a-Service)
- PostgreSQL Database
- JWT Authentication

### Development & Deployment
- Expo Application Services (EAS)
- Expo Go (development & testing)
- Over-the-Air (OTA) updates

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd APP_VLab_PAWM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a .env file in the root directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Application

- For development:
  ```bash
  npm start
  ```

- For backend server only:
  ```bash
  npm run server
  ```

## 📱 App Structure

```
APP_VLab_PAWM/
├── assets/                 # Images and static assets
├── components/            # Reusable UI components
├── contexts/              # React contexts
├── screens/               # App screens/pages
├── server/                # Backend server code
│   ├── config/           # Server configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── services/             # API and storage services
└── App.js               # Root component
```

## 🎨 UI/UX Features

- Professional color scheme with dark blue (#001F3F) and light blue (#60a5fa)
- Responsive typography with system fonts
- Dark/Light mode support
- Loading states and error handling
- Consistent interactive elements

## 🔒 Security Features

- JWT-based authentication
- Session management
- Rate limiting
- CORS configuration
- Security headers (Helmet)
- Input validation

## 👥 Contributors

- Billy Samuel Setiawan (18222039)
- Daffari Adiyatma (18222003)

## 📄 License

This project is licensed under the 0BSD License.

## 🤝 Acknowledgments

Special thanks to all contributors and the educational community for supporting the development of CT Lab.