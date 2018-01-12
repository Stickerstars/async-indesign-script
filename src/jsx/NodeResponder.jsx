//@include json2.js

/**
 * Convert script args to JS-Objects.
 */
var toJsonObject = function(jsonString){
    return eval('('+jsonString + ');' );
};

var config = toJsonObject(app.scriptArgs.getValue('config'));
var data = toJsonObject(app.scriptArgs.getValue('data'));
var jobId = app.scriptArgs.getValue('job');

/**
 * Very simple Event-Bus (file flag) to talk to node process.
 */
var NodeResponder = function() {
    this.path = config.busPath;

    /**
     * 'Emit' an event by creating a file.
     * @param {*} data
     */
    this.emit = function(data) {
        this.writeFile(data.flag, data.body);
    }

    /**
     * Write a UTF-8 File.
     * @param {*} name
     */
    this.writeFile = function(body) {
        var file = new File(this.path + jobId);
        file.encoding = 'UTF-8';
        file.open('w');
        file.write(JSON.stringify(body));
        file.close();
    }
}

