#!/usr/bin/env node
// gen-kini.js
const bitcoin = require('bitcoinjs-lib');
const ecc     = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const bip32   = require('bip32');
const crypto  = require('crypto');
const chalk   = require('chalk');
const { execSync } = require('child_process');

const argv = require('minimist')(process.argv.slice(2), {
  alias: { c: 'count' },
  default: { count: 5 },
});
const COUNT = argv.count;

// Bitkini mainnet params
const kiniNet = {
  messagePrefix: '\x18Bitkini Signed Message:\n',
  bech32:        'kini',
  bip32: { public: 0x0488b21e, private: 0x0488ade4 },
  pubKeyHash:  0x2d,
  scriptHash:  0x2d,
  wif:          0x80,
};

console.log(chalk.cyan.bold('\n🌴🏖️  Bitkini HD Key Generator  🍹☀️\n'));

for (let i = 0; i < COUNT; i++) {
  // Generate a new HD root seed
  const seed = crypto.randomBytes(64);
  const root = bip32.fromSeed(seed, kiniNet);
  const xprv = root.toBase58();

  // Derive first child for verification (m/0/0)
  const child = root.derivePath('m/0/0');
  const keyPair = ECPairFactory(ecc).fromPrivateKey(child.privateKey, { network: kiniNet });
  const wif    = keyPair.toWIF();
  const pubhex = keyPair.publicKey.toString('hex');
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: kiniNet });

  // Build ranged descriptor and fetch checksum

  // Print block
  console.log(chalk.yellow('───────────────────────────────────────────'));
  console.log(chalk.green.bold(`HD Root #${i+1}`));
  console.log(`${chalk.magenta('Master XPRV:')} ${xprv}`);
  console.log(`${chalk.magenta('Sample Child Path (m/0/0)')}  → ${address}`);
  console.log(`${chalk.magenta('Child WIF:')} ${wif}`);
  console.log(`${chalk.magenta('Child PubKey:')} ${pubhex}`);
  console.log();
}

console.log(chalk.yellow('───────────────────────────────────────────\n'));
