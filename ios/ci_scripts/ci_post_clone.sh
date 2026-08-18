#!/bin/sh
set -e
set -x

echo "== Rematto Xcode Cloud post-clone: installing Node, JS deps and CocoaPods =="

# Xcode Cloud images do not ship Node.js/npm by default. Install via Homebrew.
brew install node

cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

cd ios
pod install
