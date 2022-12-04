/**
 * User avatar file metadata
 */
export interface UserAvatarFileMetadata {
  /**
   * The user id of the avatar file.
   */
  userId: string;
  updateAt: Date;
  createAt: Date;

  /**
   * Name of the file on the uploader's computer.
   */
  fileName: string;
}
