# Setup & Development Guide

## Installation Instructions

### Prerequisites

Before setting up the project, make sure the following tools are installed:

- **Node.js** (v20 or later recommended)
- **npm** (comes with Node.js)

### Clone the Repository

```bash
git clone <https://github.com/Asiman77/ClinifyFront/>
cd clinify-frontend
```

### Install Dependencies

Install the project dependencies:

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root and define the required environment variables.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

> Replace the value with the appropriate backend API URL for your environment.

---

## Development Instructions

### Start the Development Server

Run the following command to start the application:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### Development Workflow

1. Create a new feature or bugfix branch.
2. Implement your changes following the project's coding conventions.
3. Ensure the backend is running and the frontend can communicate with it.
4. Verify your changes by running:

```bash
npm run lint
npm run typecheck
```

5. Test the affected functionality in the browser.
6. Commit your changes with a meaningful commit message.
7. Push your branch and open a Pull Request.

### Code Quality Checklist

Before submitting your changes, ensure that:

- ESLint reports no errors.
- TypeScript reports no type errors.
- The application works as expected.
- Environment-specific values are stored in `.env.local` and are not hardcoded.

---

## Build Instructions

### Create a Production Build

Generate an optimized production build:

```bash
npm run build
```

### Run the Production Server

After building the project, start the production server:

```bash
npm run start
```

The production server will run on:

```text
http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint to check code quality. |
| `npm run typecheck` | Performs TypeScript type checking. |