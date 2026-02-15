LinkVault

Features

Share text or files
Auto-expiring links (preset or exact date & time)
One-time access links
Maximum view limits
Automatic deletion of expired content
File size & type validation
Metadata display (creation time, expiry time, views)
Copy-to-clipboard support
Tech Stack
Frontend
React (Vite)
Tailwind CSS
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
Multer (file upload)
Node-cron (automatic cleanup)

Setup Instructions
1. Clone Project
git clone <repo_url>
cd LinkVault

2. Backend Setup
cd backend
npm install


Create .env file:
paste this in ur file---

PORT=5000
MONGO_URI=your_mongodb_connection_string


Start backend:
npm run dev


Server runs at:

http://localhost:5000

3. Frontend Setup
cd ../frontend
npm install
npm run dev


Open:

http://localhost:5173

API Overview

for
Upload Content--------****

Uploads text or file and returns a private link.

Request data
Field	        Description
text	        Text content (optional)
file	        File upload (optional)
expiryMinutes	Expiry duration (optional)
expiresAt	    Exact expiry datetime (optional)
oneTime	Boolean self-destruct option
maxViews	    Maximum allowed views
Response
{
  "link": "http://localhost:5173/view/<token>"
}

Retrieve Content------------***

GET /content/:token

Returns shared content if valid.

Possible Responses
Status	Meaning
200	Content available
403	Invalid link
410	Expired or view limit reached
Automatic Cleanup

A background job runs every minute and deletes:

Expired records from database

Associated uploaded files from storage

Design Decisions
1. Files Stored on Disk, Not Database
MongoDB stores only metadata (path, expiry, views).
This improves performance and avoids large database storage usage.

2. Token-Based Access
Each share uses a UUID token instead of user authentication to keep system simple and stateless.

3. Background Cleanup Job
Instead of deleting only when accessed, expired data is proactively removed using a scheduled task to free storage.

4. Multiple Expiry Methods
Users can choose:
Relative duration (minutes/hours)
Absolute date & time
This improves flexibility and usability.

5. View Tracking

Views are counted server-side.

Assumptions and Limitations part**********

Assumptions------

Application runs locally or trusted environment
Users share links privately
Uploaded files are small temporary data

Limitations--------

No user accounts or authentication
Links are public if someone else obtains them
Files stored locally (not cloud storage)
Not designed for large file hosting
Cleanup job runs every minute (not real-time deletion)