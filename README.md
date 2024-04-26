# Xy Chain Frontend
![Alt text](/public/frontend.png)

The Xy Chain Frontend is a simple user interface that connects with the [Xy Chain](https://github.com/IRISxiaowang/substrate-bank) Blockchain to provide basic functionalities.

## Introduction

This project aims to provide a user-friendly interface for interacting with the Xy Chain. It allows users to perform actions such as selecting accounts, sending basic extrinsics, and displaying current block number,account roles, addresses, and balances. It is designed to be intuitive and easy to use, even for users who are not familiar with blockchain technology.

## How To Use

You can interact with the Xy Chain Frontend using the provided commands.

### Prerequisite

Before you can use the Frontend project, set up [Xy Chain](https://github.com/IRISxiaowang/substrate-bank) and make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [Yarn](https://yarnpkg.com/) - Dependency management tool

You can download and install Node.js from the official website. Yarn can be installed using npm, which comes bundled with Node.js:

```bash
npm install -g yarn
```

Navigate to your project folder and install dependencies for this JS project with Yarn:

```bash
yarn install
```

### Getting Started

To get started with the Xy Chain Frontend, use the following cargo command:

```bash
yarn start
```

### Features

- Account Selection: Users can select an account from the list of available accounts.
- Sending Extrinsics: Users can send basic extrinsics to interact with the blockchain.
- Current Block Number: The Frontend displays the current block number.
- Account Roles: The Frontend displays the roles associated with each account.
- Account Addresses: The Frontend displays the addresses of each account.
- Account Balances: The Frontend displays the balances of each account.