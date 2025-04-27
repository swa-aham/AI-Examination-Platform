# AI-Powered Exam Platform

An online examination platform that enables students to take exams, receive AI-powered grading, and get detailed feedback. Teachers can generate reports and track student progress over time.

## Features

- **Student Dashboard**: Access grade-specific exams across different subjects
- **Exam Interface**: Dynamic question interface based on question type (single-word, short-answer, long-answer)
- **AI Grading**: Automated assessment using Google Gemini AI with detailed feedback
- **Auto-save**: Periodically saves student progress during exams
- **Teacher Interface**: Review student results and generate detailed reports
- **Monthly Reports**: Track student progress over time with subject-wise analysis

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/online-exam-platform.git
cd online-exam-platform
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to create a Gemini API key
2. Add your API key to the `.env.local` file
3. The application uses Gemini for:
   - Grading different types of exam answers
   - Generating overall feedback for exams
   - Creating monthly progress reports

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── exams/              # Exam interfaces
│   │   └── ...
│   ├── components/             # React components
│   ├── lib/                    # Utility functions
│   │   ├── gemini.ts           # Gemini AI integration
│   │   └── mongodb.ts          # MongoDB connection
│   ├── models/                 # MongoDB schemas
│   └── utils/                  # Helper functions
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## AI Grading Rubrics

The platform uses different grading rubrics based on question types:

1. **Single-word answers**:
   - 2 points for correct answers
   - 1 point for partially correct answers
   - 0 points for incorrect answers

2. **Short answers (1-2 sentences)**:
   - Accuracy: 0-5 points
   - Clarity: 0-3 points
   - Completeness: 0-2 points

3. **Long answers (5-6 sentences)**:
   - Content Accuracy: 0-5 points
   - Clarity & Structure: 0-3 points
   - Grammar & Language: 0-2 points
   - Depth of Explanation: 0-5 points

## License

This project is licensed under the MIT License.
