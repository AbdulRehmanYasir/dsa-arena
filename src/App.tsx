import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PracticePage } from './pages/PracticePage';
import { ProblemPage } from './pages/ProblemPage';
import { ArenaPage } from './pages/ArenaPage';
import { ProgressPage } from './pages/ProgressPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, isAuthModalOpen, closeAuthModal } = useApp();

  // If not authenticated, always show AuthPage (Login/Register)
  const isUnauthenticated = !currentUser;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />
      <ToastContainer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      <main className="flex-1">
        <ErrorBoundary
          contextName={`Tab-${activeTab}`}
          fallbackTitle="Application Error"
          fallbackMessage="We encountered an unexpected problem rendering this page. You can retry or return to Practice."
          onRetry={() => window.location.reload()}
          onBackToPractice={() => setActiveTab('practice')}
        >
          {isUnauthenticated ? (
            <AuthPage initialMode={activeTab === 'register' ? 'signup' : 'login'} />
          ) : (
            <>
              {activeTab === 'login' && <DashboardPage />}
              {activeTab === 'register' && <DashboardPage />}
              {activeTab === 'landing' && <DashboardPage />}
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'practice' && <PracticePage />}
              {activeTab === 'problem' && <ProblemPage />}
              {activeTab === 'arena' && <ArenaPage />}
{activeTab === 'progress' && <ProgressPage />}
              {activeTab === 'leaderboard' && <LeaderboardPage />}
              {activeTab === 'profile' && <ProfilePage />}
            </>
          )}
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary
      contextName="RootApp"
      fallbackTitle="Application Failed to Initialize"
      fallbackMessage="A critical runtime error occurred. Click retry to reload the application."
      onRetry={() => window.location.reload()}
    >
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
