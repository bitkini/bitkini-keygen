#!/usr/bin/env node
// gen-kini.js

const bitcoin = require('bitcoinjs-lib');
const ecc     = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const bip32   = require('bip32');
const crypto  = require('crypto');
const chalk   = require('chalk');
const { execSync } = require('child_process');
const argv    = require('minimist')(process.argv.slice(2), {
  alias:   { c: 'count' },
  default: { count: 2 },    // presale1 + presale2
});

const COUNT   = argv.count;
const DATADIR = process.env.DATADIR;
if (!DATADIR) {
  console.error('❌ Please set DATADIR (e.g. export DATADIR=~/bitkini-maindata)');
  process.exit(1);
}

// Bitkini mainnet params
const kiniNet = {
  messagePrefix: '\x18Bitkini Signed Message:\n',
  bech32:        'kini',
  bip32: {
    public:  0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x2d,
  scriptHash: 0x2d,
  wif:        0x80,
};

console.log(chalk.cyan.bold('\n🌴🏖️  Bitkini HD Key Generator  🍹☀️\n'));

for (let i = 0; i < COUNT; i++) {
  // 1) Generate a new HD root seed
  const seed = crypto.randomBytes(64);
  const root = bip32.fromSeed(seed, kiniNet);
  const xprv = root.toBase58();

  // 2) Derive the first child at m/0/0
  const child   = root.derivePath('m/0/0');
  const keyPair = ECPairFactory(ecc).fromPrivateKey(child.privateKey, { network: kiniNet });
  const wif     = keyPair.toWIF();
  const pubhex  = keyPair.publicKey.toString('hex');
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: kiniNet });

  // 3) Build a ranged descriptor and fetch its checksum
  const rawDesc     = `pk(${xprv}/0/*)`;
  const info        = execSync(
    `./bitkini-cli -datadir="${DATADIR}" getdescriptorinfo "${rawDesc}"`
  ).toString();
  const checksum    = JSON.parse(info).checksum;
  const descRanged  = `${rawDesc}#${checksum}`;

  // 4) Print everything out
  console.log(chalk.yellow('───────────────────────────────────────────'));
  console.log(chalk.green.bold(`HD Root #${i+1}`));
  console.log(`${chalk.magenta('Master XPRV:           ')} ${xprv}`);
  console.log(`${chalk.magenta('Sample Child (m/0/0) → ')} ${address}`);
  console.log(`${chalk.magenta('Child WIF:             ')} ${wif}`);
  console.log(`${chalk.magenta('Child PubKey:          ')} ${pubhex}`);
  console.log(chalk.blue(`
# Import as active, ranged descriptor for presale${i+1}:`));
  console.log(
    `./bitkini-cli -datadir="${DATADIR}" -rpcwallet=presale${i+1} importdescriptors ` +
    `\'[{\"desc\":\"${descRanged}\",\"active\":true,\"range\":[0,0],\"timestamp\":0}]\'`
  );
  console.log();
}

console.log(chalk.yellow('───────────────────────────────────────────\n'));
console.log(
  chalk.blue.bold('✨  Run the above importdescriptors commands to auto-select your presale funds!  ✨\n')
);