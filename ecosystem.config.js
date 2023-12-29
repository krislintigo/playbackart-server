module.exports = {
  apps: [
    {
      name: 'PBA-S',
      instances: '1',
      script: 'pnpm compile && pnpm start',
    },
  ],
}
