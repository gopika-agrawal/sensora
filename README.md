# Sensora – AI Career Companion

## 🚀 About The Project

**Sensora** is an AI-powered career development platform designed to help users build professional resumes, prepare for interviews, analyze their performance, and gain industry insights through an interactive and personalized experience.

The platform goes beyond traditional resume building by integrating:

* AI-powered interview preparation
* Personalized onboarding and career analysis
* Industry-specific quiz generation
* Performance tracking dashboards
* Salary insights and market trends
* Skill recommendations based on current industry demand

Users can provide their:

* Industry
* Sub-industry
* Skills
* Experience level
* Career interests

Based on this data, the platform dynamically generates customized quizzes, evaluates performance, and provides career growth recommendations.

The project focuses on delivering a modern full-stack experience using scalable architecture, responsive UI, real-time interactions, and AI-assisted workflows.

---

## ✨ Core Features

### 📝 AI Resume Builder

* Dynamic resume creation workflow
* Structured sections for skills, education, projects, and experience
* Real-time markdown-based resume generation
* One-click PDF export

### 🧠 AI Interview Preparation

* Personalized onboarding flow
* Quiz generation based on:

  * Industry
  * Sub-industry
  * Skills
  * Experience level
* Technical and aptitude assessment support
* Dynamic question generation system

### 📊 Performance Analytics

* Quiz performance tracking
* Skill-based analysis
* User progress monitoring
* Interactive charts and assessment reports

### 💼 Career & Industry Insights

* Industry salary insights
* Minimum, maximum, and average salary analysis
* Trending technologies and market demand tracking
* Recommendations on what skills to learn next
* Career path guidance system

### 👀 Real-Time Preview System

* Instant markdown preview
* Toggle between edit and preview mode
* Responsive rendering for all screen sizes

### 🔐 Authentication & Data Management

* Secure authentication using Clerk
* Resume save functionality
* Persistent user sessions
* User-specific dashboard data

### 🎨 Modern UI/UX

* Built with Tailwind CSS v4
* shadcn/ui components
* Responsive and scalable architecture
* Clean and reusable component structure

---

## 🛠️ Tech Stack

| Category           | Technologies               |
| ------------------ | -------------------------- |
| Frontend           | Next.js 15, React 19       |
| Styling            | Tailwind CSS v4, shadcn/ui |
| Forms & Validation | React Hook Form, Zod       |
| Authentication     | Clerk                      |
| Database & ORM     | Prisma                     |
| PDF Generation     | html2pdf.js, html2canvas   |
| Data Visualization | Recharts                   |
| AI Integration     | Gemini API                 |
| Icons              | Lucide React               |

---

## 🧠 Technical Highlights

* Built using Next.js 15 App Router architecture
* Implemented AI-driven quiz and career recommendation workflows
* Integrated Clerk authentication with protected routes
* Designed reusable and scalable UI components using shadcn/ui
* Added real-time markdown preview with optimized rendering
* Implemented client-side dynamic imports to solve SSR issues with `html2pdf.js`
* Built analytics-based performance tracking system
* Developed industry insight modules for salary and market analysis
* Fixed unsupported `oklch()` CSS parsing issues during PDF generation

---

## 🔥 Challenges Solved

### SSR Compatibility

Resolved server-side rendering issues caused by browser-only libraries such as `html2pdf.js`.

### PDF Rendering Issues

Fixed unsupported `oklch()` color parsing errors from Tailwind CSS v4 during PDF generation.

### Performance Optimization

Improved preview responsiveness and optimized form re-rendering behavior.

---

## 📈 Future Improvements

* 📊 ATS Resume Scoring System
* 🧾 AI Cover Letter Generator
* 📈 Personalized Career Roadmaps
* 🔔 Daily Skill Improvement Challenges

---

