import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from '@/components/ui/card'

interface DeploymentFormProps {
    onDeploy: (repoUrl: string) => void
    isLoading: boolean
}

export default function DeploymentForm({ onDeploy, isLoading }: DeploymentFormProps) {
    const [repoUrl, setRepoUrl] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onDeploy(repoUrl)
        setRepoUrl('')
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                    <Label htmlFor="repo-url" className="block text-sm font-medium mb-3">
                        Git Repository URL
                    </Label>
                    <div className="flex gap-3">
                        <Input
                            id="repo-url"
                            type="text"
                            placeholder="https://github.com/user/repo"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="outline"
                            className="px-8"
                        >
                            {isLoading ? 'Deploying...' : 'Deploy'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
