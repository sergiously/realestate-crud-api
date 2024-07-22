# Real Estate CRUD API

## Description

Basic backend API REST CRUD themed on real estate post listings

## Instructions
- Install and run docker daemon
- Clone repository `main` branch
- `cd` to the cloned repository directory
- Run the following command: `docker-compose -f ./docker/docker-compose.yml up --build`
- Once the containers are up and running, visit `http://localhost:8080/api-docs` on your browser to view API definitions

## Technologies used

Based on Node.js with Typescript, with deployment using Docker. Main libraries and technologies used:
- PostgreSQL
- Sequelize
- Express

## Technical details

- Using esbuild with esbuild-plugin-tsc to implement the official Typescript compiler for traspilation

## Upcoming features

- Add dynamic currency conversion

## (Dev only) Pending fixes

- Fix JWT middleware to parse URL's with params

## Credits

Developed by Sergio N. Raggio
- Thanks to the folks at [NaranjaX](https://www.naranjax.com/) for being my first (and current) experience working with AWS with a talented team
- Many thanks to [FreeCodeCamp](https://www.freecodecamp.org) for helping me boost my knowledge of the technologies used in this project

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
