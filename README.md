# Video Translation Service

This project is a simple video translation service built with TypeScript, Fastify, and Axios. It consists of a server
that simulates a job status and a client that polls the server for the job status.

## Prerequisites

- Node.js (>=20.15)
- npm

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Ashwin-op/video-translation-service.git
   cd video-translation-service
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

## Usage

### Running the Server

To start the server, run:

```sh
npm run start:server
```

The server will start on `http://localhost:3000`.

[//]: # (### Running the Client)

[//]: # ()

[//]: # (To start the client, run:)

[//]: # ()

[//]: # (```sh)

[//]: # (npm run start:client)

[//]: # (```)

[//]: # ()

[//]: # (The client will poll the server for the job status and log the result.)

## Scripts

- `start:server`: Starts the Fastify server.

[//]: # (- `start:client`: Starts the client to poll the server.)

- `test`: Runs the Jest test suite.

## Server Details

### Endpoints

- **GET /status**
    - Returns the status of the video translation job.
    - **Responses**:
        - `{ "result": "pending" }` - Job is still processing.
        - `{ "result": "completed" }` - Job is complete.
        - `{ "result": "error" }` - Job failed (10% simulated error rate).

- **GET /reset** (optional)
    - Resets the job status to `pending` and starts a new job with a randomized delay.
    - **Response**:
        - `{ "message": "Job status reset to pending." }`

- **GET /health**
    - Returns the server health status.
    - **Response**:
        - `{ "status": "ok", "uptime": 12345 }`

### Configurable Delay

The server simulates job completion with a delay of 3-10 seconds, adjustable in the code for testing purposes.

## Client Library Usage

The client library polls the `/status` endpoint using exponential backoff, balancing between polling efficiency and
timely updates.

### Example Usage

```typescript
import VideoTranslationClient from './client';

const client = new VideoTranslationClient('http://localhost:3000');

client.pollStatus()
  .then(status => console.log(`Job Status: ${status}`))
  .catch(error => console.error('Polling error:', error.message));
```

### Polling Strategy

The client library’s `pollStatus()` method:

- Uses an initial delay of 1 second.
- Doubles the delay on each attempt, up to a maximum of 8 seconds.
- Attempts polling up to 5 times before throwing an error.
- Stops polling if the job status is `completed` or `error`.
- Times out after 30 seconds of polling.

### Client Library Configuration

You can modify polling parameters when initializing the client library:

```typescript
const client = new VideoTranslationClient('http://localhost:3000', {
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 8000,
  maxPollingTime: 30000, // in milliseconds
});
```

- `maxRetries` (default: `5`) - Maximum number of polling attempts.
- `initialDelay` (default: `1000` ms) - Initial delay before the first retry.
- `maxDelay` (default: `8000` ms) - Maximum delay between polling attempts.
- `maxPollingTime` (default: `30000` ms) - Maximum allowed polling time before timeout.

## License

This project is licensed under the MIT License.