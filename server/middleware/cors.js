import cors from 'cors';

const corsMiddleware = cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true,
});

export default corsMiddleware;
