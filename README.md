<div align="center">

# ⚔ DSA ARENA

### Competitive DSA Practice & Algorithmic Problem Solving Platform

A developer-focused platform for practicing data structures and algorithms through structured problems, timed Arena challenges, code execution, progress tracking, achievements, and performance statistics.

**Think. Code. Compete. Improve.**

</div>

---

## 📌 About

**DSA ARENA** is a web-based competitive programming and algorithm practice platform designed around structured **Data Structures & Algorithms** learning.

The platform allows users to solve programming problems, execute solutions against test cases, participate in timed Arena challenges, track their progress, maintain coding streaks, and monitor their overall performance.

The project focuses on combining **problem solving, code execution, user progress, competitive mechanics, and modern frontend architecture** into one complete application.

---

## ✨ Features

* 🧩 100+ structured DSA problems
* 📚 12 core DSA topics
* 🎯 Easy, Medium, and Hard difficulty levels
* 🔎 Problem search and filtering
* 💻 Multi-language solution support
* ▶ Test-case based code execution
* ⚔ Timed Arena challenges
* 🏆 XP, scores, ratings, and achievements
* 📈 Progress and performance tracking
* 🔥 Daily coding streaks
* 📊 Difficulty and topic statistics
* 📝 Submission history
* 🔐 User authentication
* 👤 User-scoped progress and data
* 💾 Persistent client-side storage
* 🧪 Deterministic solution validation
* 🖥 Responsive developer-focused interface

---

## 🧠 DSA Topics

DSA ARENA currently covers:

| Topic | Focus |
| ---------------------- | -------------------------------- |
| Arrays | Traversal, manipulation & searching |
| Strings | String processing & algorithms |
| Hash Maps | Hashing & frequency problems |
| Linked Lists | Node-based data structures |
| Stacks | LIFO-based problems |
| Queues | FIFO-based problems |
| Trees | Traversal & tree algorithms |
| Graphs | Graph traversal & algorithms |
| Recursion | Recursive problem solving |
| Sorting | Sorting algorithms |
| Searching | Search algorithms |
| Dynamic Programming | Optimization & subproblem techniques |

---

## ⚔ Arena Mode

Arena Mode introduces a timed competitive layer to DSA practice.

```text
Select Problem
      ↓
Start Arena
      ↓
Solve Under Time Limit
      ↓
Run Test Cases
      ↓
Evaluate Result
      ↓
Calculate Score
      ↓
Update Rating & XP
````

Arena performance contributes to the user's:

* Score
* XP
* Rating
* Challenge statistics
* Achievement progress

---

## 💻 Code Execution

Solutions can be tested against predefined problem test cases.

```text
Write Solution
      ↓
Submit / Run
      ↓
Execute Against Test Cases
      ↓
Check Results
      ↓
Pass / Fail
      ↓
Record Submission
```

The execution workflow is designed around deterministic test-case validation.

---

## 📊 Progress Tracking

The platform maintains user-specific progress including:

* Solved problems
* Best scores
* Submission history
* Difficulty distribution
* Topic progress
* Coding streaks
* Arena performance
* Rating history
* Achievements

---

## 🏆 Achievements

DSA ARENA includes achievement milestones based on user activity.

Examples include:

```text
First Blood
     ↓
10 Problems
     ↓
50 Problems
     ↓
100 Problems
```

Additional achievements track:

```text
Daily Streaks
      +
Arena Performance
      +
Problem Solving
```

---

## 🏗 Architecture

```text
                         DSA ARENA
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
        Practice           Arena             Profile
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
                     Problem System
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Code Runner      Progress       Achievements
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    Application Storage
```

---

## 🔄 Application Flow

```text
Authentication
      ↓
Dashboard
      ↓
Practice
      ↓
Select Problem
      ↓
Write Solution
      ↓
Run Test Cases
      ↓
Record Result
      ↓
Update Progress
      ↓
Arena Challenge
      ↓
Track Rating & Achievements
```

---

## 🧩 Core Systems

### Problem System

Responsible for:

* Problem definitions
* Topics
* Difficulty levels
* Constraints
* Test cases
* Starter code
* Problem filtering

### Code Runner

Responsible for:

* Running submitted solutions
* Test-case execution
* Result validation
* Submission results
* Execution feedback

### Progress System

Responsible for:

* Solved problems
* Best scores
* Streaks
* Topic progress
* Difficulty statistics
* Submission history

### Arena System

Responsible for:

* Timed challenges
* Arena scoring
* Rating updates
* XP progression
* Challenge results

### Achievement System

Responsible for:

* Achievement definitions
* Progress conditions
* Unlock tracking
* User milestones

---

## 📂 Project Structure

```text
dsa-arena/
│
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   ├── achievements.ts
│   │   └── problems/
│   │
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PracticePage.tsx
│   │   ├── ProblemPage.tsx
│   │   ├── ArenaPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── services/
│   │   ├── codeRunner.ts
│   │   └── storage.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

---

## 🛠 Tech Stack

| Technology    | Usage                       |
| ------------- | --------------------------- |
| React         | Frontend application        |
| TypeScript    | Type-safe development       |
| Vite          | Development & build tooling |
| Tailwind CSS  | Interface styling           |
| Express       | Application server          |
| Lucide React  | Interface icons             |
| Local Storage | Persistent user data        |
| Git           | Version control             |
| GitHub        | Repository hosting          |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbdulRehmanYasir/dsa-arena.git
cd dsa-arena
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown in the terminal.

---

## 🏗 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📋 Current Status

```text
Authentication       ✅
DSA Problems         ✅
Problem Filtering    ✅
Code Execution       ✅
Arena Mode           ✅
Progress Tracking    ✅
Achievements         ✅
Leaderboard          ✅
User Profiles        ✅
Responsive UI        ✅
Production Build     🔄
```

---

## 🎯 Project Goals

DSA ARENA was built to bring together:

```text
Data Structures & Algorithms
             +
Problem Solving
             +
Code Execution
             +
Competitive Programming
             +
Progress Tracking
             +
Modern React Architecture
```

The goal is to create a practical environment where developers can **practice consistently, measure their progress, and improve their algorithmic problem-solving skills.**

---

## 👨‍💻 Author

<div align="center">

### Abdul Rehman Yasir

**BS Artificial Intelligence Student | Developer**

Building real-world software & development projects.

[GitHub](https://github.com/AbdulRehmanYasir)

</div>

---

<div align="center">

### ⚔ DSA ARENA

**Think. Code. Compete. Improve.**

Built with React + TypeScript.

</div>
