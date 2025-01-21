
## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Smith0212/Internship-Tasks.git
    cd Task1 20-01
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/9) file in the root directory and add the following content:
    ```env
    port=3000
    ```

## Database

The SQL script to create the database and tables is provided in the `Task1 Database 20-01.sql` file. Execute this script in your MySQL database to set up the required tables.

## Running the Application

1. Start the server:
    ```sh
    npm start
    ```

2. The server will run on the port specified in the [.env](http://_vscodecontentref_/10) file (default is 3000).

## API Endpoints

### Authentication

- **POST /api/auth/login**
    - Request body: `{ email, password }`
    - Response: `{ code, message, data }`

- **POST /api/auth/signup**
    - Request body: `{ name, email, password }`
    - Response: `{ code, message, data }`

- **POST /api/auth/logout**
    - Request body: `{ name, email }`
    - Response: `{ code, message, data }`

### User

- **GET /api/user/profile**
    - Response: `{ code, message, data }`

- **POST /api/user/profile**
    - Request body: `{ name, about }`
    - Response: `{ code, message, data }`

### Post(Places)

- **POST /api/post/**
    - Request body: `{ location, about, picture }`
    - Response: `{ code, message, data }`

- **GET /api/post/**
    - Response: `{ code, message, data }`

- **GET /api/post/:id**
    - Response: `{ code, message, data }`

- **POST /api/post/:id/reviews**
    - Request body: `{ user, review }`
    - Response: `{ code, message, data }`
