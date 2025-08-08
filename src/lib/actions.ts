'use server';

import { smartJobAllocation, type SmartJobAllocationInput } from '@/ai/flows/smart-job-allocation';
import { cleaners } from '@/lib/data';

export async function getSmartAllocation(jobDescription: string) {
  try {
    const input: SmartJobAllocationInput = {
      jobDescription,
      availableCleaners: cleaners.map(c => ({
        cleanerId: c.id,
        skills: c.skills,
        location: c.location,
        availability: c.availability,
      })),
      clientPreferences: 'Prefers experienced cleaners. Non-smoker.',
    };

    const result = await smartJobAllocation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get smart allocation.' };
  }
}
