# Calviora

A modern, secure e-commerce platform built with Node.js, Express.js, and MongoDB.

## Features

- 🛒 **Shopping Cart Management** - Add, update, and remove items from cart
- 👤 **User Authentication** - Secure login/registration system
- 📦 **Order Management** - Complete order processing and tracking
- 🏪 **Product Management** - Comprehensive product catalog
- 👑 **Admin Panel** - Owner/admin functionality for store management
- 🔐 **Security First** - Built with modern security best practices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Session Management**: Express sessions with flash messages
- **File Upload**: Multer for image handling
- **Security**: Helmet, Rate limiting, Input validation
- **Development**: ESLint, Prettier, Nodemon, Jest

## Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- MongoDB

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Aditya13s/Calviora.git
    cd Calviora
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

    ```env
    MONGODB_URI=mongodb://localhost:27017/calviora
    EXPRESS_SESSION_SECRET=your-super-secret-session-key
    JWT_SECRET=your-jwt-secret-key
    NODE_ENV=development
    PORT=3000
    ```

4. **Start the application**

    ```bash
    # Development mode with auto-reload
    npm run dev

    # Production mode
    npm start
    ```

## Available Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with auto-reload
- `npm test` - Run the test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## API Routes

### Public Routes

- `GET /` - Home page
- `GET /shop` - Product listing (requires authentication)

### User Routes

- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/logout` - User logout

### Cart & Orders

- `GET /cart` - View cart
- `GET /cart/add/:productid` - Add product to cart
- `POST /cart/update` - Update cart quantities
- `POST /checkout` - Process order

### Admin Routes

- `/owners/*` - Owner/admin management routes
- `/products/*` - Product management routes

## Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Sanitizes and validates user input
- **Password Hashing** - bcrypt for secure password storage
- **Session Security** - Secure session configuration
- **CORS Protection** - Cross-origin request security

## Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
Calviora/
├── app.js                 # Application entry point
├── config/                # Configuration files
│   ├── mongoose-connection.js
│   └── multer-config.js
├── controllers/           # Route controllers (if implemented)
├── middlewares/           # Express middlewares
│   ├── checkDetails.js
│   ├── isAlreadyLoggedIn.js
│   ├── isLoggedIn.js
│   └── isOwnerLoggedIn.js
├── models/               # Mongoose models
│   ├── order-model.js
│   ├── owner-model.js
│   ├── product-model.js
│   └── user-model.js
├── public/               # Static files (CSS, JS, images)
├── routes/               # Express routes
│   ├── index.js
│   ├── ownersRouter.js
│   ├── productsRouter.js
│   └── usersRouter.js
├── utils/                # Utility functions
├── views/                # EJS templates
└── tests/                # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

| Variable                 | Description                          | Required |
| ------------------------ | ------------------------------------ | -------- |
| `MONGODB_URI`            | MongoDB connection string            | Yes      |
| `EXPRESS_SESSION_SECRET` | Secret key for session encryption    | Yes      |
| `JWT_SECRET`             | Secret key for JWT tokens            | Yes      |
| `NODE_ENV`               | Environment (development/production) | No       |
| `PORT`                   | Server port number                   | No       |

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
