# AI-Driven Inventory Forecasting System

AI-powered inventory management system that forecasts inventory needs based on sales history and trend analysis.

**Live Demo URL**: https://stock-mind-beta.vercel.app/

## 🚀 Features

### ✅ Implemented
- **CSV Upload**: Import historical sales data via Dashboard
- **MongoDB Storage**: Sales records and product catalog stored in MongoDB Atlas
- **AI Trend Analysis**: OpenAI GPT-4o-mini for sales trend analysis and demand forecasting
- **Interactive Charts**: Visualize forecasts using Recharts (LineChart, BarChart)
- **Reorder Alerts**: Automatic alerts when predicted stock falls below threshold
- **PDF Export**: Generate and download forecast reports as PDF
- **Dark Mode**: Full dark mode support across all pages
- **Toast Notifications**: Professional toast notifications for user feedback
- **Real-time Dashboard**: View sales metrics, trends, and key statistics

### 📊 Pages
1. **Dashboard**: Overview with CSV upload/export, sales metrics, and quick actions
2. **Forecasting**: AI-powered demand forecasting with regional and category filters
3. **Inventory**: Product management with stock levels and reorder alerts
4. **Sales History**: View and manage historical sales data
5. **Reports**: Generate custom reports (trend analysis, low stock, best sellers)
6. **Configuration**: System settings and preferences

## 🛠 Tech Stack

### Frontend
- **React.js**: Component-based UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart visualization library *(Note: Spec requested Chart.js, but Recharts provides better React integration)*
- **react-router-dom**: Client-side routing
- **jsPDF**: PDF generation
- **react-toastify**: Toast notifications
- **Lucide React**: Modern icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB object modeling
- **OpenAI SDK**: AI-powered forecasting *(Replaced Claude as per requirement flexibility)*
- **Multer**: File upload middleware

### Images
<img width="1915" height="867" alt="image" src="https://github.com/user-attachments/assets/39d9acb5-991b-4fd6-a81f-06a304a9a368" />
<img width="1918" height="869" alt="image" src="https://github.com/user-attachments/assets/80d9e6fa-a0dd-43f8-a420-52d77581c569" />
<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/512bcfab-93ed-4d88-8f62-43a392f5f8bd" />
<img width="1904" height="870" alt="image" src="https://github.com/user-attachments/assets/ad24d281-0ee4-4448-855c-2156bf7fd0d4" />
<img width="1918" height="865" alt="image" src="https://github.com/user-attachments/assets/eaf91ced-1f0b-464e-9c33-e95231971534" />
<img width="1917" height="868" alt="image" src="https://github.com/user-attachments/assets/2f43f12a-8480-4126-a10c-054f396843ac" />

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account
- OpenAI API key

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Inventory-forcast
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.jnxnr1h.mongodb.net/
OPENAI_API_KEY=sk-proj-...
PORT=5000
```

Start backend server:
```bash
npm start
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Start frontend dev server:
```bash
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Inventory-forcast/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── forecastController.js # AI forecasting logic
│   │   ├── productController.js  # Product CRUD
│   │   ├── reportController.js   # Report generation
│   │   └── salesController.js    # Sales data management
│   ├── models/
│   │   ├── Product.js            # Product schema
│   │   └── Sale.js               # Sale schema
│   ├── routes/
│   │   ├── forecast.js           # /api/forecast
│   │   ├── products.js           # /api/products
│   │   ├── reports.js            # /api/reports
│   │   └── sales.js              # /api/sales
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handling
│   ├── scripts/
│   │   └── seed.js               # Database seeding
│   └── server.js                 # Express app entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartCard.jsx     # Reusable chart container
│   │   │   ├── DataTable.jsx     # Data grid component
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   └── StatCard.jsx      # Metric cards
│   │   ├── context/
│   │   │   └── ThemeContext.jsx  # Dark mode context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Forecasting.jsx   # AI forecasting
│   │   │   ├── Inventory.jsx     # Product inventory
│   │   │   ├── SalesHistory.jsx  # Sales records
│   │   │   ├── Reports.jsx       # Report generation
│   │   │   └── Configuration.jsx # Settings
│   │   ├── utils/
│   │   │   ├── api.js            # API client
│   │   │   ├── helpers.js        # Utility functions
│   │   │   └── toastNotification.jsx # Toast helpers
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   └── package.json
```

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=<your-mongodb-connection-string>
OPENAI_API_KEY=<your-openai-api-key>
PORT=5000
```

**Frontend (if needed)**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_PRODUCT_MANAGEMENT=true
```


## 📄 License

MIT License

Built with ❤️ Gaurav
