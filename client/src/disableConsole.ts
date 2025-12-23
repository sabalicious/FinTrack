// Disable console methods in the client bundle
const methods = ['log', 'info', 'warn', 'error', 'debug'] as const;
methods.forEach((m) => {
  // @ts-ignore
  if (typeof console[m] === 'function') console[m] = () => {};
});

export {};
