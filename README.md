# MovieMatrix

A Netflix-like web app built in Rust and Next.js that helps you choosing a movie you like.

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

## About the project

WIP

### Built with

[![Next][Next.js]][Next-url]
[![Rust][Rust]][Rust-url]

## Quick Start

### Environment variables

The .env is currently not loaded by the Next.js server and by the rust api, so you need to export the environment variables manually.

```bash
export TMDB_API_KEY=your_tmdb_api_key
```

### Requirements

- [Node.js](https://nodejs.org/en/) (v22.2.0)
- [pnpm](https://pnpm.io/) (v9.1.4)
- [Docker]
- [protobuf]

### Install dependencies

- Install node modules:

  ```bash
  pnpm install
  ```

- Install `cargo-watch` (for hot-reloading):

  ```bash
  cargo install cargo-watch
  ```

### Start the development server

This will start the development server at `http://localhost:3000` and the API server at `TBD`.

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

[contributors-shield]: https://img.shields.io/github/contributors/mathisbot/movie-matrix.svg?style=for-the-badge
[contributors-url]: https://github.com/mathisbot/movie-matrix/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/mathisbot/movie-matrix.svg?style=for-the-badge
[stars-url]: https://github.com/mathisbot/movie-matrix/stargazers
[issues-shield]: https://img.shields.io/github/issues/mathisbot/movie-matrix.svg?style=for-the-badge
[issues-url]: https://github.com/mathisbot/movie-matrix/issues
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Rust]: https://img.shields.io/badge/Rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white
[Next-url]: https://nextjs.org/
[Rust-url]: https://rust-lang.org/
