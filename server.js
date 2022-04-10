const express = require('express');
const app = express()

const args = require("minimist")(process.argv.slice(2))
console.log(args)
const port = args.port || 5000;


const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

if(args.help) {
    console.log(help)
    process.exit(0)
}



const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage)
});

app.get('/app/flip/', (req, res) => {
    const flip = coinFlip(req.params.number)
    const output = {"flip": flip}
    res.status(200).send(output)
});

function coinFlip() {
    var rand = Math.random()
    if (rand <= .50) {
        return  "heads"
    }
    return "tails" 
}

app.get('/app/flips/:number', (req, res) => {
    const flips = coinFlips(req.params.number)
    const summary = countFlips(flips)
    const output = {"raw": flips, "summary": summary}
    res.status(200).send(output)
});

function countFlips(array) {
    var headCount = 0
    var tailcount = 0
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "heads") {
            headCount++
        }
        else {
            tailcount++
        }
    }
    if (headCount == 0) {
        return { "tails": tailcount }
    }
    if (tailcount == 0) {
        return { "heads": headCount }
    }
    return { "tails": tailcount, "heads": headCount }
}

function coinFlips(flips) {
    var flip = []
    for (var i = 0; i < flips; i++) {
        flip.push(coinFlip())
    }
    return flip
}

app.get('/app/flip/call/:type', (req, res) => {
    const call = flipACoin(req.params.type)
    res.status(200).send(call)
});

function flipACoin(call) {
    var flip = coinFlip()
    var result = ""
    if (flip == call) {
        result = "win"
    }
    else {
        result = "lose"
    }
    return { "call": call, "flip": flip, "result": result }

}

app.use(function (req, res) {
    res.status(404).send('404 NOT FOUND')
});









