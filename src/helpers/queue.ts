/**
 *  Slightly different version of the Queue, as this version allows retrieving by group of items
 */

interface IQueue<T> {
  enqueue(item: T): void;
  dequeue(n: number): T[];
  clear(): void;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push({ ...item });
  }
  dequeue(n: number): T[] {
    const arr: T[] = [];
    let i = 0;
    while (i < n && this.size() > 0) {
      const item = this.storage.shift();
      item !== undefined && arr.push(item);
      i++;
    }
    return arr;
  }
  clear() {
    this.storage = [];
  }
  size(): number {
    return this.storage.length;
  }
}
