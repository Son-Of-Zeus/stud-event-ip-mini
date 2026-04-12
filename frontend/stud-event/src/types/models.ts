export type FacultyModel = {
  id?: string
  facultyId: string
  facultyName: string
  emailId: string
  password: string
}

export type FacultySession = Omit<FacultyModel, 'id' | 'password'>

export type StudentModel = {
  id?: string
  studentName: string
  rollNumber: string
  emailId: string
  password: string
}

export type StudentSession = Omit<StudentModel, 'id' | 'password'>

type JwtAuthPayload = {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export type FacultyAuthResponse = JwtAuthPayload & FacultySession

export type StudentAuthResponse = JwtAuthPayload & StudentSession

export type EventModel = {
  id?: string
  studentName: string
  studentRollNumber: string
  eventName: string
  eventLocation: string
  eventDate: string
  eventDescription: string
  facultyId: string
}
