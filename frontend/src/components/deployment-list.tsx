import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deployRepository, getDeployments } from '@/lib/api'
import DeploymentForm from './deployment-form'
import DeploymentCard from './deployment-card'
import type { Deployment } from '@/lib/types'

interface DeploymentListProps {
    onViewLogs: (deployment: Deployment) => void
}

export default function DeploymentList({ onViewLogs }: DeploymentListProps) {
    const [error, setError] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const { data: deployments = [], isLoading } = useQuery({
        queryKey: ['deployments'],
        queryFn: getDeployments,
        refetchInterval: 3000, // Poll every 3 seconds
    })

    const deployMutation = useMutation({
        mutationFn: deployRepository,
        onSuccess: () => {
            setError(null)
            queryClient.invalidateQueries({ queryKey: ['deployments'] })
        },
        onError: (err) => {
            setError(err instanceof Error ? err.message : 'Deployment failed')
        },
    })

    const handleDeploy = (repoUrl: string) => {
        if (!repoUrl.trim()) {
            setError('Please enter a repository URL')
            return
        }
        deployMutation.mutate(repoUrl)
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold  mb-2">Deployment Dashboard</h1>
                    <p className="">Deploy and manage your applications</p>
                </div>

                <DeploymentForm onDeploy={handleDeploy} isLoading={deployMutation.isPending} />

                {error && (
                    <div className="mt-4 p-4  border  rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-semibold  mb-4">
                        {isLoading ? 'Loading deployments...' : `${deployments.length} Deployments`}
                    </h2>

                    {deployments.length === 0 && !isLoading && (
                        <div className="text-center py-12 border rounded-lg">
                            <p className="">No deployments yet. Deploy a repository to get started.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {deployments.map((deployment: Deployment) => (
                            <DeploymentCard
                                key={deployment.id}
                                deployment={deployment}
                                onViewLogs={() => onViewLogs(deployment)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
