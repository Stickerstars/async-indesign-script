const fs = require('fs');
const applescript = require('applescript');
const crypto = require('crypto');
const chokidar = require('chokidar');
const config = require('./config');

/**
 * InDesign constructor (applescript wrapper).
 */
const InDesign = function (setup) {
  /**
   * JSON-String.
   */
  this.data = '';
  this.script = '';
  this.config = JSON.stringify(config).replace(/\"/g, '\\"');
  this.version = setup.version;
  this.jobId = null;

  /**
   * Get a unique job id.
   */
  this.getJobId = () => {
    return crypto.randomBytes(8).toString('hex');
  }

  this.checkFileComplete = (path, prev, cb) => {
    fs.stat(path, (err, stat) => {
        if (err) {
            throw err;
        }
        if (stat.mtime.getTime() === prev.mtime.getTime()) {
          cb();
        }
        else {
            setTimeout(this.checkFileComplete, 1 * 250, path, stat, cb);
        }
    });
}

  /**
   * Run a script.
   * @param {*} script 
   * @param {*} data 
   * @param {*} cb 
   */
  this.run = (scriptFile, data, cb) => {
    this.data = JSON.stringify(data).replace(/\"/g, '\\"');
    this.script = scriptFile;
    this.jobId = this.getJobId();
    const scriptPath = this.script;
    const script = "tell application \"Adobe InDesign " + this.version + "\"\r tell script args\r set value name \"data\" value \"" + this.data + "\" set value name \"config\" value \"" + this.config + "\"\r set value name \"job\" value \"" + this.jobId + "\" \r end tell \r activate \r do script \"" + scriptPath + "\" language javascript \r end tell";
    applescript.execString(script, (err, rtn) => {
      if (err) {
        console.log(err);
      }
    });
    /**
     * Watch for response file.
     */
    let self = this;
    const watcher = chokidar.watch(config.busPath + this.jobId, {
        usePolling: true,
        interval: 150,
      })
      .on('add', (path) => {
        fs.stat(path, function (err, stat) {
          if (err) {
              console.log(err)
          } else {
              setTimeout(self.checkFileComplete, 250, path, stat, () => {
                let response;
                try {
                  response = JSON.parse(fs.readFileSync(path).toString());
                } catch(e) {
                  console.log('JSON invalid. Sending NULL response.');
                  response = null;
                }
                fs.unlinkSync(path);
                watcher.close();
                cb(response);
              });
          }
       });
      });
  }
}

module.exports = InDesign;
