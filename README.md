# DFS API (Freelancing Platform)

DFS is an API for a freelancing platform that matches clients and freelancers for various job projects. This API, built using Node.js, allows users to register, login, create and manage job projects, submit proposals, and track project progress.

## Features

- User registration and authentication
- Create, update, and delete job projects
- Freelancers can submit proposals for job projects
- Clients can accept or reject proposals
- Users can track project progress and view project details

## Getting Started

To set up the DFS API on your local machine, follow these steps:

### Prerequisites

- Node.js and NPM installed on your machine
- MongoDB installed and running on your local or remote server

### Installation

1. Clone the repository: `git clone https://github.com/CodaBlurd/DFS.git`
2. Navigate to the project directory: `cd DFS`
3. Install the dependencies: `npm install`
4. Create a `.env` file in the project root and add the following environment variables:

```
DB_URL=your-mongodb-connection-url
JWT_SECRET=your-jwt-secret-key
```

### Usage

1. Start the server: `npm start`
2. The API will be available at `http://localhost:3000`

## Endpoints

- POST `/api/users/signup`: Register a new user
- POST `/api/users/login`: Login and retrieve authentication token
- GET `/api/users/me`: Get user by ID
- PATCH `/api/users/:id`: Update a user
- DELETE `/api/users/:id`: Delete a user

- GET `/api/services`: Get all job projects
- POST `/api/services`: Create a new job project
- GET `/api/services/:id`: Get a job project by ID
- PATCH `/api/services/:id`: Update a job project
- DELETE `/api/services/:id`: Delete a job project

- GET `/api/bids`: Get all proposals
- POST `/api/bids`: Create a new proposal
- GET `/api/bids/:id`: Get a proposal by ID
- PATCH `/api/bids/:id`: Update a proposal
- DELETE `/api/bids/:id`: Delete a proposal

## Authentication

Authentication is required for certain endpoints. Use the provided JWT token in the request's `Authorization` header in the format: `Bearer {token}`.

## Database Schema

The MongoDB database used for this API has the following collections:

- Users
  - name (String)
  - email (String)
  - password (String)
  - role (String: 'client' or 'freelancer')
- Projects
  - title (String)
  - description (String)
  - budget (Number)
  - clientId (String)
  - freelancerId (String)
  - status (String: 'in progress', 'completed', 'cancelled')
- Proposals
  - projectId (String)
  - freelancerId (String)
  - coverLetter (String)
  - status (String: 'accepted', 'rejected', 'pending')

## Tech Stack

- Node.js
- Express.js
- MongoDB

## Contributing

Contributions to the DFS API are welcome. If you find any bugs or want to suggest new features, please create an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
