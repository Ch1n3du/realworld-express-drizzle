# realword

Implemented the [Realworld Backend Challenge](https://realworld.how) in Typescript.

## building

1. Clone the repo and `cd` into the directory:

    ```sh
    $ git clone https://github.com/ch1n3du/realworld
      ...
    $ cd realworld
    ```

2. Install dependencies:

    ```sh
    $ npm install
      ...
    ```

3. Run the `docker-compose.yml`:

    ```sh
    $ docker-compose up -d
      ...
    ```

4. Create a `.env` file with the following contents:

    ```env
    # Connection URL to your postgres database.
    # NOTE: You can change the 
    DB_URL="postgres://ch1n3du:password@localhost:5432/realworld"

    # Private Key for generating secure JWTs.
    JWT_SECRET="..."

    # Port for the server to listen on.
    PORT=...
    ```

## stack

- [Express.js]() - Server Framework
  - [Morgan]() - Logging
  - [Express-JWT](), [Bcrypt]() - Authentication

- [Drizzle]() - ORM

- [Zod]() - Data Validation
  - [Zod-Express-Middleware]()

## lessons learned

- I would not use express, it makes error handling a hassle, I think I'll look at trying [Nest.js]() for any future backend Node.js projects.

- Drizzle is nice but is currently lacking some very useful features.
