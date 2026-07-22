export const releaseMatrix = Object.freeze({
  echoUi: '1.1.0',
  next: '16.2.10',
  nextra: '4.6.0',
  nodeMajor: 24,
  pnpm: '10.22.0',
  react: Object.freeze({
    peerRange: '^18.2.0 || ^19.0.0',
    tested: Object.freeze({ react18: '18.3.1', react19: '19.2.8' }),
    workspace: '19.2.8',
  }),
  tailwind: Object.freeze({
    tested: Object.freeze({ tailwind3: '3.4.19', tailwind4: '4.3.3' }),
    workspace: '4.3.3',
  }),
  tone: Object.freeze({
    range: '^15.1.22',
    tested: '15.1.22',
  }),
})
