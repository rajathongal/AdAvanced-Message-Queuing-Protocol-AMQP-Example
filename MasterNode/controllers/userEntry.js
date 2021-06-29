const Users = require('../models/user');
var open = require('amqplib').connect('amqp://localhost');

exports.CreateUser = async (req, res, next) => {
    
    try{ 
        if (req.body.name) {
            return await Users.findOne({name: req.body.name}).then(async (resp) => {

                if (!(resp === null)) {
                                    // Publisher
                    var q = 'tasks';
                    await open.then(function(conn) {
                        return conn.createChannel();
                    }).then(function(ch) {
                        return ch.assertQueue(q).then(function(ok) {
                        return ch.sendToQueue(q, Buffer.from(' success request received'));
                        });
                    }).catch(console.warn);
    
                    return res.status(409).json({
                        success: false,
                        message: "User already exists"
                    })
                } else {
                    const { name, age } = req.body;
                    const payload = Users({
                        name: name,
                        age: age,
                        image: {
                            data: req.file.buffer || null,
                            contentType: req.file.mimetype 
                        }
                    });
    
                    // Publisher
                    var q = 'tasks';
                    await open.then(function(conn) {
                        return conn.createChannel();
                    }).then(function(ch) {
                        return ch.assertQueue(q).then(function(ok) {
                        return ch.sendToQueue(q, Buffer.from(' success request received'));
                        });
                    }).catch(console.warn);
    
                    return await payload.save().then(() => {
                        return res.status(200).json({ 
                            success: true,
                            message: "User added successfully"
                        });
                    })
                }
            })
        } else {
            // Publisher
            var q = 'tasks';
            await open.then(function(conn) {
                return conn.createChannel();
            }).then(function(ch) {
                return ch.assertQueue(q).then(function(ok) {
                return ch.sendToQueue(q, Buffer.from(' error request received'));
                });
            }).catch(console.warn);   

            return res.status(504).json({ 
                success: false,
                message: "Please provide correct details"
            });
        }

    } catch (err) {
        // Publisher
        var q = 'tasks';
        await open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(q).then(function(ok) {
            return ch.sendToQueue(q, Buffer.from(' error request received'));
             });
        }).catch(console.warn);   

        return res.status(504).json({ 
            success: false,
            error: err.message
        });
    }
}