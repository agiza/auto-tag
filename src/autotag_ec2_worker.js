const AutotagDefaultWorker = require('./autotag_default_worker');
const AWS = require('aws-sdk');

class AutotagEC2Worker extends AutotagDefaultWorker {
  constructor(event) {
    super(event);
    this.ec2 = new AWS.EC2({region: event.awsRegion});

  }
  /* tagResource
  ** method: tagResource
  **
  ** Do nothing
  */

  tagResource() {
    return this.tagEC2Resources([this.getInstanceId()]);
  }

  tagEC2Resources(resources) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      try {
        _this.ec2.createTags({
          Resources: resources,
          Tags: [
            _this.getAutotagPair()
          ]
        }, function(err, res) {
          if (err)
            reject(err);
          else
            resolve(true);
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  getInstanceId() {
    return this.event.responseElements.instancesSet.items[0].instanceId;
  }
};

export default AutotagEC2Worker;
