/**
 * The visibility of the class.
 */
export enum ClassVisibility {
  /**
   * Public class can be joined by anyone or search by anyone.
   */
  Public,
  /**
   * Non-public class can be joined by anyone with the invitation code or link.
   */
  NonPublic,
  /**
   * Private class can only be joined by the owner.
   */
  Private,
}
