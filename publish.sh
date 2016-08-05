#!/bin/bash -e

tag=$(node -p 'require("./package.json").version')

npm test
npm run build

git checkout --detach
git add *.js *.map
git commit --message "Release v.$tag"
git tag $tag

while true; do
  git show --stat
  read -p "Ready to publish (y/n)? " yn
  case $yn in
    [Yy]* )
      git push upstream $tag;
      npm publish;
      break;;
    [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
  esac
done
