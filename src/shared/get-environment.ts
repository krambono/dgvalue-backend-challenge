export function getEnvironment(): 'development' {
  let env: 'development';

  if (process.env.NODE_ENV === 'development') {
    env = 'development';
  } else {
    throw new Error('Environment is unknown or has not been defined ');
  }

  return env;
}
