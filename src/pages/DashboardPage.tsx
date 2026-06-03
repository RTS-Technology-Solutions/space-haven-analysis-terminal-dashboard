import { useState } from 'react'
import QuickStats from '../components/QuickStats'
import UploadZone from '../components/UploadZone'
import ComingSoon from '../components/ComingSoon'
import TerminalPanel from '../components/ui/TerminalPanel'

export default function DashboardPage() {
  const [saveFileLoaded, setSaveFileLoaded] = useState(false)

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name)
    setSaveFileLoaded(true)
  }

  return (
    <div className="dashboard-page">
      <ComingSoon targetDate="June 19, 2026 00:00:00" />
      
      {/* Preview content (blurred behind coming soon) */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
        {!saveFileLoaded ? (
          <TerminalPanel title="WELCOME TO S.H.A.T. COMMAND CENTER" glow>
            <p style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-lg)' }}>
              Upload a Space Haven save file to begin analysis<span className="cursor-blink"></span>
            </p>

            <UploadZone onFileUpload={handleFileUpload} />

            <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'var(--terminal-bg-dark)', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ color: 'var(--accent-cyan)', marginTop: 0 }}>Where to find save files:</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li><strong>Windows:</strong> <code>%APPDATA%\SpaceHaven\</code></li>
                <li><strong>Mac:</strong> <code>~/Library/Application Support/SpaceHaven/</code></li>
                <li><strong>Linux:</strong> <code>~/.local/share/SpaceHaven/</code></li>
              </ul>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', marginBottom: 0 }}>
                Look for files named "game" without an extension
              </p>
            </div>
          </TerminalPanel>
        ) : (
          <>
            <QuickStats />
            {/* Future dashboard content */}
          </>
        )}
      </div>
    </div>
  )
}
