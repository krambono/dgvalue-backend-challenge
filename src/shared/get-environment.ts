import 'dotenv/config';

type ValidEnvironments = 'development' | 'test';

const validEnvironments = ['development', 'test'];

export function getEnvironment(): ValidEnvironments {
  const env = process.env.NODE_ENV;

  if (!checkEnvironmentIsValid(env)) {
    const formattedEnvironments = validEnvironments.map(e => `'${e}'`).join(', ');
    throw new Error(
      `Environment should be one of those: ${formattedEnvironments}. Current value: '${process.env.NODE_ENV}'`
    );
  }

  return env;
}

function checkEnvironmentIsValid(env: string | undefined): env is ValidEnvironments {
  return !!env && validEnvironments.includes(env);
}
