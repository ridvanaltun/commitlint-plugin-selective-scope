function normalizeScope(scope) {
  if (scope == null) {
    return null
  }
  if (typeof scope === 'string' && scope.trim() === '') {
    return null
  }
  return scope
}

// @commitlint/load merges config with es-toolkit, which turns array `null`
// entries into `undefined`. Treat both as "no scope" markers.
function isNoScopeMarker(value) {
  return value == null
}

function formatAllowedScopes(allowedScopes) {
  return allowedScopes
    .filter(s => !isNoScopeMarker(s))
    .map(s => `"${s}"`)
    .join(', ')
}

module.exports = {
  rules: {
    'selective-scope': (ctx, applicable, rule) => {
      if (applicable === 'never') {
        return [false, 'the "allowed-scopes" rule does not support "never"']
      }

      const scope = normalizeScope(ctx.scope)
      const allowedScopes = rule[ctx.type]

      // If the type does not appear in the rule config, allow any scope or no scope
      if (allowedScopes === undefined) {
        return [true]
      }

      if (Array.isArray(allowedScopes)) {
        // If the type maps to an empty array in the rule config, scope is not allowed
        if (allowedScopes.length === 0) {
          if (scope != null) {
            return [
              false,
              `commit messages with type "${ctx.type}" must not specify a scope`
            ]
          }

          return [true]
        }

        // Otherwise attempt to match against either null/undefined, a string literal, or a RegExp
        if (
          allowedScopes.findIndex(s => {
            if (isNoScopeMarker(s)) {
              return scope == null
            }

            if (
              typeof scope === 'string' &&
              Object.prototype.toString.call(s) === '[object RegExp]'
            ) {
              return scope.match(s)
            }

            return s === scope
          }) !== -1
        ) {
          return [true]
        } else if (allowedScopes.some(isNoScopeMarker)) {
          return [
            false,
            `commit message with type "${
              ctx.type
            }" may specify a scope, but if specified, it must be one of the following: ${formatAllowedScopes(
              allowedScopes
            )}`
          ]
        } else {
          return [
            false,
            `commit message with type "${
              ctx.type
            }" must specify one of the following scopes: ${formatAllowedScopes(
              allowedScopes
            )}`
          ]
        }
      }

      return [
        false,
        `invalid rule entry: { ${ctx.type}: ${JSON.stringify(allowedScopes)} }`
      ]
    }
  }
}
