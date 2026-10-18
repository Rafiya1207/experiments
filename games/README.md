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

To distribute the package, select an HTTPS URL where you will host the archive:

```sh
HOMEBREW_SOURCE_URL="https://your-host.example/guess-odd-char-1.0.0.tar.gz" npm run package:brew
```

Upload that exact generated archive to the URL, and commit the generated formula
to the `Formula/` directory of a public Homebrew tap repository. The SHA-256 in
the formula must match the uploaded archive. Rebuilding the archive may change
its checksum, so always distribute the archive and formula from the same build.
Users can then install with `brew install OWNER/TAP/guess-odd-char`.

Packaging does not upload files or publish a tap. See Homebrew's
[tap documentation](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap).
