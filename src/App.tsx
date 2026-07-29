import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { EconomyTab } from './components/EconomyTab';
import { SponsorsTab } from './components/SponsorsTab';
import { ManagersTab } from './components/ManagersTab';
import { StadiumTab } from './components/StadiumTab';
import { SquadTab } from './components/SquadTab';
import { TransfersTab } from './components/TransfersTab';
import { LeagueTab } from './components/LeagueTab';
import { SocialFeedTab } from './components/SocialFeedTab';
import { ClubModal } from './components/ClubModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { NotificationToast } from './components/NotificationToast';
import { ImportantEventModal } from './components/ImportantEventModal';
import { MessagesModal } from './components/MessagesModal';

export const App: React.FC = () => {
  const { isOnboarded, activeTab, toasts, dismissToast, importantModal, closeModal, isMessagesModalOpen, closeMessagesModal } = useGame();
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  if (!isOnboarded) {
    return <OnboardingWizard />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        onOpenClubModal={() => setIsClubModalOpen(true)} 
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)} 
      />

      <main className="main-content">
        <Header onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />

        <div className="view-content">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'economy' && <EconomyTab />}
          {activeTab === 'sponsors' && <SponsorsTab />}
          {activeTab === 'manager' && <ManagersTab />}
          {activeTab === 'stadium' && <StadiumTab />}
          {activeTab === 'squad' && <SquadTab />}
          {activeTab === 'transfers' && <TransfersTab />}
          {activeTab === 'league' && <LeagueTab />}
          {activeTab === 'social' && <SocialFeedTab />}
        </div>
      </main>

      <ClubModal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
      <ImportantEventModal data={importantModal} onClose={closeModal} />
      {isMessagesModalOpen && <MessagesModal onClose={closeMessagesModal} />}
    </div>
  );
};

export default App;

