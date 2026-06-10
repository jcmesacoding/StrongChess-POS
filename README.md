# ♟️ StrongChess POS — Frontend

Frontend application for **StrongChess POS**, a Point of Sale (POS) system built to manage sales, products, customers, inventory, and business analytics through a modern dashboard interface.

Built with **Vue 3**, **Vite**, **TailwindCSS**, and **Chart.js**.

---

## 📋 Description

StrongChess POS Frontend provides a clean and responsive interface for managing business operations.

Current modules include:

* Dashboard
* Sales Management
* Customer Management
* Reports & Analytics
* Product Visualization
* Notifications (Toast System)

The frontend consumes the REST API exposed by the backend application.

---

## 🛠️ Technologies Used

* Vue 3 (Composition API)
* Vite
* Vue Router
* Axios
* TailwindCSS
* Chart.js
* JavaScript (ES6+)

---

## 🚀 Implemented Features

### ✅ Dashboard

* Business overview
* Revenue cards
* Inventory metrics
* Charts and analytics
* Recent sales
* Low stock alerts

### ✅ Sales Module

* Create sales
* Add/remove products
* Dynamic cart
* Voucher selection
* Customer selection
* Employee selection
* Real-time total calculation
* Success/Error Toast notifications

### ✅ Customer Module

* Customer listing
* Search customers
* Create customer modal
* Live updates after creation

### ✅ Reports Module

* Data visualization
* Charts with Chart.js
* Revenue analysis

### ✅ UI Features

* Responsive design
* Toast notifications
* Modal system
* Reusable components
* Clean dashboard layout

---

## 📁 Project Structure

src/

├── assets/

├── components/

│ ├── CustomerModal.vue

│ ├── ToastNotification.vue

│ └── ...

├── router/

├── services/

│ ├── api.js

│ ├── customerService.js

│ ├── salesService.js

│ ├── dashboardService.js

│ └── ...

├── views/

│ ├── DashboardView.vue

│ ├── CustomersView.vue

│ ├── SalesView.vue

│ └── ReportsView.vue

├── App.vue

└── main.js

---

## 📦 Installation

Clone repository:

```bash
git clone https://github.com/jcmesacoding/Strongchess-POS-FRONTEND.git

cd Strongchess-POS-FRONTEND
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Configuration

Create `.env`:

```env
VITE_API_URL=http://localhost:8082/api/v1
```

Example `src/services/api.js`:

```javascript
import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:5173
```

---

## 🏗️ Build for Production

Generate optimized build:

```bash
npm run build
```

Preview build locally:

```bash
npm run preview
```

---

## 🔗 Backend Repository

This frontend requires the StrongChess POS Backend running.

Backend:

```text
http://localhost:8082
```

---

## 📸 Screens

Current screens include:

* Dashboard
* Sales
* Customers
* Reports

(Add screenshots later)

---

## 🔮 Future Improvements

* Authentication & Authorization
* Product CRUD
* Employee CRUD
* Export reports (PDF / Excel)
* Dark mode
* Pagination
* Search optimization
* Mobile responsiveness improvements

---

## 👨‍💻 Author

**Juan Carlos Mesa**

Software Engineering Student • Full Stack Developer Journey

GitHub:
https://github.com/jcmesacoding

Portfolio:
https://jumedev.com


---

## 📄 License

This project is for educational and portfolio purposes.
