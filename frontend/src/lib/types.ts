export type DeploymentStatus = 'pending' | 'cloning' | 'building' | 'running' | 'failed'

export interface Deployment {
    id: string
    repo_url: string
    status: DeploymentStatus
    createdAt: string
}
