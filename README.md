# 🧠 Cortexa

**AI-Powered Career & Skill Progression Platform**

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![Groq AI](https://img.shields.io/badge/AI-Groq_Llama_3.3-purple)

Cortexa is a modern, full-stack web application designed to help developers and professionals track their skills, discover career stagnation risks, and generate actionable, AI-driven learning roadmaps. 

## ✨ Key Features

- **🤖 AI Career Analysis**: Leverages Groq's blazing-fast LLMs to analyze your current skill profile and identify your weakest areas.
- **🗺️ Dynamic Roadmaps**: Automatically generates 14-day, step-by-step learning roadmaps tailored directly to what you need to improve.
- **📈 Skill Tracking & Dashboard**: Log technical and soft skills (with target levels) and monitor your overall progression through a sleek, interactive dashboard powered by Recharts.
- **🔐 Secure Authentication**: Includes full user registration and login flows, secured by JWT and personalized OTP (One-Time Password) email verification.
- **🎨 Premium UI/UX**: Built with Tailwind CSS v4 and Framer Motion for a highly polished, responsive, and animated user experience.

---

## 🛠️ Tech Stack

**Frontend Framework:** React 19 (Vite)  
**Styling & Animation:** Tailwind CSS v4, Framer Motion, ClickSpark, ShinyText  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (with Mongoose)  
**Authentication:** JWT, bcryptjs, Nodemailer (OTP)  
**AI Integration:** Groq SDK (Llama 3.3 70B)  
**Image APIs:** Pexels API (for roadmap visual generation)  

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (Atlas or local)
- A Groq API Key
- A Pexels API Key
- An SMTP Email Password (e.g., Gmail App Password for OTPs)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cortexa.git
cd cortexa
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Third-Party APIs
GROQ_API_KEY=your_groq_api_key
PEXELS_API_KEY=your_pexels_api_key

# Email Configuration (for OTPs)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the client folder:
```bash
cd Client
npm install
```

Create a `.env` file inside the `Client/` directory:
```env
VITE_API_BASE=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
The app will now be running at `http://localhost:5173`.

---

## ☁️ Deployment

Cortexa is designed to be easily deployed as a single web service. The Express backend is configured to statically serve the built Vite frontend.

1. Create a "Web Service" on a platform like **Render.com** or **Heroku**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm run build` *(This custom script automatically installs Client dependencies and builds the React app)*
   - **Start Command:** `npm start`
4. Copy all the variables from your `server/.env` file into the Environment Variables section of your hosting provider.
5. Deploy!

---

## 📄 License
This project is licensed under the MIT License.
