Enonic XP Apps
===

[![Travis Build Status][travis-image]][travis-url]
[![License][license-image]][license-url]

Core applications for [Enonic XP](https://github.com/enonic/xp).

## Usage

Just copy the built JAR files to the `$XP_HOME/deploy` folder, or use the `deploy` task from the Gradle:

```
./gradlew deploy
```

## Building

#### Default

Run the following command to build all applications with default options:

```
./gradlew build
```

With default build, applications will use the remote `lib-admin-ui` dependency and the environment variable won't be set.

#### Environment

To use the specific environment, you must set its value explicitly with `env` parameter (only `prod` or `dev`):

```
./gradlew build -Penv=dev
```

If the environment is set, the Gradle will look for the local `lib-admin-ui` and `xp` repositories in the parent folder of your `xp-apps` repo. And if any present, will build them, along with building applications, instead of downloading the remote `lib-admin-ui` dependency.
The environment parameter will also be passed to `lib-admin-ui`.

Both environments are almost identical, except that building in the development environment will result in creating the DTS files, sourcemaps and other things, critical for the debugging.
The build itself may also be a bit slower sometimes. 

#### Quick

Sometimes, you may want to build your project faster. To do so, just skip the linting (`lint` task) and testing (`test` task):

```
./gradlew build -x lint -x test
```

In cases, when you set the environment type explicitly, skipping the `lint` or `test` will also result in skipping those two tasks in local `lib-admin-ui` build.

#### Clean

To rebuild the project from scratch, you may want to remove all compiles sources and dependencies. In that case, using `clean` command may not be enough. To remove the build and dependencies, use:

```
./gradlew flush
```

#### NPM upgrade

In case you want forcefully update all your node dependencies, use:

```
./gradlew npmInstallForce
```

Take a note, that you can also use aliases in Gradle, and `nIF` would be just enough to run `npmInstallForce`.

<!-- Links -->
[travis-url]:    https://travis-ci.org/enonic/xp-apps
[travis-image]:  https://travis-ci.org/enonic/xp-apps.svg?branch=master "Build status"
[license-url]:   LICENSE.txt
[license-image]: https://img.shields.io/github/license/enonic/lib-admin-ui.svg "GPL 3.0"
