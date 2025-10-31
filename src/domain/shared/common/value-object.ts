/**
 * Base class for Value Objects.
 * Value Objects are immutable and identified by their attributes rather than an ID.
 * Two value objects are equal if all their attributes are equal
 */
export abstract class BaseValueObject<T extends Record<string, any>> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze({ ...props });
    this.validate();
  }

  /**
   * Abstract validation method to be implemented by concrete value objects.
   * Should throw an error if the value object is invalid
   */
  protected abstract validate(): void;

  /**
   * Check if this value object is equal to another value object.
   * Value objects are equal if all their properties are equal
   */
  public equals(vo?: BaseValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (!(vo instanceof BaseValueObject)) {
      return false;
    }

    return this.deepEquals(this.props, vo.props);
  }

  /**
   * Deep equality comparison for nested objects
   */
  private deepEquals(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (
      obj1 === null ||
      obj2 === null ||
      obj1 === undefined ||
      obj2 === undefined
    ) {
      return obj1 === obj2;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    // Handle Date objects
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }

    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }

      return obj1.every((item: unknown, index: number) =>
        this.deepEquals(item, (obj2 as unknown[])[index]),
      );
    }

    // Handle regular objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) =>
      this.deepEquals(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key],
      ),
    );
  }

  /**
   * Get a copy of the props.
   * Note: This returns a shallow copy of the frozen props
   */
  public getProps(): Readonly<T> {
    return this.props;
  }

  /**
   * Convert the value object to a plain object.
   * Useful for serialization
   */
  public toObject(): T {
    return { ...this.props };
  }

  /**
   * Convert the value object to JSON
   */
  public toJSON(): T {
    return this.toObject();
  }
}
