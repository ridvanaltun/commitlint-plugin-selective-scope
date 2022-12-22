const commitlintPluginSelectiveScope = require('../index')
const commitlintPluginSelectiveScopeResolver =
  commitlintPluginSelectiveScope.rules['selective-scope']
// Wrap the resolver so we don't have to pass in "always"
const commitlintPluginSelectiveScopeResolverWrapped = (ctx, rules) =>
  commitlintPluginSelectiveScopeResolver(ctx, 'always', rules)

const TEST_RULES = {
  feat: [/^frontend\/[^/]+$/, 'backend'],
  perf: [],
  ci: [null, 'codebuild', 'jenkins']
}

describe('commitlintPluginSelectiveScope', () => {
  it('should return a valid config', () => {
    expect(commitlintPluginSelectiveScope).toHaveProperty('rules')
    expect(
      Object.keys(commitlintPluginSelectiveScope.rules).length
    ).toBeGreaterThan(0)
  })

  it('should not enforce scope if the type does not appear in the rules', () => {
    expect(
      commitlintPluginSelectiveScopeResolverWrapped(
        { scope: 'frontend/web', type: 'fix' },
        TEST_RULES
      )[0]
    ).toBe(true)

    expect(
      commitlintPluginSelectiveScopeResolverWrapped(
        { scope: 'anything', type: 'fix' },
        TEST_RULES
      )[0]
    ).toBe(true)

    expect(
      commitlintPluginSelectiveScopeResolverWrapped(
        { scope: null, type: 'fix' },
        TEST_RULES
      )[0]
    ).toBe(true)
  })

  it('should not allow scope if the type appears in the rules with an empty array', () => {
    expect(
      commitlintPluginSelectiveScopeResolverWrapped(
        { scope: null, type: 'perf' },
        TEST_RULES
      )[0]
    ).toBe(true)

    expect(
      commitlintPluginSelectiveScopeResolverWrapped(
        { scope: 'something', type: 'perf' },
        TEST_RULES
      )[0]
    ).toBe(false)
  })

  describe('should only allow scopes defined if the type appears in the rule with a non-empty array', () => {
    it('should properly match a string literal', () => {
      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'backend', type: 'feat' },
          TEST_RULES
        )[0]
      ).toBe(true)

      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'test', type: 'feat' },
          TEST_RULES
        )[0]
      ).toBe(false)
    })

    it('should properly match a RegExp', () => {
      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'frontend/web', type: 'feat' },
          TEST_RULES
        )[0]
      ).toBe(true)

      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'frontend', type: 'feat' },
          TEST_RULES
        )[0]
      ).toBe(false)
    })
  })

  describe('optional scope', () => {
    it('should allow scope to be optional if the type appears in the rules with a null in the array', () => {
      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: null, type: 'ci' },
          TEST_RULES
        )[0]
      ).toBe(true)
    })

    it('should match scope if provided', () => {
      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'codebuild', type: 'ci' },
          TEST_RULES
        )[0]
      ).toBe(true)

      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'jenkins', type: 'ci' },
          TEST_RULES
        )[0]
      ).toBe(true)

      expect(
        commitlintPluginSelectiveScopeResolverWrapped(
          { scope: 'github', type: 'ci' },
          TEST_RULES
        )[0]
      ).toBe(false)
    })
  })
})
