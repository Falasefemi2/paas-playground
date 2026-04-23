import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Deployment, DeploymentStatus } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'


interface DeploymentCardProps {
    deployment: Deployment
    onViewLogs: () => void
}

function getStatusColor(status: DeploymentStatus): string {
    const colors: Record<DeploymentStatus, string> = {
        pending: 'bg-slate-700 text-slate-200',
        cloning: 'bg-blue-900 text-blue-200',
        building: 'bg-yellow-900 text-yellow-200',
        running: 'bg-green-900 text-green-200',
        failed: 'bg-red-900 text-red-200',
    }
    return colors[status]
}

function getStatusLabel(status: DeploymentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function DeploymentCard({ deployment, onViewLogs }: DeploymentCardProps) {
    const createdDate = new Date(deployment.createdAt)
    const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })

    return (
        <Card>
            <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="font-monotext-sm break-all">{deployment.repo_url}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(deployment.status)}`}>
                            {getStatusLabel(deployment.status)}
                        </span>
                    </div>
                    <p className="text-sm">Deployed {timeAgo}</p>
                </div>
                <Button
                    onClick={onViewLogs}
                    variant="outline"
                    className="ml-4"
                >
                    View Logs
                </Button>
            </CardContent>
        </Card>
    )
}
