# Venue Relationship Tracker

A comprehensive web application for musicians, bands, and managers to track venue relationships, manage communications, and organize booking history.

## Overview

The Venue Relationship Tracker is designed to help music industry professionals maintain professional relationships with venue owners, promoters, and staff. It provides tools to track communication history, manage bookings, analyze venue performance, and maintain essential venue information in one centralized system.

## Key Features

- **Venue Management**: Store detailed venue information, track preferences, and rate venues
- **Communication Tracking**: Log all communications with venue representatives
- **Booking History**: Record past performances with attendance and revenue tracking
- **Contract Management**: Store and organize venue contracts with status tracking
- **Calendar Integration**: View bookings in a calendar interface with external calendar sync
- **Relationship Analytics**: View relationship health metrics and identify venues due for follow-up

## Technology Stack

### Front-end
- React.js with TypeScript
- Material-UI
- Redux with Redux Toolkit
- Formik with Yup validation
- Chart.js for data visualization
- Google Maps API for venue location

### Back-end
- Node.js with Express
- RESTful API with JSON
- JWT authentication
- PostgreSQL database with Sequelize ORM
- Redis for caching

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL (v14+)
- Redis (optional, for performance)

### Local Development Setup

1. Clone the repository
```
git clone https://github.com/dxaginfo/venue-tracker-2025-06-25.git
cd venue-tracker-2025-06-25
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
```
cp .env.example .env
```
Edit the .env file with your local configuration.

4. Set up the database
```
npm run db:setup
```

5. Start the development server
```
npm run dev
```

6. Access the application at http://localhost:3000

## Project Structure

```
├── client/                # Frontend React application
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── package.json       # Backend dependencies
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore file
├── docker-compose.yml     # Docker Compose configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Material-UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Sequelize](https://sequelize.org/)