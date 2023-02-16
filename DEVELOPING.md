# Developing

Since this repo is using [Semantic Versioning](https://semver.org/#summary) along with [semantic-release](https://github.com/semantic-release/semantic-release#readme), commits to this repo should follow [Convential Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification.

## Conventional Commits

Using Conventional Commits helps the Github Action detect when and how to bump the semver tag

They specify:

```
type(scope)(!): description

[optional body]

[optional footer(s)]
```

Where `type` is one of:

- `fix:` equates to a patch e.g. `v1.2.3 -> v1.2.4`
- `feat:` equeates to a minor e.g. `v1.2.3 -> v1.3.0`
- Others that don't specify patch/minor
  - `chore:`, `docs:`, `build:`, `refactor:`, `perf:`, etc..

Where `scope` would probably always be `(api)` since this is a module, so it's probably not needed? #TODO: revisit

Where `type(scope)` is suffixed by `!` or `BREAKING CHANGE: msg` is included in the footer:

- `fix!:` equates to a major e.g. `v1.2.3 -> v2.0.0`

Examples:

```bash
 # no clue, maybe a Patch? maybe nothing?
git commit -m "chore: added semicolons everywhere because they were missing"

# Patch, fix: is used
git commit -m "fix: fixes something sometimes becoming an `undefined` somehow?"

# Minor, feat: is used
git commit -m "feat(api): added like.. onFocus/onBlur callbacks or something?"

# Major, ! and BREAKING CHANGE footer are present
git commit -m "feat(api)!: removed a prop and replaced it with something else?

BREAKING CHANGE: the prop `foo` was awful so now we use `bar`
"
```
