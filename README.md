# Varjo resosources

Simple resource/project allocation planning API.

## Key features

* Simple data model (project <-> allocation <-> user)
* List user's allocations
* List project's allocations
* Define metdata for projects, allocations and users
* Filter listings with metadata

## Overview

API is implemented using node.js with express.js and mongodb driver. Depends on MongoDB.

See `src/routes/*.js` for examples of requests.

## Building

Run `npm run build`

## Development

Run `npm run containers-start` to start a devleopment environment, API starts at port 3000 by default.
