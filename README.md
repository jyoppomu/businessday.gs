# Business day calculation module for Google Apps Script

## REQUIREMENTS

- [mise](https://mise.jdx.dev/)

## USAGE

### SETUP

1. install Node.js, pnpm dependencies and git hooks

  ```shell
  mise install
  ```

1. login to clasp

  ```shell
  mise run login
  ```

1. create new project

  ```shell
  mise run create
  ```

1. clone project with specifying project ID created by the previous step

  ```shell
  mise run clone <id>
  ```

### COMMANDS FOR GAS

- list available tasks

  ```shell
  mise tasks
  ```

- run tests

  ```shell
  mise run test
  ```

- build project

  ```shell
  mise run build
  ```

- push project (lint, format, test and build are run first)

  ```shell
  mise run push
  ```

- pull project

  ```shell
  mise run pull
  ```

- open project on the web

  ```shell
  mise run open
  ```

- create new version

  ```shell
  mise run version
  ```

- list versions

  ```shell
  mise run version:list
  ```

- create new deployment

  ```shell
  mise run deploy
  ```

- list deployments

  ```shell
  mise run deploy:list
  ```
