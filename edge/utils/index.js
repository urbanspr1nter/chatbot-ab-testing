const config = require('config-node')({
  env: process.env.EnvironmentName || 'development'
});

const simpleHash = (id) => {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
  
    return hash;
};

const getRoute = (id) => {
    const hashed = simpleHash(id);
  
    if (global.expBucket.indexOf(hashed) !== -1) {
      return config.ServiceB;
    } else if(global.stableBucket.indexOf(hashed) !== -1) {
      return config.ServiceA;
    }
  
    const weight = Math.random();
    console.log("Hashed Conversation ID", hashed, "Weight", weight);

    if (weight <= parseFloat(config.Weight)) {
      global.expBucket.push(hashed);      
      return config.ServiceB;
    } else {
      global.stableBucket.push(hashed);
    }

    return config.ServiceA;
};

module.exports = {
    getRoute: getRoute
};
