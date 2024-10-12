# Weather api

# How to deploy and run

## Prerequites

install Node.js and PNPM. I recommend to use [Proto](https://moonrepo.dev/proto) for this:
```sh
proto use # to pull pinned node and pnpm version
```

## Install and run the project

Install first the project dependencies with `pnpm`
```sh
pnpm install
```

Then you need to build the project
```sh
pnpm run build
```

And now you can deploy the API
```
pnpm run cdk deploy
```

