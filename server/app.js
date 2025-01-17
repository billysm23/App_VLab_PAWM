require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { helmetConfig, rateLimitConfig, authLimiter } = require('./middleware/security');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const ErrorCodes = require('./utils/errors/errorCodes');

const app = express();

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const allowedOrigins = [
    'exp://192.168.8.244:8081',
    'http://192.168.8.244:8081',
    'exp://192.168.104.98:8081',
    'http:/192.168.104.98:8081',
    'exp+snack-a3671658-b537-45dd-9072-884041931614://*',
    'vlabpawm://*'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmetConfig);
app.use(rateLimitConfig);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Routes
app.use('/api/auth', authRoutes);

app.use(errorHandler);

// Testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CT Lab API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥');
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err.name, err.message);
    process.exit(1);
});