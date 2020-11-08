require('./database/mongoose');
const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const userRoute = require('./routes/user.route');
const taskRoute = require('./routes/task.route');
const authRoute = require('./routes/auth.route');

const swaggerDocument = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(morgan('dev'));

app.use(userRoute);
app.use(taskRoute);
app.use(authRoute);

module.exports = app;
