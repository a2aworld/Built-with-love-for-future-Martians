
# 🌟 A2A World: The Galactic Storybook

> **"As Above, So Below"** — A psychological resilience tool for the interplanetary era.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Status](https://img.shields.io/badge/status-Research%20Preview-green.svg)
![AI](https://img.shields.io/badge/AI-Gemini%203%20Pro-gold.svg)

## 🚀 Mission Overview

The **Galactic Storybook** is a "Cockpit of Culture" designed for long-duration spaceflight. It serves as a psychological anchor for astronauts, combating the "Overview Effect" detachment and sensory monotony of deep space travel.

By overlaying ancient mythological narratives onto high-resolution Earth observation data, we transform the planet into a living library. This tool allows future Martians to connect with their heritage, ensuring the stories of Earth are preserved not just in text, but in the very geography of the home world.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS (Academic Theme)
*   **AI Core**: Google Gemini 3 Pro (Narrative Engine), Gemini 3 Pro Image (Iconography Engine)
*   **Geospatial**: Google Maps Embed API, Custom "Chronoscope" Dual-Layer Rendering
*   **Audio**: Web Speech API for auto-narration

## 📦 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/a2aworld/galactic-storybook.git
    cd galactic-storybook
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory:
    ```
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Launch Mission Control**
    ```bash
    npm start
    ```

## ☁️ Deployment (Google Cloud Run / Vercel)

To deploy this application publicly so others can use it without needing their own key:

1.  **Set Environment Variables**: You **MUST** set the `API_KEY` environment variable in your cloud provider's dashboard.
    *   **Google Cloud Run**: Go to "Edit & Deploy New Revision" -> "Variables & Secrets" -> Add `API_KEY`.
    *   **Vercel/Netlify**: Go to "Project Settings" -> "Environment Variables" -> Add `API_KEY`.

2.  **Deploy**: The application detects the key automatically and creates a seamless experience for the user.

## 📜 License

This project is open source and available under the **Apache License 2.0**.

---
*A2A World Research Initiative | Astronaut Resilience | Heritage Preservation*
