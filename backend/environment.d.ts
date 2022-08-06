declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			HOSTNAME?: string;
			PWD: string;
		}
	}
}
export {};
