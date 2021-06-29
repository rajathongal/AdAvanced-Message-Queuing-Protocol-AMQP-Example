var open = require('amqplib').connect('amqp://localhost');
var fs = require("fs");
var q = 'tasks';

// Consumer
open.then(function(conn) {
  return conn.createChannel();
}).then(function(ch) {
  console.log("Worker Listening");
  return ch.assertQueue(q).then(function(ok) {
    return ch.consume(q, async function(msg) {
      if (msg !== null) {
        

        if(msg.content.toString().indexOf('success') === 1) {

          await fs.readFile("temp.txt", "utf-8", async function(err, buf) {

            if(!(buf.indexOf('error_responses') === -1)) {
              console.log(buf.split('\r\n')[1])
              //[ 'success_responses ', ' 0\r\nerror_responses ', ' 1' ]
             

              var data = buf.split('= ')[0] + "= " + String( parseInt(buf.split('= ')[1]) + 1) + "\r\n" + buf.split('\r\n')[1]

             
              await fs.writeFile("temp.txt", data, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });

            } else {
              var data = "success_responses = " + String(parseInt(buf.split("= ")[1]) + 1) + "\r\n" + "error_responses = " + 0

              await fs.writeFile("temp.txt", data, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
            }

            if (err) {
              var data = "success_responses = " + 1;

              await fs.writeFile("temp.txt", data, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
            }
          });

          

        } else if( msg.content.toString().indexOf('error') === 1) {

          await fs.readFile("temp.txt", "utf-8", async function(err, buf) {
            if (buf) {
              
              if(!(buf.indexOf('error_responses') === -1)){

                var data = buf.split('= ')[0] + '= ' + buf.split('= ')[1] + '= ' + String(parseInt(buf.split('\r\n')[1].split('= ')[1]) + 1);

                await fs.writeFile("temp.txt", data, (err) => {
                  if (err) console.log(err);
                  console.log("Successfully Written to File.");
                });

              } else {
                
                var data = buf + '\r\n' + 'error_responses = 1';

                await fs.writeFile("temp.txt", data, (err) => {
                  if (err) console.log(err);
                  console.log("Successfully Written to File.");
                });
                
              }
            }

            if(err) {
              var data = "success_responses = " + 0 + "\r\n" + "error_responses = " + 1;

              await fs.writeFile("temp.txt", data, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
            }
          })
 
        }

        ch.ack(msg);

      }
    });
  });
}).catch(console.warn);