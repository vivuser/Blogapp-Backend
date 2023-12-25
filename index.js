const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const nodemon = require('nodemon')

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());

process.env.MONGO_URL = "mongodb+srv://vivekchamyal41:GRclebrT7OHdElnl@cluster0.ci8ozww.mongodb.net/"

async function main() {
    try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('database connected')
    } catch(error) {
        console.error('Error connecting to mongodb', error)
    }
}

main()





const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/auth')

app.use('/blogs', blogRoutes);

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});