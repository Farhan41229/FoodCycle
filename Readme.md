# 🍽️ Food-Cycle - Food Donation Platform

A full-stack web application that connects food donors with charities and individuals in need, reducing food waste and helping communities.

## 🌟 Features

### For Restaurants
- **Easy Donation Posting** - Create and manage food donation listings
- **Donation Management** - Update, delete, and track your donations



### For Recipients
- **Browse Donations** - View available food donations
- **Pickup Coordination** - Manage pickup requests and schedules
- **Payment Integration** - Secure payment processing with Stripe
- **Request System** - Request specific donations
- **Favorites** - Save donations for later
- **Reviews** - Rate and review donations

### For Admins
- **User Management** - Manage all users and their roles
- **Donation Oversight** - Monitor and manage all donations
- **Transaction History** - Track all payment transactions
- **Request Management** - Oversee charity requests

### Additional Features
- **AI Integration** - Google GenAI for enhanced user experience
- **Real-time Updates** - Live donation status updates
- **Responsive Design** - Mobile-friendly interface
- **Authentication** - Secure user authentication with Firebase

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **React Router** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation
- **Swiper.js** - Responsive carousel and touch slider
- **React Icons** - Icon library for React
- **SweetAlert2** - Beautiful, responsive, customizable alert library
- **React Hot Toast** - Toast notifications for React
- **Firebase Auth** - Authentication service
- **Stripe** - Payment processing
- **AOS** - Animate On Scroll library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Stripe API** - Payment processing
- **Google GenAI** - AI integration
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Food-cycle_Client/
├── src/
│   ├── components/                    # Reusable UI components
│   │   ├── ErrorPage/                # 404 error page component
│   │   │   └── ErrorPage.jsx
│   │   └── ReviewCard/               # Review card component
│   │       └── ReviewCard.jsx
│   ├── context/                      # React context providers
│   │   └── AuthContext/              # Authentication context
│   │       ├── AuthContext.jsx       # Auth context definition
│   │       └── AuthProvider.jsx      # Auth provider wrapper
│   ├── firebase/                     # Firebase configuration
│   │   └── firebase.init.js          # Firebase initialization
│   ├── hooks/                        # Custom React hooks
│   │   └── UseAxiosSecure.jsx        # Secure axios hook
│   ├── layouts/                      # Page layouts
│   │   ├── AILayout.jsx              # AI feature layout
│   │   ├── AuthLayout.jsx            # Authentication layout
│   │   ├── DashBoardLayout.jsx       # Dashboard layout
│   │   └── HomeLayout.jsx            # Home page layout
│   ├── pages/                        # Application pages
│   │   ├── Add Donation/             # Add donation functionality
│   │   │   └── AddDonation.jsx
│   │   ├── Authentication/           # Auth pages
│   │   │   ├── Login/
│   │   │   │   └── Login.jsx
│   │   │   └── Register/
│   │   │       └── Register.jsx
│   │   ├── Home/                     # Home page components
│   │   │   ├── All Donations/
│   │   │   │   └── AllDonations.jsx
│   │   │   ├── Banner/
│   │   │   │   └── Banner.jsx
│   │   │   ├── Donation Details/
│   │   │   │   └── DonationDetails.jsx
│   │   │   ├── Home/
│   │   │   │   └── Home.jsx
│   │   │   ├── Review Sliders/
│   │   │   │   └── ReviewSliders.jsx
│   │   │   ├── Services/
│   │   │   │   └── Services.jsx
│   │   │   └── Stat/
│   │   │       └── Stat.jsx
│   │   ├── MyDashboard/              # Dashboard pages
│   │   │   ├── Charity Requests/
│   │   │   │   └── CharityRequests.jsx
│   │   │   ├── Manage Donations/
│   │   │   │   └── ManageDonations.jsx
│   │   │   ├── Manage Transactions/
│   │   │   │   └── ManageTransactions.jsx
│   │   │   ├── Manage Users/
│   │   │   │   └── ManageUsers.jsx
│   │   │   ├── My Pickups/
│   │   │   │   └── MyPickups.jsx
│   │   │   ├── My Requests/
│   │   │   │   └── MyRequests.jsx
│   │   │   ├── MyDonations/
│   │   │   │   └── MyDonations.jsx
│   │   │   ├── MyFavourties/
│   │   │   │   └── MyFavourites.jsx
│   │   │   ├── MyReviews/
│   │   │   │   └── MyReviews.jsx
│   │   │   ├── Payment/
│   │   │   │   ├── Payment.jsx
│   │   │   │   └── PaymentForm.jsx
│   │   │   ├── Profile/
│   │   │   │   └── Profile.jsx
│   │   │   ├── Received Donations/
│   │   │   │   └── RecievedDonations.jsx
│   │   │   ├── Transaction History/
│   │   │   │   └── Transactionhistory.jsx
│   │   │   └── UpdateDonation/
│   │   │       └── UpdateDonation.jsx
│   │   └── Shared/                   # Shared components
│   │       ├── Footer/
│   │       │   └── Footer.jsx
│   │       ├── Loading/
│   │       │   └── Loading.jsx
│   │       ├── Logo/
│   │       │   └── FoodCycleLogo.jsx
│   │       ├── Navbar/
│   │       │   └── Navbar.jsx
│   │       └── Review Modal/
│   │           └── ReviewModal.jsx
│   ├── router/                       # Routing configuration
│   │   ├── AdminRoute.jsx            # Admin route protection
│   │   ├── PrivateRoute.jsx          # Private route protection
│   │   └── router.jsx                # Main router configuration
│   ├── assets/                       # Static assets
│   │   ├── 404.jpg                   # 404 error image
│   │   ├── AuthImg.png               # Authentication image
│   │   ├── Avatar.png                # Default avatar
│   │   ├── Banner/                   # Banner images
│   │   │   ├── Banner1.png
│   │   │   ├── Banner2.png
│   │   │   ├── Banner2.webp
│   │   │   └── Banner3.png
│   │   ├── Logo/                     # Logo assets
│   │   │   ├── favicon.png
│   │   │   └── logo.png
│   │   └── react.svg                 # React logo
│   ├── App.css                       # Main app styles
│   ├── App.jsx                       # Main app component
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Application entry point
├── public/                           # Public assets
│   └── vite.svg                      # Vite logo
├── dist/                             # Build output
├── node_modules/                     # Dependencies
├── .firebase/                        # Firebase configuration
├── .gitignore                        # Git ignore rules
├── .firebaserc                       # Firebase project config
├── Companyinfo.js                    # Company information
├── eslint.config.js                  # ESLint configuration
├── firebase.json                     # Firebase hosting config
├── index.html                        # HTML entry point
├── package-lock.json                 # Locked dependencies
├── package.json                      # Dependencies and scripts
├── README.md                         # Project documentation
└── vite.config.js                    # Vite configuration

