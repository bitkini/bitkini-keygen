#!/usr/bin/env node
// gen-kini.js — BIP84 m/84'/0'/0'/0/{0,1,2}

const bitcoin          = require('bitcoinjs-lib')
const ecc              = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32            = BIP32Factory(ecc)
const crypto           = require('crypto')
const chalk            = require('chalk')
const argv             = require('minimist')(process.argv.slice(2), {
  alias:   { c: 'count' },
  default: { count: 5 },
})
const COUNT = argv.count

// Bitkini mainnet params
const kiniNet = {
  messagePrefix: '\x18Bitkini Signed Message:\n',
  bech32:        'kini',
  bip32: {
    public:  0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash:  0x2d,
  scriptHash:  0x2d,
  wif:          0x80,
}

console.log(chalk.cyan.bold('\n🌴🏖️  Bitkini HD Key Generator  🍹☀️\n'))

for (let i = 0; i < COUNT; i++) {
  // 1) New HD root
  const seed = crypto.randomBytes(64)
  const root = bip32.fromSeed(seed, kiniNet)
  const xprv = root.toBase58()

  console.log(chalk.yellow('───────────────────────────────────────────'))
  console.log(chalk.green.bold(`HD Root #${i+1}`))
  console.log(`${chalk.magenta('Master XPRV:')}          ${xprv}`)

  // 2) Derive three sample children at m/84'/0'/0'/0/{0,1,2}
  for (let idx = 0; idx < 3; idx++) {
    const path = `m/84'/0'/0'/0/${idx}`
    const child = root.derivePath(path)      // now valid

    // Native SegWit (P2WPKH)
    const { address, output: scriptPubKey } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: kiniNet,
    })

    console.log(`${chalk.magenta(`Sample #${idx+1} Path:`)} ${path}`)
    console.log(`${chalk.magenta(`Sample #${idx+1} Addr:`)} → ${address}`)
    console.log(`${chalk.magenta(`Sample #${idx+1} SPK:`)}  → ${scriptPubKey.toString('hex')}`)
    console.log()
  }
}

console.log(chalk.yellow('───────────────────────────────────────────\n'))
