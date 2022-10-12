# backend-assessment-chigala-Enyeazu-



# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  www.github.com/backend-assessment-chigala-Enyeazu-
```
- Install dependencies
```
cd  backend-assessment-chigala-Enyeazu-
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

- API Document endpoints

   Endpoint : [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/19993901-16a25a43-5793-4b4e-beda-6406fbb567d5?action=collection%2Ffork&collection-url=entityId%3D19993901-16a25a43-5793-4b4e-beda-6406fbb567d5%26entityType%3Dcollection%26workspaceId%3Dc5852bd6-248a-440e-bdec-17ec29d890ee) 

 


# TypeScript + Node + express + knex + mysql
The main purpose of this repository is to show a project setup and workflow for writing microservice. The Rest APIs will be using the Swagger (OpenAPI) Specification.




## Getting TypeScript
Add Typescript to project `npm`.
```
npm install -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **config**               | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/databases**        | database migration, seeds and configs
| **src/dtos**             | class validators 
| **src/exceptions**       |  Error handling files. 
| **src/Interfaces**       | interface files for typescript 
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/services**          | functions for the individual routes  |
| **src/tests**           | test files for unit testing  |
| **src/utils**           | shareable functions   |
| **/server.ts**        | Entry point to express app                                                               |
| **/app.ts**             | contain express routers, database connections etc   
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config 


settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
### Configuring TypeScript compilation
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "target": "es2017",
    "lib": ["es2017", "esnext.asynciterable"],
    "typeRoots": ["node_modules/@types"],
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "module": "commonjs",
    "pretty": true,
    "sourceMap": true,
    "declaration": true,
    "outDir": "dist",
    "allowJs": true,
    "noEmit": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "importHelpers": true,
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@config": ["config"],
      "@controllers/*": ["controllers/*"],
      "@databases": ["databases"],
      "@dtos/*": ["dtos/*"],
      "@exceptions/*": ["exceptions/*"],
      "@interfaces/*": ["interfaces/*"],
      "@middlewares/*": ["middlewares/*"],
      "@models/*": ["models/*"],
      "@routes/*": ["routes/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.json", ".env", "src/databases/migrations/20221006074940_referencing.ts"],
  "exclude": ["node_modules", "src/http", "src/logs"]
}

```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/server.js. Can be invoked with `npm start`                  |
| `build`                   | copy the *.yaml file to dist/ folder      |
| `build:tsc`               | Full build. Runs ALL build tasks       |
| `build:dev`               | Full build. Runs ALL build tasks with all watch tasks        |
| `dev`                   | Runs full build before starting all watch tasks. Can be invoked with `npm dev`                                         |
| `test`                    | Runs build and run tests using supertest        |
| `lint`                    | Runs TSLint on project files       |
|`seed`                     | seeds the database                 |
|`migrate`                  | run database migration             |
| `make:seeder`             | make a seeder file                 |
| `make:migration`           | make a migration file             |
| `deploy:production`        | production deployment             |
| `deploy:dev`               | development deployment             |



### Using the debugger in VS Code
Node.js debugging in VS Code is easy to setup and even easier to use. 
Press `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

```json
{
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Program",
                "program": "${workspaceFolder}/dist/index.js",
                "preLaunchTask": "tsc: build - tsconfig.json",
               
                "outFiles": [
                    "${workspaceFolder}/dist/*js"
                ]
            },
           
            {
                // Name of configuration; appears in the launch configuration drop down menu.
                "name": "Run mocha",
                "request":"launch",
                // Type of configuration. Possible values: "node", "mono".
                "type": "node",
                // Workspace relative or absolute path to the program.
                "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
                
                // Automatically stop program after launch.
                "stopOnEntry": false,
                // Command line arguments passed to the program.
                "args": ["--no-timeouts", "--compilers", "ts:ts-node/register", "${workspaceRoot}/test/*"],
                
                // Workspace relative or absolute path to the working directory of the program being debugged. Default is the current workspace.
               
                // Workspace relative or absolute path to the runtime executable to be used. Default is the runtime executable on the PATH.
                "runtimeExecutable": null,
                // Environment variables passed to the program.
                "env": { "NODE_ENV": "test"}
            }
        ]
    }
```

## Testing
The tests are  written in Mocha and the assertions done using Chai

```
 "jest": "^28.1.1",
 "supertest": "^6.2.4",
  "ts-jest": "^28.0.7",
```

### Example index.test.ts
```
import request from "supertest";
import App from "@/app";
import IndexRoute from "@routes/index.route";

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing Index", () => {
  describe("[GET] /", () => {
    it("response statusCode 200", () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);
      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});

```
### Running tests using NPM Scripts
````
npm run test
````
Test files are created under test folder.

# TSLint
TSLint is a code linter that helps catch minor code quality and style issues.

## TSLint rules
All rules are configured through `tslint.json`.


## Running TSLint
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build:live   // runs full build including TSLint
npm run lint  // runs only TSLint
```


# Common Issues

## npm install fails
The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.
