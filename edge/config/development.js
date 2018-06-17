module.exports = {
    EnvironmentName: process.env.EnvironmentName || 'development',
    ServiceA: process.env.ServiceA || 'https://abotservice.azurewebsites.net/',
    ServiceB: process.env.ServiceB || 'https://botserviceb.azurewebsites.net/',
    Weight: process.env.Weight || '0.1',
    Port: process.env.PORT || 3000
};