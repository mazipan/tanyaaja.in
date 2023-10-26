export type ErrorResponse = {
  type: 'form-field' | 'toast'
  message: string
}

export const isErrorResponse = (err: unknown): err is ErrorResponse => {
  return (
    typeof err === 'object' && err !== null && 'type' in err && 'message' in err
  )
}
