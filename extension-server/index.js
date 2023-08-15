require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const func = require('./functions/main');
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', //Here we can restrict the domains to access the server
    optionsSuccessStatus: 200
}

app.get('/result/:id', cors(corsOptions), async (req, res) => {
    console.log("Get Request");
    let time, count, notCount, t100x, t125x, t150x, t175x, t200x, avg_size, result;
    try {
        [time, count, notCount] = await func.getDuration(req.params.id);
    } catch (error) {
        result = {
            ok: false,
            message: error.message
        }
        return res.send(result);
    }

    avg_size = func.getAvgSize(time, count);
    [t100x, t125x, t150x, t175x, t200x] = func.getFormattedTime(time);

    result = {
        ok: true,
        data: {
            timeSec: time,
            count: count,
            notCount: notCount,
            avgTime: avg_size,
            t100x: t100x,
            t125x: t125x,
            t150x: t150x,
            t175x: t175x,
            t200x: t200x
        }
    }
    res.send(result);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})