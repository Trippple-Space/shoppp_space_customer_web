import development from './local'
import staging from './staging';

const allConfigs: { [x: string]: any } = {
    development,
    staging
}

let currentEnv;
if (!process.env.ENV) {
    currentEnv = window.location.href.includes('localhost') ? 'development' : 'staging';
} else {
    currentEnv = process.env.ENV || 'development'
}

currentEnv = 'staging';

const resolvedConfigs = allConfigs[currentEnv]

export default resolvedConfigs;

