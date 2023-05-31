module.exports = {
  apps: [
    {
      name: 'PBA-S',
      port: '9000',
      instances: '1',
      script: 'yarn compile && yarn start',
    },
  ],
}
