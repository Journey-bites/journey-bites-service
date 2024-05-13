# Journey bites service

A api service for journey bites

## Prerequisites

Before running this project, you must have the following installed:

- Node.js (**v20.9.0** or later)
- PNPM (**v9.0.0** or later)

## Installation

1. Clone this repository to your local machine.
2. Run `pnpm install` in the project directory to install all required dependencies.
3. Create a `.env` file at the root directory of the project and add the necessary environment variables. See the `.env.sample` file for reference.

- `HOST`: the host of the server
- `PORT`: the port of the server
- `SALT_ROUNDS`: the number of rounds to use when hashing passwords
- `DATABASE_URL`: the URL of the Mongo DB
- `TOKEN_SECRET`: the secret to use when signing JWTs, example: `openssl rand hex 64`

4. Run `pnpm prepare` to install Husky's Git hooks.
5. Run `pnpm db:generate` to generate the Prisma client.
6. Run `pnpm db:push` to push the database schema to the database.
7. Run `pnpm start` or `pnpm dev` to start the application.

## NPM scripts

Available development scripts:

- `pnpm prepare`： Installs Husky's Git hooks.
- `pnpm start`： Starts the application in production mode.
- `pnpm dev`： Starts the application in development mode.
- `pnpm build`： Builds the application.
- `pnpm lint`： Lints the codebase.
- `pnpm pretty`： Formats the codebase.
- `pnpm test`： Runs the test suite.
- `pnpm test:watch`： Runs the test suite in watch mode.
- `pnpm swagger:generate`： Generates the Swagger documentation.
- `pnpm db:generate`： Generates the Prisma client.
- `pnpm db:push`： Pushes the database schema to the database.

## Teach Stack

Technologies used in this project

- Node.js: JavaScript runtime
- Express.js: Web framework
- Prisma: Database toolkit
- MongoDB: Database
- JWT: Authentication
- Swagger: API documentation
- Jest: Testing framework
- Supertest: HTTP assertions
- Husky: Git hooks
- Prettier: Code formatter
- ESLint: Linter

### Commit Message Guidelines

#### Rules

To keep the commit history neat and easy to understand, we require all Git commit messages to follow the format:
`[type]: [title]`

- type

  - `build`：修改構建系統或外部依賴
  - `ci`：修改 CI 配置文件或腳本
  - `chore`：對非業務邏輯程式碼的更改，例如更新開發工具
  - `docs`：文件更新
  - `feat`：新增功能
  - `fix`：修復 bug
  - `perf`：改善程式的性能
  - `refactor`：重構程式碼，不添加新功能或修復 bug
  - `revert`：還原先前的 commit
  - `style`：改善程式碼風格，例如縮排、空格等
  - `test`：增加或修改測試程式

- title (sentence-case)
  - 簡短地描述提交的改變。主題應遵循句子格式，即首字母大寫，其餘字母小寫。 Ex:`This is an example of sentence case.`

#### Example

- `build: Update eslint config for production`
- `ci: Add GitHub Actions workflow for automated testing`
- `chore: Update project dependencies to latest versions`
- `docs: Add usage instructions to README`
- `feat: Add new user registration feature`
- `fix: Resolve login issue for locked accounts`
- `docs: Update API documentation`
- `perf: Optimize image loading for faster page rendering`
- `refactor: Simplify error handling in API client`
- `revert: Roll back to previous version of login form`
- `style: Enforce consistent indentation with Prettier`
- `test: Add unit tests for user registration endpoint`
