const redis = require("redis");
const redisScan = require('node-redis-scan');

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS,
    db: process.env.REDIS_DB
});

const scanner = new redisScan(client);

client.on("error", function(error) {
    console.error(error);
});

client.on("ready", function () {
    console.log("REDIS connection established.");

    scanner.scan(process.env.SET_KEYPATTERN, (err, matchingKeys) => {
        if(err) console.log(err);
        console.log(matchingKeys);
        for(let key of matchingKeys){
            client.zremrangebyscore([key, '-inf', Date.now()]);
        }
    })
});