const facultyApiBase = import.meta.env.VITE_FACULTY_API_URL || 'http://localhost:8081/api/faculty'
const studentApiBase = import.meta.env.VITE_STUDENT_API_URL || 'http://localhost:8082/api/student'
const eventApiBase = import.meta.env.VITE_EVENT_API_URL || 'http://localhost:8083/api/event'

type ErrorPayload = {
  message?: string
}

export const apiBases = {
  facultyApiBase,
  studentApiBase,
  eventApiBase,
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

export function formatDate(eventDate: string) {
  const parsedDate = new Date(eventDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return eventDate
  }

  return parsedDate.toLocaleDateString()
}

function parseJson(text: string): unknown {
  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  const text = await response.text()
  const payload = parseJson(text)

  if (!response.ok) {
    const requestError = new Error(text || 'Request failed') as Error & { status?: number }
    requestError.status = response.status

    if (payload && typeof payload === 'object' && 'message' in payload) {
      const message = (payload as ErrorPayload).message
      if (typeof message === 'string' && message.trim()) {
        requestError.message = message
        throw requestError
      }
    }
    throw requestError
  }

  if (!text) {
    return null as T
  }

  if (payload === null) {
    throw new Error('Invalid JSON response from server')
  }

  return payload as T
}
