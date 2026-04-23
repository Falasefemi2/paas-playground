import { useEffect, useRef, useState } from 'react'
import { subscribeToDeploymentLogs } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import type { Deployment } from '@/lib/types'

interface LogViewerProps {
    deployment: Deployment
    onBack: () => void
}

export default function LogViewer({ deployment, onBack }: LogViewerProps) {
    const [logs, setLogs] = useState<string[]>([])
    const [isConnected, setIsConnected] = useState(true)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsConnected(true)
        const unsubscribe = subscribeToDeploymentLogs(deployment.id, (line: string) => {
            setLogs((prev) => [...prev, line])
            // Auto-scroll to bottom
            setTimeout(() => {
                if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
                }
            }, 0)
        })

        return () => {
            unsubscribe()
            setIsConnected(false)
        }
    }, [deployment.id])

    return (
        <div className="min-h-screen  p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Deployments
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold  mb-1">Deployment Logs</h1>
                            <p className="font-mono text-sm">{deployment.repo_url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <>
                                    <Wifi className="w-4 h-4 text-green-500" />
                                    <span className="text-green-400 text-sm">Connected</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-400 text-sm">Disconnected</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Card>
                    <CardContent
                        ref={scrollAreaRef}
                        className="font-mono h-96 overflow-y-auto pt-6"
                    >
                        {logs.length === 0 ? (
                            <div className="">Waiting for logs...</div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="py-1 whitespace-pre-wrap wrap-break-word">
                                    {log}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
