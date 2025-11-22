# FundNest 🚀

**Connecting Startups with Investors for Seamless Funding Opportunities**

FundNest is an innovative online platform designed to bridge the gap between student innovators, early-stage startups, and potential investors. It provides a streamlined environment for entrepreneurs to present their ideas and for investors to discover and fund the next big thing.

## 🌟 Key Features

### For Startups & Students
- **Detailed Profiles**: Showcase your business ideas, financial needs, and progress with visually appealing profiles.
- **Student Innovator Hub**: A dedicated section to highlight projects from students and first-time entrepreneurs.
- **Real-time Communication**: Integrated chat and video calling to connect directly with investors.
- **Scheduling & Tools**: Built-in meeting scheduler and email integration.

### For Investors
- **Dynamic Dashboard**: Browse, filter, and manage investment opportunities.
- **Portfolio Management**: Track your investments and view analytics.
- **Direct Access**: Connect with founders via video or chat instantly.

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Socket.io Client
- Simple-Peer (WebRTC)

**Backend**
- Node.js & Express
- MongoDB (Database)
- Socket.io (Real-time communication)
- Mongoose

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection string)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adnanainul/FundNest.git
   cd FundNest
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Create a `.env` file in the root directory.
   - Add your MongoDB connection string:
     ```env
     MONGO_URI=your_mongodb_connection_string
     ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   node index.js
   ```
   Server runs on `http://localhost:5001`

2. **Start the Frontend Development Server**
   Open a new terminal:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
