var rclSocket = {};

rclSocket.mRclUri = "wss://s2.ripple.com";
rclSocket.websocket  = new WebSocket(rclSocket.mRclUri);
rclSocket.messageCallback = null;
rclSocket.errorCallback = null;
rclSocket.isConnected = false;

rclSocket.init = function (pMessageCallback, pErrorCallback) {

    rclSocket.websocket.onopen = rclSocket.onOpen;
    rclSocket.websocket.onclose = rclSocket.onClose;
    rclSocket.websocket.onmessage = rclSocket.onMessage;
    rclSocket.websocket.onerror = rclSocket.onError;

    rclSocket.messageCallback = pMessageCallback;
    rclSocket.errorCallback = pErrorCallback;
};

rclSocket.onOpen = function(pEvent) {
    rclSocket.isConnected = true;
};

rclSocket.onClose = function(pEvent) {

    rclSocket.isConnected = false;
    rclSocket.websocket.open(rclSocket.mRclUri);
};

rclSocket.onMessage = function(pEvent) {

    if(rclSocket.messageCallback !== null)
        rclSocket.messageCallback(pEvent.data);

};

rclSocket.onError = function(pEvent) {

    if(rclSocket.errorCallback !== null)
        rclSocket.errorCallback(pEvent.data);
    else
        alert(pEvent.data);
};

rclSocket.Send = function(pData, pCallback) {

    if(typeof pCallback !== 'undefined')
        rclSocket.messageCallback = pCallback;

    // Not Connected Yet?
    if(rclSocket.isConnected === false) {

        setTimeout(rclSocket.Send, 1000, pData, pCallback);
        return;
    }

    rclSocket.websocket.send(pData);
};
