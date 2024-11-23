import development from './local'
import production from './production';
import staging from './staging';

const allConfigs: { [x: string]: any } = {
    development,
    staging,
    production
}

const bruteCheckLocal = () => {
    return window.location.href.includes('localhost')
}

const bruteCheckProduction = () => {
    return window.location.href.includes('asoebi.africa') && !window.location.href.includes('staging')
}

let currentEnv;
if (!process.env.ENV) {
    currentEnv = bruteCheckLocal() ? 'development' : bruteCheckProduction() ? 'production' : 'staging';
} else {
    currentEnv = process.env.ENV || 'development'
}


// currentEnv = 'staging';

const resolvedConfigs = { ...allConfigs[currentEnv], ENV: currentEnv }

export default resolvedConfigs;

