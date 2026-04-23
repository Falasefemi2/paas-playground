import { useState } from 'react'
import DeploymentList from '@/components/deployment-list'
import LogViewer from '@/components/log-viewer'
import type { Deployment } from './lib/types'


function App() {
    const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)

    if (selectedDeployment) {
        return <LogViewer deployment={selectedDeployment} onBack={() => setSelectedDeployment(null)} />
    }

    return <DeploymentList onViewLogs={setSelectedDeployment} />
}

export default App
