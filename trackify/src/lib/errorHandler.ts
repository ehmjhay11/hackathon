export interface MongoError {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

export function handleMongoError(error: unknown): { status: number; message: string } {
  const mongoError = error as MongoError;
  
  if (mongoError.code === 11000) {
    const field = mongoError.keyPattern ? Object.keys(mongoError.keyPattern)[0] : 'field';
    return {
      status: 400,
      message: `${field} already exists`
    };
  }
  
  console.error('Database error:', error);
  return {
    status: 500,
    message: 'Internal server error'
  };
}