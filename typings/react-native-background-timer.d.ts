declare module 'react-native-background-timer' {
	class BackgroundTimer {
		public runBackgroundTimer(cb: () => void, time: number): void;
		public stopBackgroundTimer(): void;
		public start(): void;
		public stop(): void;
		public setInterval(cb: () => void, time: number): number;
		public clearInterval(intervalId: number): void;
	}

	const instance: BackgroundTimer;
	export default instance;
}