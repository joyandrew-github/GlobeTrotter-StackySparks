# GlobeTrotter ✈️
**Demo Video & Screenshots**  
Watch the project demo and view screenshots here:  
📹 [Google Drive Folder (Demo Video)](https://drive.google.com/drive/folders/1VfrbFijQIJk21S6K62Fq_cGH_Mp6KhSf?usp=drive_link)

GlobeTrotter is a full-stack trip planning application that enables users to create detailed multi-city travel itineraries, plan day-wise activities, track expenses, calculate budgets, and share trips publicly.


## Features

- User authentication and profile management
- Search and save favorite cities (with cost index & popularity)
- Create multi-city trips with custom dates and reordering
- Day-wise activity planning per city (type, cost, duration, drag-and-drop ordering)
- Expense tracking by category
- Automatic budget calculation (activities + expenses)
- Public trip sharing (read-only view)
- Calendar/timeline view support
- Efficient single-query fetching of full trip data using Prisma

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM

## Project Structure

GlobeTrotter/
├── backend/        # Node.js + Express + Prisma
├── frontend/       # React + Tailwind CSS
└── README.md


## Setup & Running the Project

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/joyandrew-github/GlobeTrotter-StackySparks.git
cd GlobeTrotter
```
### Backend Setup
```bash
 cd backend
 npm i
```
### Create a .env file in the backend folder with your database URL:
- DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/globe_trotter?schema=public"

### Database Configuration (Prisma)

 - The application uses PostgreSQL with Prisma. The configuration in prisma/schema.prisma is:
```javascript
 datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Run Prisma migrations to create tables:
```bash
npx prisma migrate dev

```

### Start the backend server:
```bash
 npm run dev
```
 Server typically runs on http://localhost:5000

## Frontend Setup
```bash
  cd ../frontend
  npm i
  npm run dev
```
 - (App typically runs on http://localhost:3000) 


## 👨‍💻 Developers

- 👨‍💻 **Joyandrew S**
- 🔧 **Elavarasan R**
- 🎨 **Dhusyanth S** 
- 🔐 **Srisurya S** 