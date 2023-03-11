/**
 * The visibility of the class.
 */
export enum ClassVisibility {
  /**
   * A public class can be joined by anyone or search by anyone.
   */
  Public,
  /**
   * A private class can be joined by anyone with the class id.
   */
  Private,
  /**
   */
  InviteOnly,
}
