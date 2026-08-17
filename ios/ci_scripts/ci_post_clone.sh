#!/bin/sh
set -e
set -x

echo "== Rematto Xcode Cloud post-clone: installing JS deps and CocoaPods =="

cd "$CI_PRIMARY_REPOSITORY_PATH"

# Node/npm are pre-installed on Xcode Cloud images
npm install

cd ios
pod install
