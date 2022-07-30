export interface IException {
	httpStatus: number;
	code: string;
	message: string;
}

export type ExceptionFactory = (
	options?: Partial<Pick<IException, 'httpStatus' | 'message'>>
) => IException;
