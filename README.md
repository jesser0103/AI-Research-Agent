<div align="center">
  
# 🤖 AI Research Agent

**A full-stack AI-powered trend analysis platform.**

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Anthropic-AI-1F1F1F?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic" />
</p>

</div>

---

## 📖 Overview

AI Research Agent is an intelligent web platform that automatically gathers data from social platforms (like Reddit, HackerNews, ProductHunt) and uses Large Language Models to synthesize it. The system detects trending topics, evaluates them based on relevance and velocity, and presents the insights—along with the AI's reasoning—in a sleek, dark-themed dashboard.

---

## ✨ Features

- **Automated Data Gathering**: Multi-platform scraping via proxies to ensure consistent data flow.
- **AI Synthesis Engine**: Utilizes LLMs to extract insights, categorize topics, and score them dynamically.
- **Modern Dark UI**: 
  - Real-time animated dashboard with count-up statistics.
  - Interactive, dynamic CSS gradient charts and score bars.
  - Type-safe Angular 17+ architecture utilizing Signals.
- **Microservice-ready Backend**: Built on Spring Boot with scalable REST APIs.

---

## 🏗️ Architecture

The project follows a standard decoupled two-tier architecture:

### 1. `backend/` (Spring Boot)
- Exposes RESTful endpoints for the frontend.
- Integrates with the Anthropic API for NLP and text synthesis.
- Connects to PostgreSQL for relational data storage.
- Handles proxy rotation and external API requests.

### 2. `frontend/` (Angular 17+)
- Built with Standalone Components and Signals.
- Fully responsive custom CSS design system.
- Lazy-loaded routing.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ & **npm**
- **Java** 17+ & **Maven**
- **PostgreSQL**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. **Environment Configuration**:
   The backend requires environment variables to connect to the database, proxies, and the Anthropic API. 
   
   Rename `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your credentials:*
   ```env
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password_postgres
   PROXY_HOST=your_proxy_host
   PROXY_PORT=your_proxy_port
   PROXY_USERNAME=your_proxy_username
   PROXY_PASSWORD=your_proxy_password
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

3. **Run the Server**:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The API will start on `http://localhost:8080`.*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Development Server**:
   ```bash
   npm run start
   ```
   *The application will launch on `http://localhost:4200`.*

---

## ⚙️ Development & Git Configurations

Both the `frontend/` and `backend/` directories come with their own pre-configured `.gitignore` files to ensure compiled binaries, node modules, and IDE configurations (like `.idea` or `.vscode`) aren't tracked.

A root `.gitignore` is also included for global exclusion.

---

## 📄 License

This project is licensed under the MIT License.
