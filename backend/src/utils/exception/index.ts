export interface IException {
	httpStatus: number;
	code: string;
	message: string;
}

export class Exception {
	private httpStatus: number;
	private code: string;
	private message: string;

	constructor({ code, httpStatus, message }: IException) {
		this.code = code;
		this.httpStatus = httpStatus;
		this.message = message;
	}

	public edit(
		args: Partial<Pick<IException, 'httpStatus' | 'message'>>
	): Exception {
		return new Exception({
			code: this.code,
			httpStatus: args.httpStatus || this.httpStatus,
			message: args.message || this.message,
		});
	}

	public export(): IException {
		return {
			code: this.code,
			httpStatus: this.httpStatus,
			message: this.message,
		};
	}
}
