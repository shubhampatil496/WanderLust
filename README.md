🏡 Wanderlust – Hostel Management System
📖 Overview

Wanderlust is a full-stack Hostel Management System built using Node.js, Express.js, MongoDB Atlas, and EJS templating.
The project helps students and hostel owners list, manage, and explore hostels easily — similar to Airbnb, but designed for college hostels and budget accommodations.

It includes features like authentication, reviews, and image uploads, all integrated into a clean and responsive interface.

🚀 Key Features
🔐 Authentication & Authorization

Secure user login and signup using Passport.js.

Role-based access control — only authenticated users can add, edit, or delete listings.

🏠 Hostel Listings

Create new hostel listings with name, location, price, image, and description.

Edit or delete your own listings.

View all hostels in a clean grid-based interface.

📝 Reviews System

Add, edit, or delete reviews for each hostel.

Helps users share feedback and improve listing credibility.

🖼️ Image Uploads

Integrated Cloudinary API for image hosting and retrieval.

Supports multiple images per listing.

💾 Cloud Database

🛠️ Tech Stack
Category	Technology Used
Frontend	HTML, CSS, JavaScript, Bootstrap, EJS
Backend	Node.js, Express.js
Database	MongoDB Atlas (via Mongoose)
Authentication	Passport.js
Image Hosting	Cloudinary
Templating	EJS

Uses MongoDB Atlas (Cloud Database) for storing user data, hostel details, and reviews.

Data is not stored locally — ensuring scalability and reliability.


git clone https://github.com/yourusername/wanderlust.git
cd wanderlust

npm install

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
DB_URL=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key

npm start


🔮 Future Enhancements

✅ Fix and integrate Mapbox API for location-based hostel display.

✅ Add search and filter functionality (price, city, rating).

✅ Create Admin Dashboard to manage all listings and users.

✅ Integrate payment gateway (Razorpay or Stripe).

✅ Add email verification and password reset feature.

👨‍💻 Author

Shubham Patil
📚 Computer Engineering Student
💡 Passionate about solving real-world problems using technology and developing full-stack web applications.

🏷️ Project Status

🧩 Currently under development.
✅ Core features (CRUD, Authentication, Cloud Storage) are implemented.
🚧 Mapbox integration is in progress.
