# Electric Poultry Band Manager

A full-stack band booking management app for Electric Poultry.

## Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas
- **Email**: Gmail via Nodemailer

## Setup

### 1. Gmail App Password
Go to [Google Account Security](https://myaccount.google.com/security) → 2-Step Verification → App Passwords.
Generate an app password for "Mail" and paste it into `backend/.env` as `GMAIL_APP_PASSWORD`. The same credentials are used to check the Gmail inbox over IMAP. Reply checking requires IMAP access for the account.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Features
- **Venues**: Add venues, track outreach status, send booking emails (Danish/English)
- **Calendar**: Monthly calendar view + list view, add/edit gigs, confirmed/unconfirmed status
- **Dashboard**: Stats overview, upcoming gigs, outreach breakdown
- **Email preview**: Preview HTML email before sending
- **Reply detection**: Check the Gmail inbox for replies to sent venue emails automatically and from the Venues page
