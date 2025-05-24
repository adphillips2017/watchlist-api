# Watchlist API (Node.js HTTP)

This repository hosts the backend API for a personal media watchlist application. It's built with **plain Node.js (HTTP module)** and uses **SQLite** for data persistence. The goal of this project is to demonstrate fundamental backend development principles and core HTTP request/response handling without relying on frameworks, while maintaining a **layered, class-based architecture** (Controllers, Services, DAOs).

---

## 🚧 Status

This project is currently **under active development**. The core API structure is established, and a health endpoint is functional. More detailed documentation, including additional API endpoints, features, and deployment instructions, will be added as development progresses.

---

## 🚀 Getting Started (Initial Setup)

To get this API up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/adphillips2017/watchlist-api.git](https://github.com/adphillips2017/watchlist-api.git)
    cd watchlist-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the server using `ts-node-dev`, watching for changes and automatically restarting. It will also initialize your SQLite database (`watchlist.db`) in the `data/` directory.

---

## 💡 API Endpoints

### Health Check

A simple endpoint to check the API's operational status and its database connection.

* **URL:** `/health`
* **Method:** `GET`
* **Response (Healthy):**
    ```json
    {
      "status": "Running",
      "timestamp": "2025-05-23T12:34:56.789Z"
    }
    ```
* **Response (Unhealthy - e.g., DB connection issue):**
    ```json
    {
      "status": "Database Connection Error",
      "timestamp": "2025-05-23T12:34:56.789Z",
      "error": "Error message from database"
    }
    ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Projects

* **Frontend Application:** [Watchlist App (Svelte)](https://github.com/adphillips2017/watchlist-app)
    *Coming Soon*
