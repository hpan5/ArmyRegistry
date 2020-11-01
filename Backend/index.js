const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes')
const uri = require('./personal');
const mongoose = require("mongoose")
const PORT = 8000
const app = new express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    console.log(req.method + ' method ' + JSON.stringify(req.body) + ' request received' + JSON.stringify(req.params));
    next();
});

app.use('/soldiers', routes);

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log('DB connected!');
    app.listen(PORT, () => {
        console.log(`Server ${PORT} has started`);
    });
}).catch (err => {
    console.log('faled to connect ' + err);
});