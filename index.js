const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const nodemon = require('nodemon')

const app = express();
const PORT = process.env.PORT || 3001;

process.env.MONGO_URL = "mongodb+srv://vivekchamyal41:GRclebrT7OHdElnl@cluster0.ci8ozww.mongodb.net/"

async function main() {
    try {
    await mongoose.connect(process.env.MONGO_URL,  { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('database connected')
    } catch(error) {
        console.error('Error connecting to mongodb', error)
    }
}

main()

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

const blogRoutes = require('./routes/blogRoutes');
app.use('/blogs', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});