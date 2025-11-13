# 🔐 GPG Commit Signing Guide

All commits to `main` must be GPG-signed and verified to meet our branch protection rules.

## ✅ Why Sign Commits?

- Ensures authorship and integrity
- Prevents tampering and impersonation
- Enables GitHub's green “Verified” badge

---

## 🛠️ Step-by-Step Setup

### 1. Generate a GPG Key

```bash
gpg --full-generate-key
```

- Select: `(1) RSA and RSA`
- Key size: `4096`
- Expiration: `0` (never)
- Name: Your full name
- Email: Your GitHub email
- Comment: Optional (e.g., "PetPal commit signing key")
- Passphrase: Choose a secure one

### 2. Export Your Public Key

```bash
gpg --armor --export your-email@example.com
```

Copy the full block (`BEGIN` to `END`).

### 3. Add Key to GitHub

- Go to [GitHub → Settings → SSH and GPG keys](https://github.com/settings/keys)
- Click **New GPG key**
- Paste the key block and save

### 4. Configure Git

```bash
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
git config --global gpg.program "C:/Program Files (x86)/GnuPG/bin/gpg.exe"
```

Replace `YOUR_KEY_ID` with your long key ID (e.g., `xuawbd18y3`)

---

## 🧪 Test Your Setup

```bash
echo "test" | gpg --clearsign
```

Then try:

```bash
git commit -S -m "Test signed commit"
```

Push and check for the green **Verified** badge on GitHub.

---

## 🧩 Troubleshooting

- `No secret key` → Check `gpg --list-secret-keys`
- `Commit not verified` → Amend and force-push:

```bash
git commit --amend -S --no-edit
git push --force-with-lease origin your-branch
```

---
Need help? Ping Intiser on Discord or check the `#petpal-team` channel.
