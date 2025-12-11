
# 🌟 A2A World: The Galactic Storybook

> **"As Above, So Below"** — A psychological resilience tool for the interplanetary era.

![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue.svg)
![Status](https://img.shields.io/badge/status-Research%20Preview-green.svg)
![AI](https://img.shields.io/badge/AI-Gemini%203%20Pro-gold.svg)

## 🚀 Mission Overview

The **Galactic Storybook** is a "Cockpit of Culture" designed for long-duration spaceflight. It serves as a psychological anchor for astronauts, combating the "Overview Effect" detachment and sensory monotony of deep space travel.

By overlaying ancient mythological narratives onto high-resolution Earth observation data, we transform the planet into a living library. This tool allows future Martians to connect with their heritage, ensuring the stories of Earth are preserved not just in text, but in the very geography of the home world.

## 📜 Competition Compliance & Methodology

**License**: In accordance with Competition Rule 2.5.a, this entire Submission (code, curated data, and methodology) is licensed under **CC BY 4.0**.

**Methodology (Rule 2.5.b)**:
1.  **Geomythological Mapping**: We utilize a custom dataset (`constants.ts`) manually curated to map specific Earth coordinates to corresponding mythological narratives ("As Above, So Below").
2.  **Narrative Synthesis**: We employ **Gemini 3 Pro** via the Google GenAI SDK to act as a "Keeper of Heritage," dynamically generating oral-tradition style retellings based on the static coordinate data.
3.  **Iconographic Generation**: We utilize **Gemini 3 Pro Image** to generate high-fidelity, culturally accurate artistic representations of the myths, functioning as a "Cosmic Iconographer."
4.  **External Data (Rule 2.6)**: The "Curated Heaven on Earth Database" included in this submission is original External Data created by the team and is hereby made publicly available under CC BY 4.0 for use by all.

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

This project is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

---
*A2A World Research Initiative | Astronaut Resilience | Heritage Preservation*