Food-cycle_Server/
├── node_modules/                     # Dependencies
├── .gitignore                        # Git ignore rules
├── .vercel/                          # Vercel configuration
├── index.js                          # Main server file (587 lines)
├── package-lock.json                 # Locked dependencies
├── package.json                      # Dependencies and scripts
└── vercel.json                       # Vercel deployment config
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account
- Google Cloud account (for GenAI)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Food-cycle_Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the client directory:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_firebase_auth_domain
   VITE_projectId=your_firebase_project_id
   VITE_storageBucket=your_firebase_storage_bucket
   VITE_messagingSenderId=your_firebase_messaging_sender_id
   VITE_appId=your_firebase_app_id
   VITE_API_URL=your_backend_api_url
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd Food-cycle_Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   GOOGLE_API_KEY=your_google_genai_api_key
   ```

4. **Run development server**
   ```bash
   node index.js
   ```

## 📡 API Endpoints

### Donations
- `GET /donations` - Get all donations
- `GET /donations/:id` - Get specific donation
- `POST /donations` - Create new donation
- `PUT /donations/:id` - Update donation
- `DELETE /donations/:id` - Delete donation

### Transactions
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get specific transaction
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Reviews
- `GET /reviews` - Get all reviews
- `GET /reviews/:id` - Get specific review
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Charity Requests
- `GET /requests` - Get all requests
- `GET /requests/:id` - Get specific request
- `POST /requests` - Create new request
- `PUT /requests/:id` - Update request
- `DELETE /requests/:id` - Delete request

### Payments
- `POST /create-payment-intent` - Create Stripe payment intent

### AI Chat
- `POST /api/chat` - Google GenAI chat endpoint

## 🗄️ Database Collections

- **donations** - Food donation listings
- **transactions** - Payment and transaction records
- **users** - User accounts and profiles
- **charityRequests** - Donation requests from charities
- **reviews** - User reviews and ratings


## 👥 Authors

- **Farhan Tahsin Khan** - *Initial work* - [RepoLink](https://github.com/Farhan41229/FoodCycle)

## 🙏 Current Issues/Backlogs

- Slow Image Loading for the first run
- User Info Not loading occasionally

---

**Made with ❤️ for reducing food waste and helping communities**
