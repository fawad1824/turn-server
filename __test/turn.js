function test() {
    var res = id('result');
    console.log(res);
    res.innerHTML = 'Checking TURN Server...';
    var url = 'turn:' + id('url').value + ':' + id('port').value,
        useUDP = id('udp').checked;
    url += '?transport=' + (useUDP ? 'udp' : 'tcp');
     console.log('url  ',url);
    checkTURNServer({
        urls: url,
        username: id('name').value,
        credential: id('pass').value
    }, id('time').value).then(function(bool) {
        console.log('is works ',bool);
        if (bool)
            res.innerHTML = 'Yep, the TURN server works...';
        else
            res.innerHTML = 'TURN server does not work.';
    }).catch(function(e) {
        console.log(e);
        res.innerHTML = 'TURN server does not work.';
    });
};

function checkTURNServer(turnConfig, timeout) {
    console.log('turnConfig: ', turnConfig);
    return new Promise(function(resolve, reject) {
        var promiseResolved = false;

        var timer = setTimeout(function() {
            console.log('time out');
            if (promiseResolved) return;
            promiseResolved = true;
            resolve(false);
        }, timeout || 5000);

        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({ iceServers: [turnConfig] });
        var noop = function() {};

        pc.createDataChannel(""); // create data channel
        pc.createOffer(function(sdp) {
            console.log('offer created');
            if (sdp.sdp.indexOf('typ relay') > -1) { // sometimes sdp contains the ice candidates...
                console.log('here is error');
                clearTimeout(timer);
                promiseResolved = true;
                resolve(true);
            }
            pc.setLocalDescription(sdp, noop, noop);
        }, noop); // create offer and set local description

        pc.onicecandidate = function(ice) { // listen for candidate events
            
            console.log('ice candidates 3' , ice.candidate);
            
            if (promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay') > -1)) return;

            console.log('ice candidates 31' );

            clearTimeout(timer);
            promiseResolved = true;
            resolve(true);
        };

        pc.onicecandidateerror = function(e) {
            console.log('ICE Candidate Error: ', e);
            clearTimeout(timer);
            promiseResolved = true;
            resolve(false);
        };
    });
}

function id(val) {
    return document.getElementById(val);
}
