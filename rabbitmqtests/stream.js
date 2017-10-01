var a = require('./stomp.js');
a.Stomp.WebSocketClass = SockJS;
    // Connection parameters
    var mq_username = "guest",
        mq_password = "guest",
        mq_vhost    = "/",
        mq_url      = 'http://' + window.location.hostname + ':15674/stomp',
     
        // The queue we will read. The /topic/ queues are temporary
        // queues that will be created when the client connects, and
        // removed when the client disconnects. They will receive
        // all messages published in the "amq.topic" exchange, with the
        // given routing key, in this case "mymessages"
        mq_queue    = "/topic/mymessages";
     
    // This is where we print incomoing messages
    var output;
     
    // This will be called upon successful connection
    function on_connect() {
      console.log("conencted")
      console.log(client);
      client.subscribe(mq_queue, on_message);
    }
     
    // This will be called upon a connection error
    function on_connect_error() {
      console.log(mq_url)
      console.log('Connection failed!');
    }
     
    // This will be called upon arrival of a message
    function on_message(m) {
      console.log('message received'); 
      console.log(m);
    }
     
    // Create a client
    var client = Stomp.client(mq_url);
     
    window.onload = function () {
      // Connect
      client.connect(
        mq_username,
        mq_password,
        on_connect,
        on_connect_error,
        mq_vhost
      );
    }
