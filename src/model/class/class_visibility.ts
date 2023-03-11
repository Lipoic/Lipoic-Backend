/**
 * The visibility of the class.
 */
export enum ClassVisibility {
  /**
   * A public class can be joined by anyone or search by anyone.
   */
  Public,
  /**
   * A private class can be joined by anyone with the class ID.
   */
  Private,
  /**
   * An invite-only class can only be joined with an invitation from the owner.
   */
  InviteOnly,
}
