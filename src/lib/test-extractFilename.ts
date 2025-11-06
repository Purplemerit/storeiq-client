/**
 * Test script for filename extraction utility
 */

import { extractMeaningfulFilename, extractRawFilename } from './extractFilename';

// Test cases
const testCases = [
  {
    input: 'videos/Ethan/sustainable-living-tips-feature-a-young-female-1762402988644-09ff3d85.mp4',
    expectedDisplay: 'Sustainable Living Tips Feature A Young Female',
    expectedRaw: 'sustainable-living-tips-feature-a-young-female'
  },
  {
    input: 'sustainable-living-tips-1762402988644-09ff3d85.mp4',
    expectedDisplay: 'Sustainable Living Tips',
    expectedRaw: 'sustainable-living-tips'
  },
  {
    input: 'person-jogging-in-the-park-1762402988644-09ff3d85.mp4',
    expectedDisplay: 'Person Jogging In The Park',
    expectedRaw: 'person-jogging-in-the-park'
  },
  {
    input: 'videos/user123/video-1762402988644-09ff3d85.mp4',
    expectedDisplay: 'Video',
    expectedRaw: 'video'
  },
  {
    input: undefined,
    expectedDisplay: 'Untitled Video',
    expectedRaw: 'untitled-video'
  },
  {
    input: '',
    expectedDisplay: 'Untitled Video',
    expectedRaw: 'untitled-video'
  }
];

console.log('Testing Filename Extraction Utility\n');
console.log('='.repeat(80));

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`Input: ${testCase.input || '(empty)'}`);
  
  const displayResult = extractMeaningfulFilename(testCase.input);
  const rawResult = extractRawFilename(testCase.input);
  
  const displayPass = displayResult === testCase.expectedDisplay ? '✓' : '✗';
  const rawPass = rawResult === testCase.expectedRaw ? '✓' : '✗';
  
  console.log(`${displayPass} Display: "${displayResult}" ${displayPass === '✗' ? `(expected: "${testCase.expectedDisplay}")` : ''}`);
  console.log(`${rawPass} Raw: "${rawResult}" ${rawPass === '✗' ? `(expected: "${testCase.expectedRaw}")` : ''}`);
  console.log('-'.repeat(80));
});

console.log('\n✅ All tests completed!');
