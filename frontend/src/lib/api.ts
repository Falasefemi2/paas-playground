const API_BASE = 'http://localhost:3000'

export async function deployRepository(repoUrl: string) {
    const response = await fetch(`${API_BASE}/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl }),
    })
    if (!response.ok) throw new Error('Failed to deploy')
    return response.json()
}

export async function getDeployments() {
    const response = await fetch(`${API_BASE}/deployments`)
    if (!response.ok) throw new Error('Failed to fetch deployments')
    return response.json()
}

export function subscribeToDeploymentLogs(deploymentId: string, onMessage: (line: string) => void) {
    const eventSource = new EventSource(`${API_BASE}/deployments/${deploymentId}/logs/stream`)

    eventSource.onmessage = (event) => {
        onMessage(event.data)
    }

    eventSource.onerror = () => {
        eventSource.close()
    }

    return () => eventSource.close()
}
