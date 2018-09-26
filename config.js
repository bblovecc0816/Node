var config = {};

config.development = {

    database:{
        userName: 'dpnweb', // update me
        password: 'dpnweb1', // update me
        server: '153.112.16.68',
        options: {
            database: 'DPMonitor',
            instanceName:'sql2',
            rowCollectionOnRequestCompletion:true
        }
    }

};

config.production = {

    database:{
        userName: 'dpnweb', // update me
        password: 'dpnweb1', // update me
        server: '153.112.16.68',
        options: {
            database: 'EUD',
            instanceName:'sql1',
            rowCollectionOnRequestCompletion:true
        }
    }
};

config.environment = 'development';

module.exports = config;