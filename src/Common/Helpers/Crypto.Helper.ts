import * as cryptoJS from 'crypto-js';

export const CryptoHelper = {
	AES: {
		Encrypt: (text, key) => {
			var cipherText = cryptoJS.AES.encrypt(text, key).toString();
			return cipherText;
		},

		Decrypt: (ciphertext, key) => {
			var bytes = cryptoJS.AES.decrypt(ciphertext, key);
			var decryptedText = bytes.toString(cryptoJS.enc.Utf8);
			return decryptedText;
		}
	},

	TripleDES: {
		Encrypt: (text, key) => {
			key = cryptoJS.enc.Utf8.parse(key);
			const options = {
				mode: cryptoJS.mode.ECB,
				padding: cryptoJS.pad.Pkcs7
			};
			var cipherText = cryptoJS.TripleDES.encrypt(text, key, options).toString();
			return cipherText;
		},

		Decrypt: (ciphertext, key) => {
			key = cryptoJS.enc.Utf8.parse(key);
			const options = {
				mode: cryptoJS.mode.ECB,
				padding: cryptoJS.pad.Pkcs7
			};
			const bytes = cryptoJS.TripleDES.decrypt(ciphertext, key, options);
			return bytes.toString(cryptoJS.enc.Utf8);
		}
	}
};
