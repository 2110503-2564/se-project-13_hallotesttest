const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const coworkings = require('./routes/coworkings');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');
const banned = require('./routes/banning');
const users = require('./routes/user');

dotenv.config({ path: './config/config.env' });

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions= {
    swaggerDefinition : {
        openapi : '3.0.0',
        info : {
            title : 'Co-Working API',
            version : '1.1.0',
            description : 'Co-Working Space reservation API'
        }
    },
    apis : ['./routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
connectDB();

const app = express();
//API documentation
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

app.use(express.json());
//Sanitize Data
app.use(mongoSanitize());
//Set security headers
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter = rateLimit({
    windowsMs : 10*60*1000,
    max : 100
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());

app.use(cookieParser());
app.use('/api/v1/coworkings', coworkings);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/auth', auth);

app.use('/api/v1/banned', banned);
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    server.close(() => process.exit(1));
});