import { RangeExpression } from './range-expression';

export interface Expression {
  interpret: () => number[];
}

// 使用工厂方法创建表达式
export const ExpressionFactory = {
  create(expr: string): Expression {
    const match = expr.match(/\[([0-9.]+),([0-9.]+)\]:([0-9.]+)/);
    if (match) {
      return new RangeExpression(
        parseFloat(match[1]),
        parseFloat(match[2]),
        parseFloat(match[3]),
      );
    }
    throw new Error('Invalid expression format');
  },
};

// 解析表达式
export const getExpressionValue = (expr: string): (number | string)[] => {
  try {
    const expression = ExpressionFactory.create(expr);
    return expression.interpret();
  } catch (error) {
    return [expr];
  }
};
