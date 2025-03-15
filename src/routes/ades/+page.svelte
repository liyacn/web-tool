<script lang="ts">
	import { message } from '$lib';
	import CryptoJS from 'crypto-js';

	const algos = new Map([
		['AES', CryptoJS.AES],
		['DES', CryptoJS.DES],
		['3DES', CryptoJS.TripleDES]
	]);
	const modes = new Map([
		['ECB', { padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.ECB }],
		['CBC', { padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }],
		['CFB', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CFB }],
		['OFB', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.OFB }],
		['CTR', { padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CTR }]
	]);
	const encs = new Map([
		['Utf8', CryptoJS.enc.Utf8],
		['Base64', CryptoJS.enc.Base64],
		['Base64url', CryptoJS.enc.Base64url],
		['Hex', CryptoJS.enc.Hex]
	]);

	let algo = $state('AES'),
		mode = $state('ECB'),
		key = $state(''),
		iv = $state(''),
		enc = $state('Utf8'),
		plainText = $state(''),
		cipherText = $state('');

	const precheck = () => {
		let encoder = encs.get(enc);
		if (!encoder) return null;
		let oiv: CryptoJS.lib.WordArray | undefined;
		if (mode !== 'ECB') {
			oiv = encoder.parse(iv);
		}
		let cipherKey = encoder.parse(key);
		switch (algo) {
			case 'AES':
				if (cipherKey.sigBytes !== 16 && cipherKey.sigBytes !== 24 && cipherKey.sigBytes !== 32) {
					message.warning('密钥必须为16/24/32字节');
					return null;
				}
				if (oiv && oiv.sigBytes !== 16) {
					message.warning('向量必须为16字节');
					return null;
				}
				break;
			case 'DES':
				if (cipherKey.sigBytes !== 8) {
					message.warning('密钥必须为8字节');
					return null;
				}
				if (oiv && oiv.sigBytes !== 8) {
					message.warning('向量必须为8字节');
					return null;
				}
				break;
			case '3DES':
				if (cipherKey.sigBytes !== 24) {
					message.warning('密钥必须为24字节');
					return null;
				}
				if (oiv && oiv.sigBytes !== 8) {
					message.warning('向量必须为8字节');
					return null;
				}
				break;
			default:
				return null;
		}
		return {
			algo: algos.get(algo),
			key: cipherKey,
			options: { iv: oiv, ...modes.get(mode) }
		};
	};
	const encrypt = () => {
		let p = precheck();
		if (!p || !p.algo) return;
		cipherText = p.algo.encrypt(plainText, p.key, p.options).toString();
	};
	const decrypt = () => {
		let p = precheck();
		if (!p || !p.algo) return;
		try {
			plainText = p.algo.decrypt(cipherText, p.key, p.options).toString(CryptoJS.enc.Utf8);
		} catch {
			plainText = '';
			message.error('解密失败');
		}
	};
</script>

<div class="form-item">
	<div class="form-label">算法</div>
	<div class="form-content">
		{#each algos as [k] (k)}
			<label><input type="radio" bind:group={algo} value={k} />{k}</label>
		{/each}
	</div>
</div>
<div class="form-item">
	<div class="form-label">工作模式</div>
	<div class="form-content">
		{#each modes as [k] (k)}
			<label><input type="radio" bind:group={mode} value={k} />{k}</label>
		{/each}
	</div>
	<div class="form-content">
		<small>块模式ECB/CBC使用pkcs7填充，流模式CFB/OFB/CTR不填充</small>
	</div>
</div>
<div class="form-item">
	<div class="form-label">密钥 / 向量</div>
	<div class="form-content nowrap">
		<select bind:value={enc}>
			{#each encs as [k] (k)}
				<option value={k}>{k}</option>
			{/each}
		</select>
		<input type="text" placeholder="密钥：key" bind:value={key} />
		<input type="text" placeholder="向量：iv" data-visible={mode !== 'ECB'} bind:value={iv} />
	</div>
</div>
<div class="form-item">
	<div class="form-label">明文</div>
	<div class="form-content">
		<textarea bind:value={plainText}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-primary" onclick={encrypt}>加密 ⇓</button>
		<button type="button" onclick={decrypt}>解密 ⇑</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">密文</div>
	<div class="form-content">
		<textarea bind:value={cipherText}></textarea>
	</div>
</div>
