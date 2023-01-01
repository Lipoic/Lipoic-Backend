/**
 * The visibility of the classroom.
 */
export enum ClassroomVisibility {
  /**
   * Public classroom can be joined by anyone or search by anyone.
   */
  Public,
  /**
   * Non-public classroom can be joined by anyone with the invitation code or link.
   */
  NonPublic,
  /**
   * Private classroom can only be joined by the owner.
   */
  Private,
}
