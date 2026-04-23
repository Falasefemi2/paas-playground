export const sseClients = new Map<string, Set<(log: string) => void>>()

export const addClient = (deploymentId: string, writer: (log: string) => void) => {
    if (!sseClients.has(deploymentId)) {
        sseClients.set(deploymentId, new Set())
    }
    sseClients.get(deploymentId)!.add(writer)
}

export const removeClient = (deploymentId: string, writer: (log: string) => void) => {
    sseClients.get(deploymentId)?.delete(writer)
}

export const broadcast = (deploymentId: string, message: string) => {
    sseClients.get(deploymentId)?.forEach(writer => writer(message))
}
