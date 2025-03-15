<script lang="ts">
	import { copy, message } from '$lib';
	import Base64 from 'crypto-js/enc-base64';
	import Utf8 from 'crypto-js/enc-utf8';

	const mimetypes = [
		'application/pdf',
		'image/gif',
		'image/png',
		'image/jpeg',
		'image/bmp',
		'image/webp',
		'image/x-icon',
		'image/svg+xml',
		'audio/mpeg',
		'audio/ogg',
		'audio/wav',
		'video/mp4',
		'video/webm',
		'video/ogg'
	];

	let utf8 = $state(''),
		base64 = $state(''),
		files = $state(new DataTransfer().files),
		filename = $state(''),
		fileBase64 = $state(''),
		mimetype = $state(''),
		dataURL = $state('');

	const encode = () => {
		if (!utf8) return;
		base64 = Base64.stringify(Utf8.parse(utf8));
	};
	const decode = () => {
		if (!base64) return;
		try {
			utf8 = Base64.parse(base64).toString(Utf8);
		} catch {
			utf8 = '';
			message.error('解码失败');
		}
	};
	const clearText = () => {
		utf8 = '';
		base64 = '';
	};
	const readFile = () => {
		if (files.length < 1) return;
		filename = files[0].name;
		const reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = () => {
			let res = reader.result as string;
			let i = res.indexOf(':'),
				j = res.indexOf(';'),
				k = res.indexOf(',');
			if (i > 0 && j > 0 && k > 0) {
				let mt = res.slice(i + 1, j);
				if (mimetypes.includes(mt)) {
					mimetype = mt;
				} else {
					mimetype = '';
				}
				fileBase64 = res.slice(k + 1);
			}
		};
	};
	const clearFile = () => {
		filename = '';
		fileBase64 = '';
		mimetype = '';
		dataURL = '';
	};
	const preview = () => {
		dataURL = 'data:' + mimetype + ';base64,' + fileBase64;
	};
</script>

<div class="form-item">
	<div class="form-label">utf8</div>
	<div class="form-content">
		<textarea bind:value={utf8}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-primary" disabled={!utf8} onclick={encode}> 编码 ⇓ </button>
		<button type="button" disabled={!base64} onclick={decode}>解码 ⇑</button>
		<button type="button" class="btn-danger" disabled={!utf8 && !base64} onclick={clearText}>
			清空
		</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">base64</div>
	<div class="form-content">
		<textarea bind:value={base64}></textarea>
	</div>
</div>
<hr />
<div class="form-item">
	<div class="form-label">读取文件</div>
	<div class="form-content">
		<div>
			<label class="btn">
				选择文件
				<input type="file" bind:files onchange={readFile} />
			</label>
			<span>{filename}</span>
		</div>
	</div>
</div>
<div class="form-item">
	<div class="form-label">base64编码</div>
	<div class="form-content">
		<textarea bind:value={fileBase64}></textarea>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<button
			type="button"
			class="btn-success"
			disabled={!fileBase64}
			onclick={() => copy(fileBase64)}
		>
			复制
		</button>
		<button type="button" class="btn-danger" disabled={!fileBase64} onclick={clearFile}>
			清空
		</button>
		<button type="button" class="btn-warning" disabled={!fileBase64 || !mimetype} onclick={preview}>
			预览
		</button>
		<select bind:value={mimetype}>
			<option value="">未知类型</option>
			{#each mimetypes as v (v)}
				<option value={v}>{v}</option>
			{/each}
		</select>
		<small>预览需编码和媒体类型相匹配</small>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<object data-show={!!dataURL} type={mimetype} data={dataURL} title="Preview">
			解码失败或浏览器不支持预览
		</object>
	</div>
</div>
