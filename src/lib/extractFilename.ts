/**
 * Extract meaningful filename from S3 key or full path
 * Removes the timestamp and random hash from the end
 * 
 * Examples:
 * - "videos/Ethan/sustainable-living-tips-1762402988644-09ff3d85.mp4"
 *   -> "sustainable-living-tips"
 * 
 * - "sustainable-living-tips-feature-a-young-female-1762402988644-09ff3d85.mp4"
 *   -> "sustainable-living-tips-feature-a-young-female"
 * 
 * @param s3Key - S3 key or filename
 * @returns Clean filename without timestamp, hash, and extension
 */
export function extractMeaningfulFilename(s3Key: string | undefined): string {
  if (!s3Key) return 'Untitled Video';
  
  // Extract just the filename from the path (after last slash)
  const filename = s3Key.split('/').pop() || s3Key;
  
  // Remove the file extension (.mp4, .mov, etc.)
  const withoutExtension = filename.replace(/\.[^.]+$/, '');
  
  // Remove the timestamp and hash pattern: -TIMESTAMP-HASH
  // Pattern: -[digits]-[hex] at the end
  const meaningfulName = withoutExtension.replace(/-\d{13,}-[a-f0-9]{8,}$/i, '');
  
  // If nothing left (unlikely), return a default
  if (!meaningfulName || meaningfulName.trim().length === 0) {
    return 'Untitled Video';
  }
  
  // Convert hyphens to spaces and capitalize words for display
  return meaningfulName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract raw meaningful filename (without capitalizing)
 * Use this when you want the exact format (e.g., for IDs or keys)
 * 
 * @param s3Key - S3 key or filename
 * @returns Clean filename without timestamp, hash, and extension (lowercase with hyphens)
 */
export function extractRawFilename(s3Key: string | undefined): string {
  if (!s3Key) return 'untitled-video';
  
  const filename = s3Key.split('/').pop() || s3Key;
  const withoutExtension = filename.replace(/\.[^.]+$/, '');
  const meaningfulName = withoutExtension.replace(/-\d{13,}-[a-f0-9]{8,}$/i, '');
  
  return meaningfulName || 'untitled-video';
}
