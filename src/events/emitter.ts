import { ConstructorOptions, EventEmitter2 } from 'eventemitter2';

let eventServer: EventEmitter2;
function getInstance(options = {}) {
  if (!eventServer) {
    const initParams: ConstructorOptions = {
      wildcard: true,
      delimiter: '::',
      newListener: false,
      maxListeners: 0,
      verboseMemoryLeak: true,
      ...options,
    };
    eventServer = new EventEmitter2(initParams);
  }

  return eventServer;
}


export default getInstance;
