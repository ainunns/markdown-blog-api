/**
 * Base class for all entities in the domain.
 * Entities have a unique identity and lifecycle
 */
export abstract class BaseEntity {
  public readonly id: number;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null;

  constructor(id: number) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;

    this.validate();
  }

  /**
   * Abstract validation method to be implemented by concrete entities.
   * Should throw an error if the entity is invalid
   */
  protected abstract validate(): void;

  /**
   * Check if this entity is equal to another entity.
   * Entities are equal if they have the same ID
   */
  public equals(entity: BaseEntity | null | undefined): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (!(entity instanceof BaseEntity)) {
      return false;
    }

    return this.id === entity.id;
  }

  /**
   * Check if the entity is soft deleted
   */
  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  /**
   * Mark the entity as deleted (soft delete)
   */
  public markAsDeleted(): void {
    if (this.deletedAt === null) {
      this.deletedAt = new Date();
      this.updatedAt = new Date();
    }
  }

  /**
   * Restore a soft-deleted entity
   */
  public restore(): void {
    if (this.deletedAt !== null) {
      this.deletedAt = null;
      this.updatedAt = new Date();
    }
  }

  /**
   * Update the timestamp when the entity is modified.
   * Should be called whenever the entity state changes
   */
  protected touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * Create a shallow clone of the entity.
   * Useful for creating new instances with modified properties
   */
  public clone(): this {
    const proto = Object.getPrototypeOf(this) as object;
    const clone = Object.create(proto) as this;
    return Object.assign(clone, this);
  }
}
