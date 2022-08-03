export abstract class Service<T, R> {
	public abstract exec(dto: T): Promise<R>;
}
