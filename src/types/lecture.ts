export type Material = {
  title: string
  description?: string
  path?: string
  url?: string
  type?: 'pdf' | 'pptx' | 'mp4' | 'youtube' | 'glb' | 'gltf' | 'link'
  embeddable?: boolean
}
export type MaterialGroups = {
  presentations: Material[]
  videos: Material[]
  models: Material[]
  virtualTours: Material[]
  practices: Material[]
  additional: Material[]
}
export type Lecture = {
  id: string
  number: number
  title: string
  icon: string
  introduction: string
  topics: string[]
  outcomes: string[]
  materials: MaterialGroups
}
export type LectureDatabase = {
  courseTitle: string
  university: string
  contactEmail: string
  lectures: Lecture[]
}
