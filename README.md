# Ecommerce App

A modern Angular-based e-commerce application with product browsing, cart management, authentication support, and Stripe payment integration.

## Features

- Product listing, search, and category browsing
- Shopping cart with add/remove functionality
- User authentication and protected routes
- Firebase authentication support
- Stripe payment integration
- Responsive UI built with Bootstrap and custom styles
- Mock backend data using `json-server`
- Express backend server in `backend/server.js`

## Tech Stack

- Angular 21.2.x
- Bootstrap 5.3.x
- Firebase
- Stripe
- JSON Server
- Express.js
- TypeScript
- Tailwind CSS (development styling support)

## Folder structure

```
ecommerce-app/
├── src/
│   ├── app/
│   │   ├── components/       # UI components
│   │   ├── guards/           # Route guards
│   │   ├── layouts/          # Layout components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # Business logic services
│   │   ├── Models/           # Interfaces and types
│   │   ├── app.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   ├── app.html
│   │   └── app.css
│   ├── environments/
│   │   └── environment.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── backend/                  # Node/Express backend
│   ├── package.json
│   └── server.js
├── db.json                   # Mock database for JSON Server
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## Getting Started

### Prerequisites

- Node.js 18+ / npm 11+
- Angular CLI installed globally (optional):

```bash
npm install -g @angular/cli
```

### Install dependencies

From the project root:

```bash
npm install
```

### Run the Angular app

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

### Run the mock backend

The project includes `db.json` for JSON Server.

```bash
npx json-server --watch db.json
```

If you want to run the Express backend, start it from the `backend` folder:

```bash
cd backend
node server.js
```

## Available npm scripts

- `npm start` - Serve the Angular application locally
- `npm run build` - Build the Angular app for production
- `npm run watch` - Build the project in watch mode for development
- `npm test` - Run unit tests

## Configuration

- `src/environments/environment.ts` contains frontend environment settings.
- `backend/server.js` contains backend server logic and Stripe integration.
- `db.json` contains mock data used by JSON Server.

## Notes

- The app is generated with Angular CLI and uses standalone component architecture.
- Use `ng generate` commands if you want to add new Angular components or services.
- Update Firebase and Stripe keys in the environment files before deploying or testing payments.

## Resources

- Angular: https://angular.io/
- Bootstrap: https://getbootstrap.com/
- Firebase: https://firebase.google.com/
- Stripe: https://stripe.com/
- JSON Server: https://github.com/typicode/json-server
