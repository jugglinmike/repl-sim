#!/bin/bash -e

tag=v$(node -p 'require("./package.json").version')

npm test
npm run build

git checkout --detach
git add *.js *.map
git commit --message "Release $tag"
git tag $tag

while true; do
  git show --stat
  read -p "Ready to publish (y/n)? " yn
  case $yn in
    [Yy]* )
      git push origin $tag;
      npm publish;
      break;;
    [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
  esac
done
