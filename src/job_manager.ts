class JobManager {
  private status: "pending" | "completed" | "error" = "pending";
  private completionTime: number = 0;

  constructor(private delayConfig: { minDelay: number; maxDelay: number }) {
    this.resetJob();
    this.setCompletionTime();
  }

  public getStatus(): "pending" | "completed" | "error" {
    this.updateStatus();
    return this.status;
  }

  public resetJob(): void {
    this.status = "pending";
    this.setCompletionTime();
  }

  private setCompletionTime(): void {
    this.completionTime = Date.now() + Math.floor(
      Math.random() * (this.delayConfig.maxDelay - this.delayConfig.minDelay) + this.delayConfig.minDelay
    );
  }

  private simulateError(): boolean {
    return Math.random() < 0.1;
  }

  private updateStatus(): void {
    const currentTime = Date.now();
    if (this.simulateError()) {
      this.status = "error";
    } else if (currentTime >= this.completionTime) {
      this.status = "completed";
    }
  }
}

export default JobManager;
