# 🔑 bitkini-keygen

**Bitkini Priv Key Generator**  
Generates Bitkini mainnet private keys (raw hex & WIF), compressed public keys, and `K...` P2PKH addresses in a fun summer-vibe CLI. ☀️🍹

---

## 📋 Prerequisites

- Node.js v14+ (tested on v18)
- npm (comes with Node.js)

---

## 🚀 Installation


# 1. Option A: Install from npm (recommended)
```bash
npm install -g bitkini-keygen
```


# Option B: Clone the repo for development
```bash
git clone https://github.com/bitkini/bitkini-keygen.git
cd bitkini-keygen
npm install
chmod +x gen-kini.js  # optional: make CLI executable locally
```


## 🛠 Usage

The script generates a customizable number of Bitkini key blocks:


# Default (5 key blocks)
```bash
bitkini-keygen
```

# Specify number of keys
```bash
bitkini-keygen --count 20
```

# Or shorthand:
```bash
bitkini-keygen -c 10
```

# Or run it directly:
```bash
node gen-kini.js --count 7
```