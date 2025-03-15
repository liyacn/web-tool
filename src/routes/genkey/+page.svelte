<script lang="ts">
	const PRI = 'PRIVATE',
		PUB = 'PUBLIC';
	const bits = ['1024', '2048', '3072', '4096'];
	const curves = ['P-256', 'P-384', 'P-521'];

	let param = $state('2048'),
		prirow = $state(''),
		pripem = $state(''),
		pubrow = $state(''),
		pubpem = $state('');

	const formatKey = (buf: ArrayBuffer, head: string) => {
		let row = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buf))));
		let chunk = [`-----BEGIN ${head} KEY-----`];
		for (let i = 0; i < row.length; i += 64) {
			chunk.push(row.slice(i, i + 64));
		}
		chunk.push(`-----END ${head} KEY-----`);
		let pem = chunk.join('\n');
		return [row, pem];
	};
	const generate = async () => {
		[prirow, pripem, pubrow, pubpem] = ['', '', '', ''];
		let keyPair: CryptoKeyPair;
		if (param.startsWith('P')) {
			keyPair = await crypto.subtle.generateKey(
				{
					name: 'ECDSA',
					namedCurve: param
				},
				true,
				['sign', 'verify']
			);
		} else {
			keyPair = await crypto.subtle.generateKey(
				{
					name: 'RSASSA-PKCS1-v1_5',
					modulusLength: Number(param),
					publicExponent: new Uint8Array([1, 0, 1]),
					hash: 'SHA-256'
				},
				true,
				['sign', 'verify']
			);
		}
		let pri = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
		[prirow, pripem] = formatKey(pri, PRI);
		let pub = await crypto.subtle.exportKey('spki', keyPair.publicKey);
		[pubrow, pubpem] = formatKey(pub, PUB);
	};
</script>

{#if crypto.subtle}
	<div class="form-item">
		<div class="form-label">RSA密钥位数</div>
		<div class="form-content">
			{#each bits as v (v)}
				<label><input type="radio" bind:group={param} value={v} />{v}</label>
			{/each}
		</div>
		<div class="form-content">
			<small>主流编程语言和工具均支持PKCS8私钥和PKIX公钥，不再建议使用PKCS1格式。</small>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">ECDSA椭圆曲线</div>
		<div class="form-content">
			{#each curves as v (v)}
				<label><input type="radio" bind:group={param} value={v} />{v}</label>
			{/each}
		</div>
	</div>
	<div class="form-item">
		<div class="form-content">
			<button type="button" class="btn-primary" onclick={generate}>生成</button>
		</div>
	</div>
	<hr />
	<div class="form-item">
		<div class="form-label">私钥</div>
		<div class="form-content">
			<pre>{prirow}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label"></div>
		<div class="form-content">
			<pre>{pripem}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label">公钥</div>
		<div class="form-content">
			<pre>{pubrow}</pre>
		</div>
	</div>
	<div class="form-item">
		<div class="form-label"></div>
		<div class="form-content">
			<pre>{pubpem}</pre>
		</div>
	</div>
{:else}
	<p>当前环境不支持浏览器生成密钥</p>
{/if}
