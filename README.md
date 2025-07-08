# Bitmovin Products Monorepo

This is a monorepo containing two Bitmovin-related applications managed with [Nx](https://nx.dev):

- `player`: A video player app using Bitmovin Player
- `simple-encoding`: A simple encoding pipeline app Using Bitmovin VOD encoding

## 🛠 Getting Started

### 1. Install Dependencies

`npm install`

### 2. Create .env Files

create .env files in both player and simple-encoding based on .env.sample files

### 3. run apps

simple-encoding: `nx serve simple-encoding`
player: `nx serve player`

NOTE: To run the simple-encoding app you will need an AWS account and an S# Bucket that allows Bitmovin to read/write. Please follow this guide to set up S3 Bucket https://developer.bitmovin.com/encoding/docs/creating-an-s3-encoding-input-or-output-with-the-bitmovin-api
