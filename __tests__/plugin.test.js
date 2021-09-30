const commitlintPluginSelectiveScope = require('../index')

describe('commitlintPluginSelectiveScope', () => {
  it('should return a valid config', () => {
    expect(commitlintPluginSelectiveScope).toHaveProperty('rules')
    expect(
      Object.keys(commitlintPluginSelectiveScope.rules).length
    ).toBeGreaterThan(0)
  })
})
