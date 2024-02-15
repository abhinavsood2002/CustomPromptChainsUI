import useStore from "../store"
import { Node, Edge } from "reactflow"

function topologicalSort(nodes, edges) {
  const inDegree = {} // Map to store in-degree of each node
  const adjacencyList = {} // Map to store the adjacency list (edges)

  // Initialize in-degree for each node and adjacency list
  nodes.forEach((node) => {
    inDegree[node.id] = 0
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    const source: string = edge.source
    const target: string = edge.target
    adjacencyList[source].push(target) // Store edges in adjacency list
    inDegree[target] += 1 // Increment in-degree of target node
  })
  const queue = nodes.filter((node) => inDegree[node.id] === 0) // Enqueue nodes with in-degree 0
  const result: Node[] = [] // Array to store the result (topological ordering)

  // Perform BFS
  while (queue.length > 0) {
    const currentNode: Node = queue.shift() // Dequeue a node
    result.push(currentNode) // Add node to the result

    adjacencyList[currentNode.id].forEach((neighbor) => {
      inDegree[neighbor] -= 1 // Decrement in-degree of connected nodes
      if (inDegree[neighbor] === 0) {
        queue.push(nodes.find((node) => node.id === neighbor)) // If in-degree becomes 0, add it to the queue
      }
    })
  }

  return result
}

export const runNode = async (id) => {
  try {
    const reactFlowState = useStore.getState()
    const nodeToRun = reactFlowState.getNode(id)
    reactFlowState.updateNodeData(id, { running: true })
    const inputEdge = reactFlowState.getEdges("", id)[0]
    const inputNodeId = inputEdge ? inputEdge.source : null
    const inputNode = inputNodeId ? reactFlowState.getNode(inputNodeId) : null
    const input = inputNode ? inputNode.data.output : ""

    const promptToPass = encodeURIComponent(nodeToRun.data.prompt)
    const inputToPass = encodeURIComponent(input)
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/run/chain_node?prompt=${promptToPass}&input=${inputToPass}`

    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const result = await response.json()
    reactFlowState.updateNodeData(id, {
      input: input,
      output: result.output,
      running: false,
    })
  } catch (error) {
    console.error("Error running node:", error)
    // Handle error, throw, or log it as per your application's requirement
  }
}

export const runNodes = async () => {
  const reactFlowState = useStore.getState()
  const nodes = reactFlowState.nodes
  const edges = reactFlowState.edges
  const runOrder = topologicalSort(nodes, edges)
  for (const node of runOrder) {
    await runNode(node.id)
  }
}
