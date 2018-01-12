const fs = require('fs');
const applescript = require('applescript');
const jsesc = require('jsesc');
const crypto = require('crypto');
const chokidar = require('chokidar');
const config = require('./config');

/**
 * InDesign constructor (applescript wrapper).
 */
const InDesign = function () {
  /**
   * JSON-String.
   */
  this.data = '';
  this.script = '';
  this.config = jsesc(JSON.stringify(config), {
    'quotes': 'double'
  });
  this.jobId = null;

  /**
   * Get a unique job id.
   */
  this.getJobId = () => {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Run a script.
   * @param {*} script 
   * @param {*} data 
   * @param {*} cb 
   */
  this.run = (scriptFile, data, cb) => {
    this.data = jsesc(JSON.stringify(data), {
      'quotes': 'double',
      minimal: true
    });
    this.script = scriptFile;
    this.jobId = this.getJobId();
    const scriptPath = this.script;
    const script = "tell application \"Adobe InDesign CC 2018\"\r tell script args\r set value name \"data\" value \"" + this.data + "\" set value name \"config\" value \"" + this.config + "\"\r set value name \"job\" value \"" + this.jobId + "\" \r end tell \r activate \r do script \"" + scriptPath + "\" language javascript \r end tell";
    this.progress.start();
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
        interval: 1000,
      })
      .on('add', (path) => {
        const response = JSON.parse(fs.readFileSync(path).toString());
        fs.unlinkSync(path);
        watcher.close();
        self.progress.stop();
        cb(response);
      });
  }
}

module.exports = InDesign;
