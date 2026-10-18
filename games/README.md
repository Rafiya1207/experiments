# Guess the odd character

A terminal game with a 20 × 20 board. Find the character that appears once.
On each round, enter all the odd characters found so far, in order. For example,
if the first board contains `X` and the second contains `Y`, answer `X`, then `XY`.
A wrong guess ends the game and prints your score. Press Ctrl-D to quit.

## Run from source

Requires Node.js 18 or newer. No npm dependencies are needed.

```sh
node guess_odd_char.js
node guess_odd_char.js --help
npm test
```

## Build and install with Homebrew

Run these commands from this directory:

```sh
npm run package:brew
brew tap-new rafiya1207/games
cp dist/Formula/guess-odd-char.rb "$(brew --repository rafiya1207/games)/Formula/"
brew install rafiya1207/games/guess-odd-char
guess-odd-char
brew test rafiya1207/games/guess-odd-char
```

If the tap already exists, skip `brew tap-new`. The build creates a versioned
source archive, a SHA-256 checksum, and a Homebrew formula under `dist/`.
The local formula points to the archive's absolute `file://` URL; keep the archive
there until installation completes. Rebuild and copy the formula again if you
move the checkout. Homebrew installs Node.js as a dependency and provides the
`guess-odd-char` command.

To uninstall:

```sh
brew uninstall rafiya1207/games/guess-odd-char
```

## Publish for other users

The publishing script builds and publishes the current `guess_odd_char.js` to
`Rafiya1207/experiments`, creates a GitHub release, and updates the formula in
`Rafiya1207/homebrew-games`. Requires Node.js 18+, Git, GitHub CLI (`gh`), `tar`,
and Ruby for formula syntax validation. Both public repositories must exist,
and your GitHub account must have push access.

Choose a new version; `1.0.0` is already published. Preview the package locally:

```sh
npm run publish:brew -- 1.0.1 --dry-run
```

The dry run tests the game and publishing guards, builds the archive and formula,
and prints their paths. It does not contact GitHub or create commits.

To publish:

```sh
gh auth switch --hostname github.com --user Rafiya1207
npm run publish:brew -- 1.0.1
```

The script verifies the authenticated GitHub login and account ID, explicitly
sets both Git author and committer to `Rafiya1207` with the account's GitHub
noreply email, and checks commit attribution before pushing and on GitHub
afterward. It refuses other accounts and existing release tags.

Publishing uses isolated checkouts under `dist/publish-brew-*`. It copies the
current game and the listed packaging, documentation, and test files, sets the
requested version in the copied package and lockfile, runs the tests, and
prepares both commits before pushing. Your working files and version remain
unchanged; unrelated edits are excluded. Pushes use normal fast-forward checks
and never force existing history or replace release assets.

After publication, others can install or upgrade:

```sh
brew install rafiya1207/games/guess-odd-char
# For an existing installation:
brew update
brew upgrade rafiya1207/games/guess-odd-char
```

If publication stops partway through, completed pushes or releases remain on
GitHub. The script retains both checkouts and the exact archive/formula and
prints their directory. Inspect the remote state before retrying; an already
created release will cause a retry with the same version to stop. If only the
tap push failed, verify the account and finish from the retained tap checkout:

```sh
gh api user --jq .login
git -C /printed/workspace/homebrew-games push origin HEAD:main
```

For manual packaging with a different HTTPS host:

```sh
HOMEBREW_SOURCE_URL="https://your-host.example/guess-odd-char-1.0.0.tar.gz" npm run package:brew
```

Upload that exact generated archive to the URL, and commit the generated formula
to the `Formula/` directory of a public Homebrew tap repository. The SHA-256 in
the formula must match the uploaded archive. Rebuilding the archive may change
its checksum, so always distribute the archive and formula from the same build.
Users can then install with `brew install OWNER/TAP/guess-odd-char`.

`package:brew` only builds files; `publish:brew` uploads and publishes. See Homebrew's
[tap documentation](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap).
