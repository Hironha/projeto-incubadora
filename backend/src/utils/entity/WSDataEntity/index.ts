import type { RawData } from 'ws';

export class WSDataEntity<T> {
	constructor(
		private payload: string | Blob | RawData,
		private isBinary: boolean = false
	) {}

	public async string() {
		return await this.payloadToString();
	}

	public async json() {
		const payloadStringified = await this.payloadToString();
		return payloadStringified ? this.toJSON(payloadStringified) : null;
	}

	protected async payloadToString() {
		if (this.isBinary) return await (this.payload as Blob).text();
		if (typeof this.payload === 'string') return this.payload;
		if (Buffer.isBuffer(this.payload))
			return JSON.stringify(this.payload.toString());
		return null;
	}

	protected toJSON(json: string) {
		try {
			return JSON.parse(json) as T;
		} catch (err) {
			return null;
		}
	}
}
