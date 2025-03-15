<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */

	import { copy } from '$lib';
	import { JSONEditor } from 'svelte-jsoneditor';

	let input = $state(''),
		content = $state({ json: null }),
		pretty = $state(false),
		tip = $state('');

	const check = () => {
		if (!input) {
			content.json = null;
			return;
		}
		try {
			let obj = JSON.parse(input);
			content.json = obj;
			tip = '';
		} catch (err) {
			content.json = null;
			tip = err.message;
		}
	};
	const spread = () => {
		if (!content.json) return;
		input = JSON.stringify(content.json, null, 2);
		pretty = true;
	};
	const compress = () => {
		if (!content.json) return;
		input = JSON.stringify(content.json);
		pretty = false;
	};
	function unMixed(v: any): any {
		if (!v) return v;
		switch (typeof v) {
			case 'string':
				return unString(v);
			case 'object':
				return unOjbect(v);
		}
		return v;
	}
	function unString(v: string): any {
		if ((v.startsWith('[') && v.endsWith(']')) || (v.startsWith('{') && v.endsWith('}'))) {
			try {
				let obj = JSON.parse(v);
				return unOjbect(obj);
			} catch {
				return v;
			}
		}
		return v;
	}
	function unOjbect(v: any): any {
		if (Array.isArray(v)) {
			let res: any[] = [];
			v.forEach((item) => {
				res.push(unMixed(item));
			});
			return res;
		} else {
			let res: { [key: string]: any } = {};
			for (let k in v) {
				res[k] = unMixed(v[k]);
			}
			return res;
		}
	}
	const unescape = () => {
		if (content.json) {
			let v = unOjbect(content.json);
			content.json = v;
			if (pretty) {
				input = JSON.stringify(v, null, 2);
			} else {
				input = JSON.stringify(v);
			}
		}
	};
	const clear = () => {
		input = '';
		content.json = null;
		pretty = false;
		tip = '';
	};
</script>

<div class="row">
	<button type="button" class="btn-primary" disabled={!input} onclick={spread}>格式化</button>
	<button type="button" disabled={!input} onclick={compress}>压缩</button>
	<button type="button" class="btn-warning" disabled={!input} onclick={unescape}>去转义</button>
	<button type="button" class="btn-success" disabled={!input} onclick={() => copy(input)}>
		复制
	</button>
	<button type="button" class="btn-danger" disabled={!input} onclick={clear}>清空</button>
</div>
<div class="row" data-show={!!tip}>
	<span class="text-error">{tip}</span>
</div>
<div class="row">
	<div class="col">
		<textarea rows="9" placeholder="在此粘贴或输入" bind:value={input} onchange={check}></textarea>
	</div>
	<div class="col">
		<JSONEditor {content} mainMenuBar={false} navigationBar={false} readOnly />
	</div>
</div>
