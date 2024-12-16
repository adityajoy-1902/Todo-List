# To-Do List API

This project implements a REST API for managing a simple to-do list application. It is built using Node.js, Express.js, and SQLite as an in-memory database.

## Features

1. **Authentication**:
   - JWT-based authentication to secure endpoints.
   - Login endpoint to generate tokens.

2. **API Endpoints**:
   - `POST /tasks`: Create a new task.
   - `GET /tasks`: Fetch all tasks.
   - `GET /tasks/:id`: Fetch a task by its ID.
   - `PUT /tasks/:id`: Update the task status.
   - `DELETE /tasks/:id`: Delete a task by its ID.

3. **Database**:
   - SQLite in-memory database for simplicity and fast testing.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables and add a secret key:
   ```env
   SECRET_KEY=your_secret_key
   ```

4. Start the server:
   ```bash
   node index.js
   ```

5. The server will run on [http://localhost:3000](http://localhost:3000).

## API Documentation

### Authentication

#### `POST /login`
**Request Body**:
```json
{
  "username": "example"
}
```
**Response**:
```json
{
  "token": "<JWT_TOKEN>"
}
```

### Task Endpoints

#### `POST /tasks`
**Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, Bread, Eggs"
}
```
**Response**:
```json
{
  "id": 1
}
```

#### `GET /tasks`
**Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response**:
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, Bread, Eggs",
    "status": "pending"
  }
]
```

#### `GET /tasks/:id`
**Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response**:
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, Bread, Eggs",
  "status": "pending"
}
```

#### `PUT /tasks/:id`
**Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Request Body**:
```json
{
  "status": "in-progress"
}
```
**Response**:
```json
{
  "message": "Task updated successfully"
}
```

#### `DELETE /tasks/:id`
**Headers**:
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```
**Response**:
```json
{
  "message": "Task deleted successfully"
}
```

## Notes

- Use the `POST /login` endpoint to generate a token before accessing other endpoints.
- This project uses an in-memory database, so data will be reset when the server restarts.

## License

This project is licensed under the MIT License.
