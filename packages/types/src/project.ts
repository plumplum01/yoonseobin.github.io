export interface SceneVideo {
  src: string
  delay?: number
}

export interface SceneData {
  name: string
  imageKey?: string
  videos?: SceneVideo[]
}

export interface ProjectData {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  scenes?: SceneData[]
}

export interface Scene {
  name: string
  image?: string
  videos?: SceneVideo[]
}

export interface Project {
  id: string
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
  thumbnail: string
  images: string[]
  scenes?: Scene[]
}
