🎥 Huddler.ai - The Universal Meeting Bot
=========================================

Huddler.ai is your one-stop solution for meeting automation! Whether it's Zoom, Google Meet, Microsoft Teams, or Webex, we've got you covered. Our bot joins, records, and transcribes meetings with style, all while giving you detailed summaries and seamless integration with your workflows. Say goodbye to meeting chaos and hello to streamlined productivity. 🚀

* * * * *

🔥 Features
-----------

-   **Automated Meeting Recording**: Let our bot handle the hustle with Selenium-powered automation.
-   **Universal Platform Support**: Works like a charm on Zoom, Google Meet, Microsoft Teams, and Webex.
-   **Transcription & Summaries**: AI-powered transcriptions and summaries for every meeting.
-   **Chunked Uploads**: Secure, live recording uploads to AWS S3 in real-time.
-   **Scalable Architecture**: Kubernetes and Dockerized microservices ensure your bot army is always ready to deploy.
-   **Retry Mechanism**: Bot crashed? No problem, it'll get right back to work.
-   **Developer-Friendly Monorepo**: Built with pnpm, TurboRepo, and modern design principles.

* * * * *

🏗️ Tech Stack
--------------

| Component | Tech |
| --- | --- |
| **Frontend** | React.js + Tailwind CSS |
| **Backend API Server** | Go (Golang) |
| **Task Queue** | Redis |
| **Workers** | Node.js + Puppeteer/Playwright |
| **Transcoding** | FFmpeg |
| **Transcription** | OpenAI GPT-4 |
| **Database** | PostgreSQL (user data) + Qdrant (vector store) |
| **Object Storage** | AWS S3 |
| **Orchestration** | Kubernetes + Terraform |

* * * * *

📂 Folder Structure
-------------------

```
huddler-ai/
├── apps/
│   ├── web/                     # Frontend Web Application (React, Next.js, or similar)
│   │   ├── public/              # Static assets
│   │   ├── src/                 # Web source code
│   │   ├── package.json         # Dependencies for the frontend
│   │   └── ...
│   ├── api-server/              # Go-based API server
│   │   ├── cmd/                 # Main entry points
│   │   ├── internal/            # Internal business logic
│   │   ├── pkg/                 # Shared libraries for the API
│   │   ├── Dockerfile           # Dockerfile for API server
│   │   ├── go.mod               # Go modules
│   │   └── ...
│   ├── transcoder-service/      # Go-based transcoder service
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── pkg/
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   └── ...
│   ├── transcriber-service/     # Python-based transcription service
│   │   ├── app/                 # Core logic for transcription
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── ...
│   ├── automation-service/        # Automation service for Selenium/Playwright (JS)
│   │   ├── platforms/           # Separate modules for each meeting platform
│   │   │   ├── zoom/
│   │   │   ├── teams/
│   │   │   ├── google-meet/
│   │   │   └── ...
│   │   ├── Dockerfile
│   │   ├── package.json         # Dependencies for Selenium
│   │   └── ...
│   └── ...

├── libs/                        # Shared libraries for all services
│   ├── common-go/               # Common Go utilities
│   │   ├── logging/
│   │   ├── db/
│   │   ├── queue/
│   │   └── ...
│   ├── selenium-utils/          # Shared Selenium utilities (JS or Python)
│   ├── playwright-utils/        # Shared Playwright utilities
│   ├── transcoder-utils/        # Transcoding-related utilities
│   └── ...

├── configs/                     # Centralized configuration
│   ├── dev/                     # Development environment configs
│   ├── prod/                    # Production environment configs
│   └── ...

├── infra/                       # Infrastructure and deployment
│   ├── k8s/                     # Kubernetes manifests for all services
│   ├── terraform/               # Optional: Infrastructure as Code
│   └── ...

├── scripts/                     # Automation scripts
│   ├── init-db.sh               # Script to initialize the database
│   ├── deploy.sh                # Script for deployment
│   └── ...

├── docs/                        # Documentation
│   ├── README.md                # Project overview
│   ├── ARCHITECTURE.md          # Architecture details
│   └── ...

├── Makefile                     # Project-wide task automation
├── turbo.json                   # Turborepo configuration for the monorepo
├── package.json                 # Root dependencies
└── .gitignore                   # Ignored files

```

* * * * *

🚀 How It Works
---------------

1.  **Bot Joins the Meeting**: A Selenium/Playwright worker joins the meeting on your behalf.
2.  **Records the Screen**: The bot captures the meeting screen and streams chunks to AWS S3.
3.  **Transcription Magic**: AI services kick in to provide real-time or post-meeting transcriptions.
4.  **Summarized Insights**: GPT-4 generates concise and actionable summaries.
5.  **Seamless Integrations**: Use our web app to manage, retrieve, and analyze all your recordings.

* * * * *

🛠️ Setup
---------

1.  **Clone the Repo**:

    ```
    git clone https://github.com/devXpranay/huddler.git
    cd huddler-monorepo

    ```

2.  **Install Dependencies**:

    ```
    pnpm install

    ```

3.  **Configure Environment Variables**: Create a `.env` file in the root directory with the required variables:

    ```
    DATABASE_URL=your_postgres_url
    REDIS_URL=your_redis_url
    AWS_S3_BUCKET=your_bucket_name
    GPT_API_KEY=your_openai_key

    ```

4.  **Run the Services**:

    ```
    pnpm turbo run dev --parallel

    ```

5.  **Access the Web App**: Visit [http://localhost:3000](http://localhost:3000/) to explore the web UI.

* * * * *

💡 Contributing
---------------

We're open to contributions! Feel free to fork the repo, create a branch, and submit a pull request. Let's build something amazing together. 🌟

* * * * *

⚡ Roadmap
---------

-   [ ]  Add support for more meeting platforms (e.g., BlueJeans, GoToMeeting).
-   [ ]  Real-time transcription and translations.
-   [ ]  Advanced analytics for meeting insights.
-   [ ]  Slack and Teams integrations for instant updates.

* * * * *

🧑‍💻 Authors
-------------

-   **[Pranay Varma](https://linkedin.com/in/pranay-varma)** - Creator & Lead Developer

* * * * *

📜 License
----------

This project is licensed under the MIT License - see the [LICENSE](https://chatgpt.com/c/LICENSE) file for details.

* * * * *

🌟 Show Your Support
--------------------

Give this project a ⭐ on GitHub if you found it helpful! Spread the word and let's make meetings smarter together.

* * * * *

Built with ❤️ by the Pranay.