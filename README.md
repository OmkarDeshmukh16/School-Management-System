# Smart School Management System (SaaS Platform)

A production-grade, multi-role school management platform built with the MERN stack. Designed to digitize and automate the end-to-end administrative workflow of an educational institution, this system operates as a full SaaS product with a premium, modern UI.

## 🌟 Key Features

### 🏢 SaaS Onboarding & Super Admin Portal
- **Controlled Onboarding:** Public registration is disabled in favor of a "Request Demo" workflow for prospective schools.
- **Super Admin Dashboard:** Centralized control for platform administrators to manage demo requests, onboard new schools, and oversee system health.
- **Integrated Payments:** Built-in **Razorpay** integration. Super Admins can generate payment links from demo requests.
- **Automated Communication:** Automated email notifications sent via **Nodemailer** for payment links and onboarding steps.
- **Webhook Security:** Secure payment confirmation through signature-verified webhooks.

### 👥 Multi-Role Access Control
Secure, role-based JWT authentication with scoped permissions and dedicated dashboards for:
1. **Super Admin**: Platform management, billing, and school creation.
2. **Admin (School Level)**: School-specific management, staff, and student administration.
3. **Teacher / Clerk**: Academic and administrative operations.
4. **Student**: Portal for grades, attendance, notices, and fee tracking.

### 🎓 Core School Management Suite
- **Automated Document Generation:** Instantly generate Leaving Certificates and Bonafide Certificates as PDFs (`jsPDF`), eliminating manual drafting.
- **Bulk Data Operations:** Import up to 1,000 student/staff records in a single operation via structured Excel/CSV file upload (`xlsx`, `multer`).
- **Financial Ledger:** Track fee payments with real-time individual payment status per student.
- **Academic Suite:** Manage marks entry, report generation, and student attendance.
- **Grievance Management:** Built-in ticketing system for students to raise complaints and for admins to track and resolve them.
- **Notice Board:** Broadcast official notices and holiday alerts to all users instantly.

### 🎨 Premium UI / UX
- **Modern Aesthetics:** Dark-mode, glassmorphic UI with a vibrant purple-blue gradient system, achieving an enterprise-level SaaS look and feel.
- **Fluid Animations:** Sophisticated, smooth micro-animations and page transitions powered by **Framer Motion**.
- **Interactive Dashboards:** Beautiful data visualization using **Recharts** and modern UI components via **Material-UI (MUI)**.

## 🛠️ Tech Stack

**Frontend:**
- React.js (v18)
- Redux Toolkit (State Management)
- Material-UI (MUI) & Styled Components
- Framer Motion (Animations)
- Recharts (Data Visualization)
- jsPDF & jspdf-autotable (PDF Generation)
- React Router DOM

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcrypt (Authentication)
- Razorpay (Payment Gateway)
- Nodemailer (Email Automation)
- Multer & csv-parser (File Uploads & Processing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)
- Razorpay Account (for payments)
- SMTP Credentials (for Nodemailer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SMS
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_smtp_email
   EMAIL_PASS=your_smtp_password
   ```
   Start the backend server:
   ```bash
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the React development server:
   ```bash
   npm start
   ```

## 📄 License
This project is licensed under the ISC License.
