<script lang="ts">
	import { page } from '$app/state';

	const menu = new Map([
		['/', ''],
		['/hash', 'Hash：MD5、SHA1、HMAC等'],
		['/base64', 'Base64：编码、解码、媒体预览'],
		['/ades', '对称加解密：AES、DES、3DES'],
		['/genkey', '密钥对生成：RSA、ECDSA'],
		['/json', 'JSON：展开、压缩、去除转义'],
		['/datetime', '日期时间转换计算'],
		['/random', '随机生成器']
	]);
</script>

<svelte:head>
	<title>{menu.get(page.url.pathname) || '实用在线工具'}</title>
</svelte:head>

<nav>
	<ul>
		{#each menu as [k, v] (k)}
			<li data-current={page.url.pathname === k}>
				<a href={k}>{k === '/' ? '🏠' : '🔖'} {v}</a>
			</li>
		{/each}
	</ul>
</nav>
<main>
	<section>
		<slot />
	</section>
</main>

<style>
	nav {
		position: fixed;
		width: 290px;
		height: 100vh;
		border-right: 1px solid var(--border-light);
		overflow: hidden auto;
		scrollbar-width: none;
		&:hover {
			scrollbar-width: thin;
		}
		& > ul > li {
			line-height: 48px;
			white-space: nowrap;
			transition: 0.3s;
			&:hover {
				color: var(--blue);
			}
			&[data-current='true'] {
				color: var(--blue);
				background-color: var(--blue-fill);
			}
			& > a {
				display: inline-block;
				width: 100%;
				text-indent: 12px;
			}
		}
	}
	main {
		position: absolute;
		right: 0;
		width: calc(100% - 291px);
		min-height: 100vh;
		& > section {
			margin: 16px;
		}
	}
</style>
