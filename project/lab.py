r"""
Secure File Encryption Tool
---------------------------
Encrypts a text file with Fernet (symmetric, authenticated encryption),
decrypts it again, and verifies that the result matches the original.

Setup:
    python -m venv .venv
    .venv\Scripts\activate        (Windows)   or   source .venv/bin/activate
    pip install cryptography

Run:
    python lab.py
"""

from cryptography.fernet import Fernet

INPUT_FILE = "message1.txt"
ENCRYPTED_FILE = "message.enc"
DECRYPTED_FILE = "message_dec.txt"


def main():
    # Generate a key and build the cipher
    key = Fernet.generate_key()
    cipher = Fernet(key)

    # Read the original file
    with open(INPUT_FILE, "rb") as f:
        original_data = f.read()

    # Encrypt and save
    ciphertext = cipher.encrypt(original_data)
    with open(ENCRYPTED_FILE, "wb") as f:
        f.write(ciphertext)

    # Decrypt and save
    decrypted_data = cipher.decrypt(ciphertext)
    with open(DECRYPTED_FILE, "wb") as f:
        f.write(decrypted_data)

    print("Decryption successful! Data matches original:", original_data == decrypted_data)


if __name__ == "__main__":
    main()
