# discord-hltv-bot

A Discord Bot to get CS:GO matches information from HLTV.org

## Get started

* Clone the repository.
* Install all the dependencies.
* Create a config.js file in the root directory with the following data:

```
// Your prefered prefix for the commands
export const prefix = '!';

// Your bot user token
export const token = '';

// Your prefered teams to get next matches
export const myTeams = [
  'Cloud9',
  'FaZe',
  'SK',
  'Natus Vincere',
  'mousesports',
  'Quantum Bellator Fire',
  'G2',
  'Fnatic',
  'Gambit',
  'Vega Squadron',
  'Space Soldiers',
  'BIG',
  'Astralis',
  'Liquid',
  'North',
  'Virtus.pro',
  'Furious Gaming',
  'Isurus',
  'Coscu Army',
  'OpTic'
];
```

* Run npm/yarn start to execute the bot.
