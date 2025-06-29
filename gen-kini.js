#!/usr/bin/env node
const bitcoin = require('bitcoinjs-lib');
const ecc     = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const crypto  = require('crypto');
const chalk   = require('chalk');

const argv = require('minimist')(process.argv.slice(2), {
  alias: { c: 'count' },
  default: { count: 5 },
});
const COUNT = argv.count;

// Build ECPair with Node’s crypto RNG
const ECPair = ECPairFactory(ecc);
const { payments } = bitcoin;

// ——— Your Bitkini mainnet params ———
const kiniNet = {
  messagePrefix: '\x18Bitkini Signed Message:\n',
  bech32:        'kini',
  bip32: {
    public:  0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x2d,  // 45 decimal → Base58 “K…”
  scriptHash: 0x2d,  // same “K…” for P2SH
  wif:        0x80,  // 128 decimal → WIF prefix
};

// Header
console.log(chalk.cyan.bold('\n🌴🏖️  Bitkini Key Generator  🍹☀️\n'));

for (let i = 0; i < COUNT; i++) {
  // 1) Generate keypair
  const keyPair = ECPair.makeRandom({
    network: kiniNet,
    rng: size => crypto.randomBytes(size),
  });

  // 2) Extract components
  const privHex = keyPair.privateKey.toString('hex');
  const wif     = keyPair.toWIF();
  const pubHex  = keyPair.publicKey.toString('hex');
  const { address } = payments.p2pkh({
    pubkey:  Buffer.from(keyPair.publicKey),
    network: kiniNet,
  });

  // 3) Print a styled block
  console.log(chalk.yellow('───────────────────────────────────────────'));
  console.log(chalk.green.bold(`Key #${i+1}`));
  console.log(`${chalk.magenta('PrivKey (hex):')} ${privHex}`);
  console.log(`${chalk.magenta('WIF:          ')} ${chalk.white.bold(wif)}`);
  console.log(`${chalk.magenta('PubKey (hex): ')} ${pubHex}`);
  console.log(`${chalk.magenta('Address:      ')} ${chalk.white.bold(address)}`);
}

console.log(chalk.yellow('───────────────────────────────────────────\n'));
console.log(chalk.blue.bold('✨  Never share your private keys with anyone! Generate those only when you are offline.  ✨\n'));