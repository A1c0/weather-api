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

## Notes

Version 1 (no cache with dynamodb) is working (git tag v1).
For version 2, I don't understand why I can't write to the database (I haven't found anything in the cloudwatch logs).
