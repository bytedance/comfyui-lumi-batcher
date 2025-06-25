import { type Expression } from '.';

export class RangeExpression implements Expression {
  constructor(
    private start: number,
    private end: number,
    private step: number,
    private startInclusive: boolean,
    private endInclusive: boolean,
  ) {}

  interpret(): number[] {
    const result = [];
    const precision = Math.max(
      this.getPrecision(this.start),
      this.getPrecision(this.end),
      this.getPrecision(this.step),
    );
    const factor = Math.pow(10, precision);

    const start = this.start * factor;
    const end = this.end * factor;
    const step = this.step * factor;
    const newStep = step > 0 ? step : -step;

    if (start > end) {
      for (
        let i = this.startInclusive ? start : start - newStep;
        this.endInclusive ? i >= end : i > end;
        i -= newStep
      ) {
        result.push(i / factor);
      }
    } else {
      for (
        let i = this.startInclusive ? start : start + newStep;
        this.endInclusive ? i <= end : i < end;
        i += newStep
      ) {
        result.push(i / factor);
      }
    }
    return result;
  }
  private getPrecision(num: number): number {
    const str = num.toString();
    const decimalIndex = str.indexOf('.');
    return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
  }
}
