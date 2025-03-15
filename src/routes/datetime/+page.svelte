<script lang="ts">
	import { message } from '$lib';
	import { onMount } from 'svelte';

	const maxStamp = 253402185600;
	const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

	let stamp = $state(0),
		text = $state(''),
		local = $state(''),
		week = $state(0),
		stander = $state(''),
		utc = $state(''),
		date1 = $state(''),
		date2 = $state(''),
		dateDiff = $state(0),
		datebegin = $state(''),
		dateAdd = $state(0),
		dateResult = $state('');

	const format = (dt: Date) => {
		return (
			dt.getFullYear() +
			'-' +
			(dt.getMonth() + 1).toString().padStart(2, '0') +
			'-' +
			dt.getDate().toString().padStart(2, '0') +
			' ' +
			dt.toLocaleTimeString()
		);
	};
	const render = (t: number) => {
		let dt = new Date(t);
		stamp = (t / 1000) | 0;
		text = format(dt);
		local = dt.toLocaleString();
		week = dt.getDay();
		stander = dt.toString();
		utc = dt.toUTCString();
	};
	const setStamp = () => {
		if (stamp < -maxStamp || stamp > maxStamp) {
			message.warning('时间范围超出限制');
			return;
		}
		render(stamp * 1000);
	};
	const setText = () => {
		let t = Date.parse(text);
		if (isNaN(t)) {
			message.warning('时间日期格式错误');
			return;
		}
		render(t);
	};
	const calDiff = () => {
		let t1 = Date.parse(date1),
			t2 = Date.parse(date2);
		if (isNaN(t1) || isNaN(t2)) {
			message.warning('日期格式错误');
			return;
		}
		dateDiff = Math.round((t2 - t1) / 86400000);
	};
	const calDate = () => {
		let t = Date.parse(datebegin);
		if (isNaN(t)) {
			message.warning('日期格式错误');
			return;
		}
		t += dateAdd * 86400000;
		let dt = new Date(t);
		dateResult = dt.toLocaleDateString();
	};
	const setNow = () => render(Date.now());
	onMount(setNow);
</script>

<div class="form-item">
	<div class="form-content">
		<button type="button" class="btn-primary" onclick={setNow}>刷新当前</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">时间戳（秒）</div>
	<div class="form-content">
		<input type="number" min={-maxStamp} max={maxStamp} bind:value={stamp} />
		<button type="button" onclick={setStamp} disabled={stamp < -maxStamp || stamp > maxStamp}>
			转换
		</button>
	</div>
</div>
<div class="form-item">
	<div class="form-label">本地时间</div>
	<div class="form-content">
		<input type="text" bind:value={text} data-scale />
		<button type="button" onclick={setText} disabled={!text}>转换</button>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		{local} &nbsp;星期{weekdays[week]}<br />{stander}
	</div>
</div>
<div class="form-item">
	<div class="form-label">UTC时间</div>
	<div class="form-content">
		{utc}
	</div>
</div>
<hr />
<div class="form-item">
	<div class="form-label">计算日期差</div>
	<div class="form-content">
		<input type="date" bind:value={date1} />
		<span>距离</span>
		<input type="date" bind:value={date2} />
		<button type="button" disabled={!date1 || !date2} onclick={calDiff}>相差 ⇒</button>
		<span> {dateDiff} 天</span>
	</div>
</div>
<div class="form-item">
	<div class="form-content">
		<input type="date" bind:value={datebegin} />
		<span>+</span>
		<input type="number" min="-50000" max="50000" style="width: 80px" bind:value={dateAdd} />
		<span>天<small>（负数表示向前）</small></span>
		<button type="button" disabled={!datebegin || !dateAdd} onclick={calDate}>=</button>
		<span>{dateResult}</span>
	</div>
</div>
