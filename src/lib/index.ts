class Message {
	#msg(text: string, theme: string, duration?: number) {
		const node = document.createElement('div');
		node.setAttribute('class', 'msg ' + theme);
		node.innerText = text;
		const body = document.querySelector('body');
		body?.appendChild(node);
		setTimeout(() => {
			body?.removeChild(node);
		}, duration || 3000);
	}
	success(text: string, duration?: number) {
		this.#msg(text, 'success', duration);
	}
	info(text: string, duration?: number) {
		this.#msg(text, 'info', duration);
	}
	warning(text: string, duration?: number) {
		this.#msg(text, 'warning', duration);
	}
	error(text: string, duration?: number) {
		this.#msg(text, 'error', duration);
	}
}

const message = new Message();

const copy = (text: string) => {
	if (!navigator.clipboard) {
		message.warning('当前环境不支持一键复制，请手动复制');
		return;
	}
	navigator.clipboard
		.writeText(text)
		.then(() => {
			message.success('复制成功');
		})
		.catch(() => {
			message.error('复制失败，请手动复制');
		});
};

export { message, copy };
