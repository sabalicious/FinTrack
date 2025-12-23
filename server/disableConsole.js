// Disable console methods to remove logs in server runtime
const methods = ['log', 'info', 'warn', 'error', 'debug'];
methods.forEach(m => {
  if (console[m]) console[m] = () => {};
});

module.exports = {};
